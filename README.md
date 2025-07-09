# 🖼️ Website Hero Screenshot Tool

A simple Node.js tool to automatically capture the **hero section (top part)** of multiple websites from a list of URLs and save each screenshot as a `.png` in an `images/` folder.

---

## 📦 What This Tool Does

✅ Reads a list of URLs from `urls.txt`  
✅ Visits each homepage using headless Chrome (via Puppeteer)  
✅ Captures the top 600px of the page (simulating a hero section)  
✅ Saves the screenshot in an `images/` folder with a clean filename  

---

## 📜 Full Setup & Usage Instructions

```bash
# 1. Create a new folder for the project
mkdir hero-screenshot-tool
cd hero-screenshot-tool

# 2. Initialize a Node.js project
npm init -y

# 3. Install required dependencies
npm install puppeteer fs

# 4. Create a file called urls.txt and add the websites you want to capture
# Example content for urls.txt (each URL on its own line):
echo "https://example.com
https://openai.com
https://dovepeakdigital.com" > urls.txt

# 5. Create a file called screenshot.js and paste the following code inside it:
cat << 'EOF' > screenshot.js
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
      console.log(\`Capturing: \${url}\`);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

      // Capture the top "hero" section of the page
      const screenshotPath = path.join(imageDir, sanitizeFilename(url));
      await page.setViewport({ width: 1280, height: 800 });
      await page.screenshot({
        path: screenshotPath,
        clip: { x: 0, y: 0, width: 1280, height: 600 } // Adjust height for hero
      });

      console.log(\`Saved: \${screenshotPath}\`);
    } catch (err) {
      console.error(\`Failed to capture \${url}:\`, err.message);
    }
  }

  await browser.close();
})();
EOF

# 6. Run the screenshot tool
node screenshot.js

# 7. Check the 'images' folder for your hero screenshots
```

---

## 📁 Example Output

After running the script, you'll have:

```
/hero-screenshot-tool
  ├── urls.txt
  ├── screenshot.js
  ├── images/
  │     ├── example.com.png
  │     ├── openai.com.png
  │     └── dovepeakdigital.com.png
```

---

## 🛠️ Optional: Customize Screenshot Height

You can edit `clip: { x: 0, y: 0, width: 1280, height: 600 }` in `screenshot.js` to increase or decrease the captured height.

---

## ✅ Done!

You're now ready to auto-capture hero screenshots from any list of websites.
