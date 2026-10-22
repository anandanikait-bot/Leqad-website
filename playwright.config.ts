import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const defaultChromium = existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined;

export default defineConfig({
  testDir: './test/browser',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  workers: 2,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    launchOptions: { executablePath: process.env.CHROMIUM_PATH || defaultChromium, args: ['--no-sandbox'] },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'PORT=4173 npm start',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
});
