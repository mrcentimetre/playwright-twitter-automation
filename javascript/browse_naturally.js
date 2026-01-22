const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');

// Add stealth plugin
chromium.use(stealth);

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

// Random sleep to simulate human behavior
function randomSleep(minSeconds = 1, maxSeconds = 5) {
    const ms = (Math.random() * (maxSeconds - minSeconds) + minSeconds) * 1000;
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Human-like scrolling
async function humanLikeScroll(page) {
    const scrollAmount = Math.floor(Math.random() * 500) + 300;
    await page.evaluate((amount) => {
        window.scrollBy(0, amount);
    }, scrollAmount);
    await randomSleep(1, 3);
}

// Natural browsing behavior
async function browseTwitterNaturally() {
    if (!fs.existsSync(COOKIES_FILE)) {
        console.error(`Error: ${COOKIES_FILE} not found!`);
        console.log('\nHow to export cookies:');
        console.log('1. Install "Cookie-Editor" extension in your browser');
        console.log('2. Go to twitter.com and make sure you\'re logged in');
        console.log('3. Click the Cookie-Editor extension icon');
        console.log('4. Click "Export" -> "Export as JSON"');
        console.log(`5. Save the file as "${COOKIES_FILE}" in this directory`);
        return;
    }

    console.log(`Loading cookies from ${COOKIES_FILE}...`);
    const rawCookies = JSON.parse(fs.readFileSync(COOKIES_FILE, 'utf8'));
    const cookies = convertCookies(rawCookies);

    // Random browsing duration between 2-10 minutes
    const browseDuration = Math.floor(Math.random() * 480 + 120); // 120-600 seconds
    const minutes = Math.floor(browseDuration / 60);
    const seconds = browseDuration % 60;
    
    console.log('\n' + '='.repeat(60));
    console.log('🤖 Starting natural browsing session');
    console.log(`📅 Time: ${new Date().toLocaleString()}`);
    console.log(`⏱️  Duration: ${minutes} minutes ${seconds} seconds`);
    console.log('='.repeat(60) + '\n');

    const browser = await chromium.launch({
        headless: false,
        args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox'
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
    const startTime = Date.now();
    const endTime = startTime + (browseDuration * 1000);

    try {
        console.log('🌐 Opening Twitter...');
        await page.goto('https://twitter.com/home');
        await randomSleep(2, 4);

        // Close any popups
        try {
            await page.getByTestId('app-bar-close').click({ timeout: 2000 });
        } catch (e) {
            // Ignore if popup doesn't exist
        }

        let actionCount = 0;

        while (Date.now() < endTime) {
            const remaining = Math.floor((endTime - Date.now()) / 1000);
            if (remaining <= 0) break;

            // Randomly choose an action
            const actions = ['scroll', 'read', 'explore', 'profile', 'trending'];
            const action = actions[Math.floor(Math.random() * actions.length)];

            actionCount++;
            console.log(`\n[${actionCount}] ⏱️  ${remaining}s remaining - Action: ${action}`);

            if (action === 'scroll') {
                // Scroll through timeline
                const scrollCount = Math.floor(Math.random() * 3) + 2;
                console.log(`  📜 Scrolling ${scrollCount} times...`);
                
                for (let i = 0; i < scrollCount; i++) {
                    await humanLikeScroll(page);
                    
                    // Occasionally stop to "read" a tweet
                    if (Math.random() < 0.3) {
                        console.log('  👀 Reading a tweet...');
                        await randomSleep(3, 8);
                    }
                }
            } else if (action === 'read') {
                // Stop and read the current view
                console.log('  📖 Reading tweets...');
                await randomSleep(5, 15);
            } else if (action === 'explore') {
                // Navigate to Explore page
                try {
                    console.log('  🔍 Checking Explore page...');
                    await page.goto('https://twitter.com/explore');
                    await randomSleep(2, 4);

                    // Scroll a bit
                    const scrolls = Math.floor(Math.random() * 2) + 1;
                    for (let i = 0; i < scrolls; i++) {
                        await humanLikeScroll(page);
                    }

                    await randomSleep(3, 7);

                    // Go back to home
                    await page.goto('https://twitter.com/home');
                    await randomSleep(2, 3);
                } catch (e) {
                    console.log(`  ⚠️  Could not access Explore: ${e.message}`);
                }
            } else if (action === 'profile') {
                // Check own profile occasionally
                try {
                    console.log('  👤 Checking profile...');
                    await page.goto('https://twitter.com/home');
                    await randomSleep(2, 4);
                    await humanLikeScroll(page);
                    await randomSleep(3, 6);
                } catch (e) {
                    console.log(`  ⚠️  Could not access profile: ${e.message}`);
                }
            } else if (action === 'trending') {
                // Look at trending topics
                try {
                    console.log('  🔥 Viewing trending topics...');
                    await page.goto('https://twitter.com/explore/tabs/trending');
                    await randomSleep(3, 6);

                    // Scroll through trending
                    const scrolls = Math.floor(Math.random() * 2) + 1;
                    for (let i = 0; i < scrolls; i++) {
                        await humanLikeScroll(page);
                    }

                    // Go back to home
                    await page.goto('https://twitter.com/home');
                    await randomSleep(2, 3);
                } catch (e) {
                    console.log(`  ⚠️  Could not access trending: ${e.message}`);
                }
            }

            // Random pause between actions
            await randomSleep(2, 5);
        }
    } catch (error) {
        console.log(`\n❌ Error during browsing: ${error.message}`);
    } finally {
        const actualDuration = Math.floor((Date.now() - startTime) / 1000);
        const finalMinutes = Math.floor(actualDuration / 60);
        const finalSeconds = actualDuration % 60;

        console.log('\n' + '='.repeat(60));
        console.log('✅ Browsing session completed!');
        console.log(`⏱️  Total time: ${finalMinutes} minutes ${finalSeconds} seconds`);
        console.log(`🎯 Actions performed: ${actionCount}`);
        console.log('='.repeat(60) + '\n');

        await randomSleep(2, 4);
        await context.close();
        await browser.close();
    }
}

// Schedule random browsing sessions
function scheduleRandomBrowsing() {
    console.log('\n🤖 Twitter Natural Browsing Scheduler');
    console.log('='.repeat(60));
    console.log('This will schedule random browsing sessions throughout the day');
    console.log('to make your account appear more human-like to X/Twitter.\n');

    // Schedule 3-5 random times per day
    const sessionsPerDay = Math.floor(Math.random() * 3) + 3;

    console.log(`📅 Scheduling ${sessionsPerDay} browsing sessions today...`);

    const scheduledTimes = [];
    for (let i = 0; i < sessionsPerDay; i++) {
        // Random hour between 8 AM and 11 PM
        const hour = Math.floor(Math.random() * 16) + 8;
        const minute = Math.floor(Math.random() * 60);

        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        scheduledTimes.push(timeStr);

        // Schedule the job
        const rule = new schedule.RecurrenceRule();
        rule.hour = hour;
        rule.minute = minute;

        schedule.scheduleJob(rule, async () => {
            console.log(`\n⏰ Scheduled browsing session starting at ${new Date().toLocaleTimeString()}...`);
            await browseTwitterNaturally();
        });

        console.log(`  ⏰ Session ${i + 1}: ${timeStr}`);
    }

    console.log('\n✅ Scheduled! Waiting for next session...');
    console.log('💡 Press Ctrl+C to stop the scheduler\n');

    // Keep the script running
    process.on('SIGINT', () => {
        console.log('\n\n👋 Scheduler stopped by user');
        process.exit(0);
    });
}

// Main function
async function main() {
    const command = process.argv[2];

    if (!command) {
        console.log('\nUsage:');
        console.log('  node browse_naturally.js browse    - Browse once now');
        console.log('  node browse_naturally.js schedule  - Schedule random browsing sessions');
        return;
    }

    if (command === 'browse') {
        await browseTwitterNaturally();
    } else if (command === 'schedule') {
        scheduleRandomBrowsing();
    } else {
        console.log(`Unknown command: ${command}`);
        console.log('\nAvailable commands:');
        console.log('  browse    - Browse once now');
        console.log('  schedule  - Schedule random browsing sessions');
    }
}

main();
