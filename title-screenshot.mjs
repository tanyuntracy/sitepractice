#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const URL = 'http://localhost:5174/sitepractice/';
const OUTPUT_DIR = join(process.cwd(), 'browser-check-output');

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 10000 });
  const screenshotPath = join(OUTPUT_DIR, 'title-check-1440x900.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Screenshot saved to:', screenshotPath);
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
