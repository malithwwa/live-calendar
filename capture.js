// capture.js
import { launch } from 'puppeteer';
import { join } from 'path';

(async () => {
  const browser = await launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=440,956'  // iPhone 17 Pro Max viewport
    ]
  });

  const page = await browser.newPage();

  // Set iPhone 14 Pro Max device metrics
  await page.setViewport({
    width: 1320,
    height: 2868,
    deviceScaleFactor: 3,  // Retina = 1290x2796 actual pixels
    isMobile: true
  });

  const url = process.env.VERCEL_URL || 'http://localhost:3000';
  
  console.log(`Screenshotting: ${url}`);
  
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Wait for any animations to settle
  await new Promise(resolve => setTimeout(resolve, 2000));

  const outputPath = join(__dirname, 'screenshots', 'wallpaper.png');

  await page.screenshot({
    path: outputPath,
    fullPage: false,  // only visible viewport, not scrollable content
    omitBackground: false
  });

  console.log(`Screenshot saved to: ${outputPath}`);

  await browser.close();
})();