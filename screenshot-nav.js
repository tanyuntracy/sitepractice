const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('https://tanyuntracy.github.io/sitepractice/', { waitUntil: 'networkidle' });
  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'nav-bottom-screenshot.png', fullPage: false });
  await browser.close();
})();
