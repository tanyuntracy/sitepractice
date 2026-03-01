const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function analyze() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    await page.goto('https://telescope.fyi/', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for content to load
    await page.waitForTimeout(3000);
    
    // Find the section with data-v-da6eccb3
    const section = await page.locator('[data-v-da6eccb3]').first();
    const count = await page.locator('[data-v-da6eccb3]').count();
    
    console.log('Sections with data-v-da6eccb3:', count);
    
    // Scroll to the section
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    
    // Take screenshot
    await section.screenshot({ path: path.join(__dirname, 'telescope-section.png') });
    console.log('Screenshot saved to telescope-section.png');
    
    // Get the HTML of the section and its parent
    const sectionHtml = await page.evaluate(() => {
      const el = document.querySelector('[data-v-da6eccb3]');
      if (!el) return 'NOT FOUND';
      return el.outerHTML.substring(0, 5000);
    });
    
    fs.writeFileSync(path.join(__dirname, 'section-html.txt'), sectionHtml);
    console.log('Section HTML saved');
    
    // Look for cursor-related CSS and JS
    const cursorStyles = await page.evaluate(() => {
      const styles = [];
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules || []) {
            const text = rule.cssText || '';
            if (text.includes('cursor') || text.includes('--mouse') || text.includes('pointer')) {
              styles.push(text.substring(0, 500));
            }
          }
        } catch (e) {}
      }
      return styles.slice(0, 20);
    });
    
    fs.writeFileSync(path.join(__dirname, 'cursor-styles.txt'), JSON.stringify(cursorStyles, null, 2));
    
    // Check for custom cursor on the section
    const cursorInfo = await page.evaluate(() => {
      const el = document.querySelector('[data-v-da6eccb3]');
      if (!el) return null;
      const style = window.getComputedStyle(el);
      return {
        cursor: style.cursor,
        pointerEvents: style.pointerEvents,
      };
    });
    console.log('Cursor info:', JSON.stringify(cursorInfo, null, 2));
    
    // Get all script sources
    const scripts = await page.evaluate(() => {
      return Array.from(document.scripts).map(s => s.src || 'inline').slice(0, 20);
    });
    fs.writeFileSync(path.join(__dirname, 'scripts.txt'), scripts.join('\n'));
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await browser.close();
  }
}

analyze();
