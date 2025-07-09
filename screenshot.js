const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');

// Read URLs from a file
const urls = fs.readFileSync('urls.txt', 'utf-8').split('\n').filter(Boolean);

// Create images folder if it doesn't exist
const imageDir = './images';
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}

// Function to sanitize file names
const sanitizeFilename = (url) => {
  return url.replace(/(^\w+:|^)\/\//, '')  // remove protocol
            .replace(/[\/\\?%*:|"<>]/g, '-')  // replace unsafe chars
            .replace(/\.+$/, '') + '.png';   // ensure .png extension
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const url of urls) {
    try {
      console.log(`Capturing: ${url}`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      // Capture just the "hero section" — top of the page
      const screenshotPath = path.join(imageDir, sanitizeFilename(url));
      await page.setViewport({ width: 1280, height: 800 });
      await page.screenshot({
        path: screenshotPath,
        clip: { x: 0, y: 0, width: 1280, height: 600 } // Adjust height for hero
      });

      console.log(`Saved: ${screenshotPath}`);
    } catch (err) {
      console.error(`Failed to capture ${url}:`, err.message);
    }
  }

  await browser.close();
})();
