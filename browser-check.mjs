#!/usr/bin/env node
/**
 * Browser check script: screenshots + video state + console errors
 */
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import { join } from 'path';

const URL = 'http://localhost:5174/sitepractice/';
const OUTPUT_DIR = join(process.cwd(), 'browser-check-output');

const videoCheckJS = `
const videos = document.querySelectorAll('video');
const results = [];
videos.forEach((v, i) => {
  results.push({
    index: i,
    src: v.currentSrc,
    sources: Array.from(v.querySelectorAll('source')).map(s => s.src),
    readyState: v.readyState,
    paused: v.paused,
    error: v.error ? v.error.message : null,
    networkState: v.networkState,
    loaded: v.dataset.loaded,
    muted: v.muted,
    autoplay: v.autoplay,
    poster: v.poster
  });
});
JSON.stringify(results, null, 2);
`;

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const consoleLogs = [];
  const consoleErrors = [];
  page.on('console', (msg) => {
    const text = msg.text();
    const type = msg.type();
    if (type === 'error') {
      consoleErrors.push(text);
    }
    consoleLogs.push({ type, text });
  });

  try {
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 10000 });
  } catch (e) {
    console.error('Failed to load page:', e.message);
    await browser.close();
    process.exit(1);
  }

  // 1. Screenshot of initial page
  await page.screenshot({ path: join(OUTPUT_DIR, '1-initial.png'), fullPage: false });
  console.log('Saved: 1-initial.png');

  // 2. Scroll to first video (second hero in section-1)
  const firstVideo = page.locator('#section-1 .hero').nth(1).locator('video');
  await firstVideo.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await page.screenshot({ path: join(OUTPUT_DIR, '2-first-video.png'), fullPage: false });
  console.log('Saved: 2-first-video.png');

  // 3. Run video check JS
  const videoResults = await page.evaluate(() => {
    const videos = document.querySelectorAll('video');
    const results = [];
    videos.forEach((v, i) => {
      results.push({
        index: i,
        src: v.currentSrc || null,
        sources: Array.from(v.querySelectorAll('source')).map(s => s.src),
        readyState: v.readyState,
        paused: v.paused,
        error: v.error ? v.error.message : null,
        networkState: v.networkState,
        loaded: v.dataset.loaded || null,
        muted: v.muted,
        autoplay: v.autoplay,
        poster: v.poster || null
      });
    });
    return results;
  });

  await browser.close();

  // Write report
  const report = {
    url: URL,
    timestamp: new Date().toISOString(),
    consoleErrors,
    videoResults,
    readyStateLegend: {
      0: 'HAVE_NOTHING',
      1: 'HAVE_METADATA',
      2: 'HAVE_CURRENT_DATA',
      3: 'HAVE_FUTURE_DATA',
      4: 'HAVE_ENOUGH_DATA'
    },
    networkStateLegend: {
      0: 'NETWORK_EMPTY',
      1: 'NETWORK_IDLE',
      2: 'NETWORK_LOADING',
      3: 'NETWORK_NO_SOURCE'
    }
  };

  writeFileSync(join(OUTPUT_DIR, 'report.json'), JSON.stringify(report, null, 2));
  console.log('Saved: report.json');

  // Print to stdout for easy copy
  console.log('\n--- Console Errors ---');
  console.log(consoleErrors.length ? consoleErrors.join('\n') : '(none)');
  console.log('\n--- Video Results ---');
  console.log(JSON.stringify(videoResults, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
