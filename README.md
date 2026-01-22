# Twitter Automation with Playwright

🤖 Automate Twitter posts **AND** natural browsing behavior using Playwright in both **Python** and **JavaScript/Node.js**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ⚠️ Important Notice

Due to **Twitter's strict bot detection and anti-automation measures**, only the **cookie export method works reliably**. Manual login methods are often blocked by Twitter's security systems.

**✅ Recommended:** Use the cookie export method described below.

## ✨ Features

- **Tweet Automation** - Post tweets programmatically
- **Natural Browsing Bot** 🤖 - Simulate human behavior to avoid bot detection
- **Random Scheduling** - Browse at random times throughout the day
- **Anti-Detection** - Human-like scrolling, reading pauses, and realistic patterns
- **Cookie-Based Authentication** - Reliable and bypasses bot detection

## 🚀 Quick Start

### Choose Your Language

This repository contains two separate implementations:

- **[Python Version](./python/)** - For Python developers
- **[JavaScript Version](./javascript/)** - For Node.js developers

Both versions have the same functionality and use the same cookie method.

## 📋 How It Works

### Method: Export Cookies (✅ Works Reliably)

This method bypasses Twitter's bot detection by using your real browser cookies:

1. **Export your Twitter cookies** using a browser extension
2. **Save them** as `twitter_cookies.json`
3. **Run the script** to post tweets or browse naturally

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

**Browse naturally:**
```bash
python3 browse_naturally.py browse
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

**Browse naturally:**
```bash
npm run browse
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

**Posting Tweets:**

Python:
```bash
cd python
python3 tweet.py cookies "Hello from Python automation!"
```

JavaScript:
```bash
cd javascript
node tweet.js cookies "Hello from Node.js automation!"
```

**Natural Browsing:**

Python:
```bash
cd python
python3 browse_naturally.py browse
```

JavaScript:
```bash
cd javascript
npm run browse
```

## 🎭 Natural Browsing Bot (NEW!)

Make your account appear more human-like to avoid X/Twitter bot detection by browsing naturally with realistic patterns.

### How It Works

The bot randomly performs these actions to mimic human behavior:

- **Scroll** 📜 - Random scrolling with occasional pauses to "read"
- **Read** 📖 - Stops and pauses for 5-15 seconds
- **Explore** 🔍 - Navigates to Explore page and browses
- **Trending** 🔥 - Views trending topics
- **Profile** 👤 - Checks profile section

### Usage

**Python:**
```bash
cd python
# Export your Twitter cookies using Cookie-Editor extension
# Save as twitter_cookies.json

# Browse once now
python browse_naturally.py browse

# Schedule random browsing sessions (3-5 times per day)
python browse_naturally.py schedule
```

**JavaScript:**
```bash
cd javascript
# Export your Twitter cookies using Cookie-Editor extension
# Save as twitter_cookies.json

# Browse once now
node browse_naturally.js browse
# or: npm run browse

# Schedule random browsing sessions (3-5 times per day)
node browse_naturally.js schedule
# or: npm run schedule
```

### Features

- ✅ Random session durations (2-10 minutes)
- ✅ Random delays between actions
- ✅ Realistic scrolling patterns
- ✅ Multiple browsing actions (scroll, read, explore, trending)
- ✅ Anti-detection techniques
- ✅ Scheduled sessions at random times (8 AM - 11 PM)
- ✅ Uses cookie authentication (reliable & secure)

### Sample Output

```
============================================================
🤖 Starting natural browsing session
📅 Time: 2026-01-22 14:23:15
⏱️  Duration: 6 minutes 42 seconds
============================================================

🌐 Opening Twitter...

[1] ⏱️  402s remaining - Action: scroll
  📜 Scrolling 3 times...
  👀 Reading a tweet...

[2] ⏱️  387s remaining - Action: trending
  🔥 Viewing trending topics...

============================================================
✅ Browsing session completed!
⏱️  Total time: 6 minutes 42 seconds
🎯 Actions performed: 18
============================================================
```

## 📁 Project Structure

```
.
├── python/
│   ├── tweet.py              # Python automation script
│   ├── browse_naturally.py   # Natural browsing bot
│   ├── requirements.txt      # Python dependencies
│   ├── README.md            # Python-specific docs
│   └── twitter_cookies.json # Exported cookies (you create this)
│
├── javascript/
│   ├── tweet.js             # JavaScript automation script
│   ├── browse_naturally.js  # Natural browsing bot
│   ├── package.json         # Node.js dependencies
│   ├── README.md           # JavaScript-specific docs
│   └── twitter_cookies.json # Exported cookies (you create this)
│
├── README.md               # This file
└── .gitignore             # Ignored files
```

## 🔒 Security

⚠️ **Important Security Notes:**

- **Never commit** `twitter_cookies.json` to Git (contains your credentials)
- **Never share** your cookie files with anyone
- **Regenerate cookies** if you suspect they've been compromised
- Files with sensitive data are already in `.gitignore`

## ❓ Troubleshooting

### "Could not log you in now" Error
- **Cause:** Twitter's bot detection blocking automated login
- **Solution:** Use the cookie export method instead (recommended)

### Tweet Not Posting / Browsing Not Working
- Verify cookies are fresh (export new ones if needed)
- Ensure you're logged into Twitter in your browser
- Check that `twitter_cookies.json` is in the correct directory
- Make sure the cookie file is valid JSON format

### "twitter_cookies.json not found"
- Export cookies using Cookie-Editor extension as described above
- Save the file in the correct directory (python/ or javascript/)
- File name must be exactly `twitter_cookies.json`

### Browser Not Opening
- Make sure Playwright browsers are installed:
  - Python: `playwright install chromium`
  - JavaScript: `npx playwright install chromium`

### Rate Limiting / Account Locked
- Reduce browsing frequency
- Increase delays between actions
- Use `browse` command manually instead of `schedule`
- Mix with real Twitter usage on your phone/browser
- Don't run too many sessions per day (3-5 is recommended)

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
