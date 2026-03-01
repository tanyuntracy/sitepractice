const { firefox } = require('playwright');

(async () => {
  const browser = await firefox.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 900 });

  try {
    await page.goto('http://localhost:5175/sitepractice/', { waitUntil: 'load' });
  } catch (e) {
    await page.goto('http://localhost:5176/sitepractice/', { waitUntil: 'load' });
  }

  await page.waitForTimeout(500);

  // 3. Run: document.querySelector('.sticky-nav').className
  const step3 = await page.evaluate(() => document.querySelector('.sticky-nav').className);
  console.log('3. After 500ms, .sticky-nav.className:', step3);

  // 4. Run: remove expanded + get className
  const step4 = await page.evaluate(() => {
    document.querySelector('.sticky-nav').classList.remove('expanded');
    return document.querySelector('.sticky-nav').className;
  });
  console.log('4. After remove("expanded"), .className:', step4);

  await page.waitForTimeout(2000);

  // 6. Run: className after 2s
  const step6 = await page.evaluate(() => document.querySelector('.sticky-nav').className);
  console.log('6. After 2s wait, .className:', step6);

  // 7. Run: script tags count
  const step7 = await page.evaluate(() => document.querySelectorAll('script').length);
  console.log('7. document.querySelectorAll("script").length:', step7);

  // 8. Fetch served HTML (same URL as current page)
  const step8Html = await page.evaluate(async () => {
    const r = await fetch(window.location.href);
    return r.text();
  });

  console.log('\n8. Served HTML (relevant parts):');
  // Count script tags referencing main.js
  const mainJsRefs = (step8Html.match(/main\.js/g) || []);
  console.log('   Script tags referencing main.js:', mainJsRefs.length);
  
  // Find nav element in HTML
  const navMatch = step8Html.match(/<nav[^>]*class="([^"]*)"[^>]*>/);
  if (navMatch) {
    console.log('   Nav element class in HTML:', navMatch[1]);
  } else {
    const navMatch2 = step8Html.match(/<nav[^>]*>/);
    console.log('   Nav element:', navMatch2 ? navMatch2[0] : 'not found');
  }

  // Show all script tags
  const scriptMatches = step8Html.match(/<script[^>]*>[\s\S]*?<\/script>|<script[^>]*\/>/g) || [];
  const scriptSrcs = step8Html.match(/<script[^>]+src="([^"]+)"[^>]*>/g) || [];
  console.log('   All script src refs:', scriptSrcs);

  await browser.close();
})();
