import { chromium } from '@playwright/test';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Capture 49 reduced-motion route and interaction states at seven widths.
// AUDIT_ORIGIN=http://127.0.0.1:4354 AUDIT_LABEL=before node scripts/capture-visual-followup.mjs
const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:4354';
const label = process.env.AUDIT_LABEL || 'before';
if (!['before', 'after'].includes(label)) throw new Error('AUDIT_LABEL must be before or after');
const output = resolve(`docs/screenshots/visual-followup/${label}`);
const routes = [['home', '/'], ['demo', '/demo'], ['about', '/about'], ['partners', '/partners']];
const widths = [320, 375, 390, 430, 768, 1024, 1440];
await mkdir(output, { recursive: true });
const writeJson = (name, value) => writeFile(`${output}/${name}.json`, JSON.stringify(value, null, 2) + '\n');
const executablePath = [process.env.CHROMIUM_PATH, '/usr/bin/chromium', '/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell', '/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell'].find(path => path && existsSync(path));

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
  if (await footerCanvas.count() && !await footerCanvas.getAttribute('data-capture-frozen')) {
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
    // Full-page screenshots resize Chromium's viewport and can clear an offscreen
    // canvas. Preserve its verified painted pixels at the same CSS bounds.
    await footerCanvas.evaluate(canvas => {
      const image = document.createElement('img');
      image.src = canvas.toDataURL();
      image.alt = '';
      image.setAttribute('aria-hidden', 'true');
      Object.assign(image.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none' });
      canvas.parentElement.append(image);
      canvas.style.visibility = 'hidden';
      canvas.setAttribute('data-capture-frozen', 'true');
    });
    await page.evaluate(() => Promise.all([...document.querySelectorAll('footer img')].filter(image => image.src.startsWith('data:')).map(image => image.decode())));
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(60);
}

async function capture(browser) {
  const responsive = [];
  const startedAt = new Date().toISOString();
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
          if (route === '/partners') {
            await page.getByRole('button', { name: /Prepare an Inquiry|Draft an Inquiry|Contact Leqad/i }).first().click();
            await page.getByRole('dialog').waitFor();
            await page.evaluate(() => document.fonts.ready);
            await page.screenshot({ path: `${output}/contact-dialog-${width}.png`, fullPage: true, animations: 'disabled' });
            entry.states.push({ state: 'contact dialog', ...await layout(page) });
          }
          if (route === '/demo') {
            for (const action of ['Start walkthrough', 'Select Top Plane', 'Start sketch', 'Draw rectangle']) {
              await page.getByRole('button', { name: action, exact: true }).click();
            }
            await page.getByTestId('sketch-profile').waitFor({ state: 'visible' });
            await settle(page);
            await page.screenshot({ path: `${output}/demo-drawn-rectangle-${width}.png`, fullPage: true, animations: 'disabled' });
            entry.states.push({ state: 'drawn rectangle', ...await layout(page) });
            for (const action of ['Set 40 × 30 mm dimensions', 'Finish sketch', 'Start Extrude', 'Create solid']) {
              await page.getByRole('button', { name: action, exact: true }).click();
            }
            await page.getByRole('heading', { name: "You've completed the interactive walkthrough." }).waitFor();
            await settle(page);
            await page.screenshot({ path: `${output}/demo-extruded-${width}.png`, fullPage: true, animations: 'disabled' });
            entry.states.push({ state: 'extruded solid', ...await layout(page) });
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
    }
  } finally {
    await writeJson('responsive', { origin, label, startedAt, completedAt: new Date().toISOString(), pages: responsive });
  }
  if (responsive.some(entry => entry.captureError)) process.exitCode = 1;
}

const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
try {
  await capture(browser);
} finally {
  await browser.close();
}
