require('dotenv').config();
const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const path = require('path');
const fs = require('fs');

// Add stealth plugin
chromium.use(stealth);

const AUTH_STATE_FILE = path.join(__dirname, 'twitter-auth.json');
const COOKIES_FILE = path.join(__dirname, 'twitter_cookies.json');

// Convert browser extension cookies to Playwright format
function convertCookies(rawCookies) {
    return rawCookies.map(cookie => {
        let sameSite = cookie.sameSite || 'Lax';
        
        // Normalize sameSite values
        if (!['Strict', 'Lax', 'None'].includes(sameSite)) {
            if (sameSite === 'no_restriction') {
                sameSite = 'None';
            } else if (sameSite === 'lax') {
                sameSite = 'Lax';
            } else if (sameSite === 'strict') {
                sameSite = 'Strict';
            } else {
                sameSite = 'Lax';
            }
        }

        return {
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path || '/',
            expires: cookie.expirationDate || -1,
            httpOnly: cookie.httpOnly || false,
            secure: cookie.secure || false,
            sameSite: sameSite
        };
    });
}

async function loginManually() {
    console.log('Opening browser for manual login...');
    const browser = await chromium.launch({ 
        headless: false,
        args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    });
    
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        locale: 'en-US',
        timezoneId: 'America/New_York'
    });
    
    const page = await context.newPage();
    
    await page.goto('https://twitter.com/login');
    
    console.log('\n=================================================');
    console.log('PLEASE LOG IN MANUALLY IN THE BROWSER WINDOW');
    console.log('After successful login, close the browser or press Ctrl+C');
    console.log('Waiting 120 seconds for you to complete login...');
    console.log('=================================================\n');
    
    // Wait for user to login manually
    await page.waitForTimeout(120000);
    
    // Save the authentication state
    await context.storageState({ path: AUTH_STATE_FILE });
    console.log(`\n✓ Session saved to ${AUTH_STATE_FILE}`);
    console.log('You can now use the saved session to send tweets!\n');

    await context.close();
    await browser.close();
}

async function sendTweetWithCookies(message) {
    if (!fs.existsSync(COOKIES_FILE)) {
        console.error(`Error: ${COOKIES_FILE} not found!`);
        console.log('\nHow to export cookies:');
        console.log('1. Install "Cookie-Editor" extension in your browser');
        console.log('2. Go to twitter.com and make sure you\'re logged in');
        console.log('3. Click the Cookie-Editor extension icon');
        console.log('4. Click "Export" -> "Export as JSON"');
        console.log(`5. Save the file as "${COOKIES_FILE}" in this directory`);
        console.log('\nAlternatively, you can use "EditThisCookie" or similar extensions.');
        return;
    }

    console.log(`Loading cookies from ${COOKIES_FILE}...`);
    const rawCookies = JSON.parse(fs.readFileSync(COOKIES_FILE, 'utf8'));
    const cookies = convertCookies(rawCookies);

    const browser = await chromium.launch({ 
        headless: false,
        args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    });
    
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        locale: 'en-US',
        timezoneId: 'America/New_York'
    });
    
    // Add cookies to context
    await context.addCookies(cookies);
    
    const page = await context.newPage();

    console.log('Navigating to Twitter...');
    await page.goto('https://twitter.com/home');
    await page.waitForTimeout(3000);
    
    // Close any popups if they appear
    try {
        await page.click('[data-testid="app-bar-close"]', { timeout: 2000 });
    } catch (e) {
        // Popup not present
    }
    
    console.log('Composing tweet...');
    await page.fill('[data-testid="tweetTextarea_0"]', message);
    await page.waitForTimeout(1000);
    
    console.log('Posting tweet...');
    await page.click('[data-testid="tweetButtonInline"]');
    
    console.log('✓ Tweet posted successfully!');
    await page.waitForTimeout(3000);

    await context.close();
    await browser.close();
}

async function sendTweet(message) {
    if (!fs.existsSync(AUTH_STATE_FILE)) {
        console.error(`Error: ${AUTH_STATE_FILE} not found!`);
        console.log('Please run "node tweet.js login" first to save your session.');
        return;
    }

    console.log('Loading saved session...');
    const browser = await chromium.launch({ 
        headless: false,
        args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage'
        ]
    });
    
    const context = await browser.newContext({
        storageState: AUTH_STATE_FILE,
        viewport: { width: 1280, height: 720 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        locale: 'en-US',
        timezoneId: 'America/New_York'
    });

    const page = await context.newPage();

    console.log('Navigating to tweet composer...');
    await page.goto('https://twitter.com/compose/tweet', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    console.log('Typing tweet message...');
    const textarea = await page.locator('[data-testid="tweetTextarea_0"]');
    await textarea.click();
    await page.waitForTimeout(500);
    await textarea.type(message, { delay: 100 });
    await page.waitForTimeout(1000);

    console.log('Clicking tweet button...');
    await page.click('[data-testid="tweetButtonInline"]');
    
    console.log('Tweet posted! Waiting to confirm...');
    await page.waitForTimeout(3000);
    
    await browser.close();
    console.log('Done!');
}

// Main execution
const command = process.argv[2];
const message = process.argv[3];

if (!command) {
    console.log('Usage:');
    console.log('  Login:           node tweet.js login');
    console.log('  Post (saved):    node tweet.js post "Your message"');
    console.log('  Post (cookies):  node tweet.js cookies "Your message"');
    process.exit(1);
}

(async () => {
    try {
        if (command === 'login') {
            await loginManually();
        } else if (command === 'post') {
            if (!message) {
                console.error('Error: Please provide a message to post');
                console.log('Usage: node tweet.js post "Your message here"');
                process.exit(1);
            }
            await sendTweet(message);
        } else if (command === 'cookies') {
            if (!message) {
                console.error('Error: Please provide a message to post');
                console.log('Usage: node tweet.js cookies "Your message here"');
                process.exit(1);
            }
            await sendTweetWithCookies(message);
        } else {
            console.error(`Unknown command: ${command}`);
            console.log('Available commands: login, post, cookies');
            process.exit(1);
        }
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
})();

