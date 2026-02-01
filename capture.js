// capture.js
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// This replaces __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=375,812'
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

  console.log(`Screenshotting: ${url}`);

  await page.goto(url, { waitUntil: 'networkidle0' });

  await new Promise(resolve => setTimeout(resolve, 2000));

  const outputPath = path.join(__dirname, 'screenshots', 'wallpaper.png');

  await page.screenshot({
    path: outputPath,
    fullPage: false,
    omitBackground: false
  });

  console.log(`Screenshot saved to: ${outputPath}`);

  await browser.close();
})();