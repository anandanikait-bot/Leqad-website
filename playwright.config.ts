import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const defaultChromium = [
  process.env.CHROMIUM_PATH,
  '/usr/bin/chromium',
  '/ms-playwright/chrome-headless-shell-linux64/chrome-headless-shell',
  '/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell',
].find(p => p && existsSync(p));

const origin = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173';
const port = new URL(origin).port || '4173';

export default defineConfig({
  testDir: './test/browser',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  workers: 2,
  use: {
    baseURL: origin,
    launchOptions: { executablePath: process.env.CHROMIUM_PATH || defaultChromium, args: ['--no-sandbox'] },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `PORT=${port} npm start`,
    url: origin,
    reuseExistingServer: !process.env.CI,
  },
});
