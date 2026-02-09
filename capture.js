// capture.js
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=375,812',
      '--disable-dev-shm-usage'
    ]
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 375,
    height: 812,
    deviceScaleFactor: 3,
    isMobile: true
  });

  const url = process.env.VERCEL_URL || 'http://localhost:3000';
  const urlWithTimestamp = `${url}?t=${Date.now()}`; // Cache-busting

  console.log(`Screenshotting: ${urlWithTimestamp}`);
  console.log(`Screenshot time: ${new Date().toISOString()}`);

  // Navigate to the page
  await page.goto(urlWithTimestamp, { 
    waitUntil: 'networkidle0',
    timeout: 30000 
  });

  // Wait for React to fully calculate Sri Lankan timezone date
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Grab the page content to verify correct date is showing
  const pageText = await page.evaluate(() => {
    const percent = document.querySelector('.percent-complete')?.textContent;
    const daysLeft = document.querySelector('.days-left')?.textContent;
    return { percent, daysLeft };
  });

  console.log(`Page content captured:`);
  console.log(`  Percent: ${pageText.percent}`);
  console.log(`  Days left: ${pageText.daysLeft}`);

  const outputPath = path.join(__dirname, 'screenshots', 'wallpaper.png');

  await page.screenshot({
    path: outputPath,
    fullPage: false,
    omitBackground: false
  });

  // Log the saved file size to confirm image is valid
  const stats = fs.statSync(outputPath);
  console.log(`Screenshot saved: ${outputPath}`);
  console.log(`File size: ${(stats.size / 1024).toFixed(2)} KB`);

  await browser.close();
})();