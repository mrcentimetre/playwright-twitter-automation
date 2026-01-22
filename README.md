# Twitter Automation with Playwright

🤖 Automate Twitter posts using Playwright in both **Python** and **JavaScript/Node.js**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ⚠️ Important Notice

Due to **Twitter's strict bot detection and anti-automation measures**, only the **cookie export method works reliably**. Manual login methods are often blocked by Twitter's security systems.

**✅ Recommended:** Use the cookie export method described below.

## 🚀 Quick Start

### Choose Your Language

This repository contains two separate implementations:

- **[Python Version](./python/)** - For Python developers
- **[JavaScript Version](./javascript/)** - For Node.js developers

Both versions have the same functionality and use the same method.

## 📋 How It Works

### Method: Export Cookies (✅ Works Reliably)

This method bypasses Twitter's bot detection by using your real browser cookies:

1. **Export your Twitter cookies** using a browser extension
2. **Save them** as `twitter_cookies.json`
3. **Run the script** to post tweets automatically

### Why Cookie Method?

- ✅ **Bypasses bot detection** - Uses real browser cookies
- ✅ **Most reliable** - Works consistently
- ✅ **No login required** - Already authenticated
- ❌ Manual login methods fail due to Twitter's anti-automation

## 🛠️ Installation & Usage

### Python

```bash
cd python
pip install -r requirements.txt
playwright install chromium
```

**Post a tweet:**
```bash
python3 tweet.py cookies "Your message here"
```

[📖 Full Python Documentation](./python/README.md)

### JavaScript/Node.js

```bash
cd javascript
npm install
npx playwright install chromium
```

**Post a tweet:**
```bash
node tweet.js cookies "Your message here"
```

[📖 Full JavaScript Documentation](./javascript/README.md)

## 📝 Step-by-Step Guide

### 1. Export Your Twitter Cookies

1. Install the [Cookie-Editor](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm) browser extension
   - Chrome/Edge: [Chrome Web Store](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm)
   - Firefox: [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/)

2. Go to **https://twitter.com** and log in to your account

3. Click the **Cookie-Editor** extension icon in your browser

4. Click **Export** → **Export as JSON**

5. Save the file as `twitter_cookies.json` in either:
   - `python/twitter_cookies.json` for Python version
   - `javascript/twitter_cookies.json` for JavaScript version

### 2. Run the Script

**Python:**
```bash
cd python
python3 tweet.py cookies "Hello from Python automation!"
```

**JavaScript:**
```bash
cd javascript
node tweet.js cookies "Hello from Node.js automation!"
```

## 🔒 Security

⚠️ **Important Security Notes:**

- **Never commit** `twitter_cookies.json` to Git (contains your credentials)
- **Never share** your cookie files with anyone
- **Regenerate cookies** if you suspect they've been compromised
- Files with sensitive data are already in `.gitignore`

## 📁 Project Structure

```
.
├── python/
│   ├── tweet.py              # Python automation script
│   ├── requirements.txt      # Python dependencies
│   ├── README.md            # Python-specific docs
│   └── .env.example         # Environment template
│
├── javascript/
│   ├── tweet.js             # JavaScript automation script
│   ├── package.json         # Node.js dependencies
│   ├── README.md           # JavaScript-specific docs
│   └── .env.example        # Environment template
│
├── README.md               # This file
└── .gitignore             # Ignored files
```

## ❓ Troubleshooting

### "Could not log you in now" Error
- **Cause:** Twitter's bot detection blocking automated login
- **Solution:** Use the cookie export method instead (recommended)

### Tweet Not Posting
- Verify cookies are fresh (export new ones if needed)
- Ensure you're logged into Twitter in your browser
- Check that `twitter_cookies.json` is in the correct directory

### Browser Not Opening
- Make sure Playwright browsers are installed:
  - Python: `playwright install chromium`
  - JavaScript: `npx playwright install chromium`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Disclaimer

This tool is for educational purposes only. Use responsibly and in accordance with Twitter's Terms of Service. The authors are not responsible for any misuse of this software.

## 🙏 Acknowledgments

- Built with [Playwright](https://playwright.dev/)
- Cookie export method for reliable automation
- Stealth mode to reduce detection (JavaScript version)

---

**Made with ❤️ for automation enthusiasts**

⭐ If this project helped you, consider giving it a star!
