# Twitter Automation - Python

Automate Twitter posts using Playwright and Python.

## Installation

```bash
pip install -r requirements.txt
playwright install chromium
```

## ⚠️ Important: Cookie Method Recommended

Due to Twitter's strict bot detection and anti-automation measures, **only the cookie export method works reliably**. The manual login method often fails or gets blocked by Twitter.

## Usage

### Method 1: Using Exported Cookies (✅ RECOMMENDED - Works Best!)

**Step 1: Export your Twitter cookies**

1. Install [Cookie-Editor](https://chrome.google.com/webstore/detail/cookie-editor/hlkenndednhfkekhgcdicdfddnkalmdm) extension in Chrome/Edge or [Firefox version](https://addons.mozilla.org/en-US/firefox/addon/cookie-editor/)
2. Go to **twitter.com** and log in to your account
3. Click the **Cookie-Editor** icon in your browser toolbar
4. Click **Export** → **Export as JSON**
5. Save the file as `twitter_cookies.json` in this directory

**Step 2: Post tweets**

```bash
python3 tweet.py cookies "Your tweet message here"
```

### Method 2: Manual Login (⚠️ May Not Work - Twitter Blocks Automation)

**Not recommended due to Twitter's bot detection. Use cookie method instead.**

```bash
# Login once (may fail due to Twitter's anti-bot measures)
python3 tweet.py login

# Post using saved session
python3 tweet.py post "Your message here"
```

## Files

- `tweet.py` - Main automation script
- `twitter_cookies.json` - Exported cookies (you create this)
- `twitter.json` - Saved session from manual login (auto-generated)
- `requirements.txt` - Python dependencies

## Troubleshooting

**"Could not log you in now" error:**
- This is Twitter's bot detection blocking automated logins
- **Solution:** Use the cookie export method instead

**Tweet not posting:**
- Verify your cookies are fresh (export new ones if needed)
- Make sure you're logged into Twitter in your browser
- Check that `twitter_cookies.json` is in the correct directory

## Security Notes

⚠️ **Never commit** `twitter_cookies.json` or `twitter.json` to Git - they contain your login credentials!

These files are already in `.gitignore` for your protection.
