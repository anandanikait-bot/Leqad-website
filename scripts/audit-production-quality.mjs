import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { resolve, relative, extname } from 'node:path';
import { gzipSync } from 'node:zlib';

// Run capture separately while a browser test suite is active. Run metrics alone
// on an otherwise idle host. These are Chromium lab samples, not field CWV.
const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:4351';
const label = process.env.AUDIT_LABEL || 'before';
const phase = process.env.AUDIT_PHASE || 'all';
if (!['before', 'after'].includes(label)) throw new Error('AUDIT_LABEL must be before or after');
if (!['all', 'capture', 'metrics'].includes(phase)) throw new Error('AUDIT_PHASE must be all, capture, or metrics');
const output = resolve(`docs/screenshots/production-quality/${label}`);
const dist = resolve(process.env.AUDIT_DIST || (label === 'before' && existsSync('/tmp/leqad-prod-baseline-dist') ? '/tmp/leqad-prod-baseline-dist' : 'dist'));
const routes = [['home', '/'], ['demo', '/demo'], ['about', '/about'], ['partners', '/partners']];
const widths = [320, 375, 390, 430, 768, 1024, 1440];
const samples = Number(process.env.AUDIT_SAMPLES || 3);
const sampleWindowMs = Number(process.env.AUDIT_SAMPLE_MS || 5000);
if (!Number.isInteger(samples) || samples < 1 || sampleWindowMs < 1000) throw new Error('Invalid sample configuration');
await mkdir(output, { recursive: true });
const writeJson = (name, value) => writeFile(`${output}/${name}.json`, JSON.stringify(value, null, 2) + '\n');
const executablePath = [process.env.CHROMIUM_PATH, '/usr/bin/chromium', '/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell', '/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell'].find(path => path && existsSync(path));

async function inventory() {
  const files = [];
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile()) {
        const bytes = (await stat(path)).size;
        const js = extname(path) === '.js';
        files.push({ path: relative(dist, path), bytes, ...(js ? { gzipBytes: gzipSync(await readFile(path)).byteLength } : {}) });
      }
    }
  }
  await walk(dist);
  const javascript = files.filter(file => file.path.endsWith('.js'));
  return {
    directory: dist,
    totalFiles: files.length,
    totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
    javascriptFiles: javascript.length,
    javascriptBytes: javascript.reduce((sum, file) => sum + file.bytes, 0),
    javascriptGzipBytes: javascript.reduce((sum, file) => sum + file.gzipBytes, 0),
    sourceMaps: files.filter(file => file.path.endsWith('.map')).length,
    archives: files.filter(file => /\.(?:zip|gz|br|tar|tgz|7z|rar)$/i.test(file.path)).length,
    files,
  };
}

function diagnostics(page) {
  const result = { pageErrors: [], consoleErrors: [], failedRequests: [], failedAssets: [] };
  page.on('pageerror', error => result.pageErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') result.consoleErrors.push(message.text()); });
  page.on('requestfailed', request => result.failedRequests.push({ url: request.url(), type: request.resourceType(), error: request.failure()?.errorText }));
  page.on('response', response => {
    if (response.status() >= 400) result.failedAssets.push({ url: response.url(), status: response.status(), type: response.request().resourceType() });
  });
  return result;
}

async function layout(page) {
  return page.evaluate(() => ({
    viewportWidth: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    overflowingElements: [...document.querySelectorAll('body *')].filter(element => {
      const box = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return box.width > 0 && style.position !== 'fixed' && (box.right > innerWidth + 1 || box.left < -1);
    }).slice(0, 25).map(element => ({ tag: element.tagName, id: element.id, class: String(element.className).slice(0, 180), left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right })),
    headings: [...document.querySelectorAll('h1')].map(element => element.textContent),
    fonts: document.fonts.status,
  }));
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  // Visit the page to activate IntersectionObserver-based artwork before capture.
  await page.evaluate(async () => {
    for (let top = 0; top < document.documentElement.scrollHeight; top += innerHeight * .8) {
      scrollTo(0, top);
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  });
  const footerCanvas = page.locator('footer canvas').first();
  if (await footerCanvas.count()) {
    await footerCanvas.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => {
      const canvas = document.querySelector('footer canvas');
      if (!canvas?.width || !canvas?.height) return false;
      const pixels = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
      let ink = 0;
      for (let index = 0; index < pixels.length; index += 4) {
        if (pixels[index] > 150 && pixels[index + 1] > 150 && pixels[index + 2] > 150 && pixels[index + 3] > 100) ink++;
      }
      return ink > 100;
    });
    // Let image load and resize callbacks finish while the artwork is visible.
    await page.waitForTimeout(180);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(60);
}

async function capture(browser) {
  const responsive = [];
  const accessibility = [];
  const startedAt = new Date().toISOString();
  async function scan(page, width, route, state) {
    const result = await new AxeBuilder({ page }).analyze();
    accessibility.push({ width, route, state, timestamp: result.timestamp, testEngine: result.testEngine,
      violations: result.violations, incomplete: result.incomplete,
      passes: result.passes.map(rule => ({ id: rule.id, nodeCount: rule.nodes.length })),
      inapplicable: result.inapplicable.map(rule => rule.id) });
  }
  try {
    for (const width of widths) {
      for (const [name, route] of routes) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        page.setDefaultTimeout(15000);
        const errors = diagnostics(page);
        const entry = { width, route, states: [], diagnostics: errors };
        responsive.push(entry);
        try {
          await page.goto(origin + route, { waitUntil: 'networkidle' });
          await settle(page);
          entry.states.push({ state: 'initial', ...await layout(page) });
          await page.screenshot({ path: `${output}/${name}-${width}.png`, fullPage: true, animations: 'disabled' });
          await scan(page, width, route, 'initial');
          if (route === '/partners') {
            await page.getByRole('button', { name: /Prepare an Inquiry|Draft an Inquiry|Contact Leqad/i }).first().click();
            await page.getByRole('dialog').waitFor();
            await page.evaluate(() => document.fonts.ready);
            await page.screenshot({ path: `${output}/contact-dialog-${width}.png`, fullPage: true, animations: 'disabled' });
            entry.states.push({ state: 'contact dialog', ...await layout(page) });
            await scan(page, width, route, 'contact dialog');
          }
          if (route === '/demo') {
            for (const action of ['Start walkthrough', 'Select Top Plane', 'Start sketch', 'Draw rectangle']) {
              await page.getByRole('button', { name: action, exact: true }).click();
            }
            await page.getByTestId('sketch-profile').waitFor({ state: 'visible' });
            await settle(page);
            await page.screenshot({ path: `${output}/demo-drawn-rectangle-${width}.png`, fullPage: true, animations: 'disabled' });
            entry.states.push({ state: 'drawn rectangle', ...await layout(page) });
            await scan(page, width, route, 'drawn rectangle');
            for (const action of ['Set 40 × 30 mm dimensions', 'Finish sketch', 'Start Extrude', 'Create solid']) {
              await page.getByRole('button', { name: action, exact: true }).click();
            }
            await page.getByRole('heading', { name: "You've completed the interactive walkthrough." }).waitFor();
            await settle(page);
            await page.screenshot({ path: `${output}/demo-extruded-${width}.png`, fullPage: true, animations: 'disabled' });
            entry.states.push({ state: 'extruded solid', ...await layout(page) });
            await scan(page, width, route, 'extruded solid');
          }
        } catch (error) {
          entry.captureError = String(error.stack || error);
          console.error(`Capture failed ${route} ${width}: ${error.message}`);
        } finally {
          await context.close();
          console.log(`Captured ${label} ${route} ${width}`);
        }
      }
      await writeJson('responsive', { origin, label, startedAt, completedAt: new Date().toISOString(), pages: responsive });
      await writeJson('accessibility', { origin, label, checks: accessibility });
    }
  } finally {
    await writeJson('responsive', { origin, label, startedAt, completedAt: new Date().toISOString(), pages: responsive });
    await writeJson('accessibility', { origin, label, checks: accessibility });
  }
  if (responsive.some(entry => entry.captureError)) process.exitCode = 1;
}

async function metrics(browser) {
  const measurements = [];
  const profiles = [
    { name: 'desktop', width: 1440, height: 900, cpuSlowdown: 4, network: { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 } },
    { name: 'mobile', width: 375, height: 900, cpuSlowdown: 4, network: { offline: false, latency: 150, downloadThroughput: 1600000 / 8, uploadThroughput: 750000 / 8, connectionType: 'cellular4g' } },
  ];
  for (let sample = 1; sample <= samples; sample++) {
    for (const profile of profiles) {
      for (const [name, route] of routes) {
        const context = await browser.newContext({ viewport: { width: profile.width, height: profile.height }, serviceWorkers: 'block' });
        const page = await context.newPage();
        const errors = diagnostics(page);
        const cdp = await context.newCDPSession(page);
        const requests = new Map();
        const entry = { sample, profile: profile.name, route, startedAt: new Date().toISOString(), diagnostics: errors };
        measurements.push(entry);
        try {
          await cdp.send('Network.enable');
          await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
          await cdp.send('Network.emulateNetworkConditions', profile.network);
          await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpuSlowdown });
          await cdp.send('Performance.enable');
          cdp.on('Network.requestWillBeSent', event => requests.set(event.requestId, { url: event.request.url, type: event.type, encodedBytes: 0 }));
          cdp.on('Network.responseReceived', event => {
            const request = requests.get(event.requestId);
            if (request) Object.assign(request, { status: event.response.status, mimeType: event.response.mimeType, fromDiskCache: event.response.fromDiskCache, fromServiceWorker: event.response.fromServiceWorker });
          });
          cdp.on('Network.loadingFinished', event => {
            const request = requests.get(event.requestId);
            if (request) request.encodedBytes = event.encodedDataLength;
          });
          await page.addInitScript(() => {
            window.__productionAudit = { lcp: null, cls: 0, longTasks: [] };
            new PerformanceObserver(list => {
              for (const entry of list.getEntries()) window.__productionAudit.lcp = { startTime: entry.startTime, renderTime: entry.renderTime, loadTime: entry.loadTime, size: entry.size, url: entry.url, element: entry.element?.tagName, text: entry.element?.textContent?.slice(0, 180) };
            }).observe({ type: 'largest-contentful-paint', buffered: true });
            // CLS is the largest session window, with a 1s gap and 5s maximum.
            let sessionStart = 0, lastShift = 0, sessionValue = 0;
            new PerformanceObserver(list => {
              for (const entry of list.getEntries()) {
                if (entry.hadRecentInput) continue;
                if (entry.startTime - lastShift < 1000 && entry.startTime - sessionStart < 5000) sessionValue += entry.value;
                else { sessionStart = entry.startTime; sessionValue = entry.value; }
                lastShift = entry.startTime;
                window.__productionAudit.cls = Math.max(window.__productionAudit.cls, sessionValue);
              }
            }).observe({ type: 'layout-shift', buffered: true });
            new PerformanceObserver(list => {
              for (const entry of list.getEntries()) window.__productionAudit.longTasks.push({ startTime: entry.startTime, duration: entry.duration });
            }).observe({ type: 'longtask', buffered: true });
          });
          const before = (await cdp.send('Performance.getMetrics')).metrics.find(metric => metric.name === 'TaskDuration')?.value || 0;
          await page.goto(origin + route, { waitUntil: 'load', timeout: 60000 });
          await page.waitForTimeout(sampleWindowMs);
          const after = (await cdp.send('Performance.getMetrics')).metrics.find(metric => metric.name === 'TaskDuration')?.value || 0;
          Object.assign(entry, await page.evaluate(() => {
            const resources = performance.getEntriesByType('resource').map(resource => ({ url: resource.name, initiatorType: resource.initiatorType, duration: resource.duration, encodedBodyBytes: resource.encodedBodySize, decodedBodyBytes: resource.decodedBodySize, transferBytes: resource.transferSize }));
            const js = resources.filter(resource => /\.m?js(?:\?|$)/.test(resource.url));
            const sum = (items, key) => items.reduce((total, item) => total + item[key], 0);
            return {
              ...window.__productionAudit,
              observedUntilMs: performance.now(),
              navigation: performance.getEntriesByType('navigation')[0]?.toJSON(),
              paint: performance.getEntriesByType('paint').map(entry => entry.toJSON()),
              resourceSummary: { requestCount: resources.length, encodedBodyBytes: sum(resources, 'encodedBodyBytes'), transferBytes: sum(resources, 'transferBytes'), javascriptRequests: js.length, javascriptEncodedBodyBytes: sum(js, 'encodedBodyBytes'), javascriptTransferBytes: sum(js, 'transferBytes') },
              resources,
              fontStatus: document.fonts.status,
            };
          }));
          entry.taskDurationMs = (after - before) * 1000;
          entry.longTaskSummary = { count: entry.longTasks.length, totalDurationMs: entry.longTasks.reduce((sum, task) => sum + task.duration, 0), totalBlockingTimeMs: entry.longTasks.reduce((sum, task) => sum + Math.max(0, task.duration - 50), 0) };
          const network = [...requests.values()];
          entry.network = { requestCount: network.length, encodedTransferBytes: network.reduce((sum, request) => sum + request.encodedBytes, 0), javascriptEncodedTransferBytes: network.filter(request => request.type === 'Script').reduce((sum, request) => sum + request.encodedBytes, 0), requests: network };
        } catch (error) {
          entry.measurementError = String(error.stack || error);
          process.exitCode = 1;
        } finally {
          await context.close();
          await writeJson('performance', { origin, label, browserVersion: browser.version(), sampleWindowMs, samplesPerRouteAndProfile: samples, profiles, methodology: 'Fresh browser context per navigation, HTTP cache disabled, service workers blocked. Motion enabled. Serial samples, CPU slowdown 4 on both profiles. Desktop network unthrottled; mobile 150ms latency, 1.6Mbps down, 750Kbps up. Observe for 5 seconds after load unless AUDIT_SAMPLE_MS overrides. Resource timing totals exclude the document; CDP network totals include it. Gzip sizes in build.json are offline gzip estimates, not observed HTTP content encoding.', inp: { value: null, reason: 'Unavailable. INP is a field interaction metric; these cold navigation samples have no user interactions or field data.' }, measurements });
          console.log(`Measured ${label} ${name} ${profile.name} sample ${sample}`);
        }
      }
    }
  }
}

await writeJson('build', await inventory());
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
try {
  if (phase !== 'metrics') await capture(browser);
  if (phase !== 'capture') await metrics(browser);
} finally {
  await browser.close();
}
