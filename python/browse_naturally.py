import os
import random
import time
import json
from datetime import datetime, timedelta
from playwright.sync_api import Playwright, sync_playwright
import schedule

COOKIES_FILE = "twitter_cookies.json"


def random_sleep(min_seconds=1, max_seconds=5):
    """Sleep for a random amount of time to simulate human behavior"""
    time.sleep(random.uniform(min_seconds, max_seconds))


def human_like_scroll(page):
    """Simulate human-like scrolling behavior"""
    scroll_amount = random.randint(300, 800)
    page.evaluate(f"window.scrollBy(0, {scroll_amount})")
    random_sleep(1, 3)


def browse_twitter_naturally(playwright: Playwright) -> None:
    """Browse Twitter like a real human for random duration"""
    if not os.path.exists(COOKIES_FILE):
        print(f"Error: {COOKIES_FILE} not found!")
        print("\nHow to export cookies:")
        print("1. Install 'Cookie-Editor' extension in your browser")
        print("2. Go to twitter.com and make sure you're logged in")
        print("3. Click the Cookie-Editor extension icon")
        print("4. Click 'Export' -> 'Export as JSON'")
        print(f"5. Save the file as '{COOKIES_FILE}' in this directory")
        return

    print(f"Loading cookies from {COOKIES_FILE}...")
    with open(COOKIES_FILE, 'r') as f:
        cookies_raw = json.load(f)
    
    # Convert cookies to Playwright format
    cookies = []
    for cookie in cookies_raw:
        # Handle sameSite attribute
        same_site = cookie.get('sameSite', 'Lax')
        if same_site not in ['Strict', 'Lax', 'None']:
            if same_site == 'no_restriction':
                same_site = 'None'
            elif same_site.lower() == 'lax':
                same_site = 'Lax'
            elif same_site.lower() == 'strict':
                same_site = 'Strict'
            else:
                same_site = 'Lax'
        
        cookies.append({
            'name': cookie['name'],
            'value': cookie['value'],
            'domain': cookie['domain'],
            'path': cookie.get('path', '/'),
            'expires': cookie.get('expirationDate', -1),
            'httpOnly': cookie.get('httpOnly', False),
            'secure': cookie.get('secure', False),
            'sameSite': same_site
        })

    # Random browsing duration between 2-10 minutes
    browse_duration = random.randint(120, 600)  # seconds
    print(f"\n{'='*60}")
    print(f"🤖 Starting natural browsing session")
    print(f"📅 Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"⏱️  Duration: {browse_duration // 60} minutes {browse_duration % 60} seconds")
    print(f"{'='*60}\n")

    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context(
        viewport={'width': 1280, 'height': 720},
        user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        locale='en-US',
        timezone_id='America/New_York'
    )
    
    # Add cookies to context
    context.add_cookies(cookies)
    
    page = context.new_page()

    start_time = time.time()
    end_time = start_time + browse_duration

    try:
        print("🌐 Opening Twitter...")
        page.goto("https://twitter.com/home")
        random_sleep(2, 4)
        
        # Close any popups
        try:
            page.get_by_test_id("app-bar-close").click(timeout=2000)
        except:
            pass

        action_count = 0
        
        while time.time() < end_time:
            remaining = int(end_time - time.time())
            if remaining <= 0:
                break
                
            # Randomly choose an action
            actions = ['scroll', 'read', 'explore', 'profile', 'trending']
            action = random.choice(actions)
            
            action_count += 1
            print(f"\n[{action_count}] ⏱️  {remaining}s remaining - Action: {action}")
            
            if action == 'scroll':
                # Scroll through timeline
                scroll_count = random.randint(2, 5)
                print(f"  📜 Scrolling {scroll_count} times...")
                for i in range(scroll_count):
                    human_like_scroll(page)
                    
                    # Occasionally stop to "read" a tweet
                    if random.random() < 0.3:
                        print(f"  👀 Reading a tweet...")
                        random_sleep(3, 8)
            
            elif action == 'read':
                # Stop and read the current view
                print(f"  📖 Reading tweets...")
                random_sleep(5, 15)
            
            elif action == 'explore':
                # Navigate to Explore page
                try:
                    print(f"  🔍 Checking Explore page...")
                    page.goto("https://twitter.com/explore")
                    random_sleep(2, 4)
                    
                    # Scroll a bit
                    for _ in range(random.randint(1, 3)):
                        human_like_scroll(page)
                    
                    random_sleep(3, 7)
                    
                    # Go back to home
                    page.goto("https://twitter.com/home")
                    random_sleep(2, 3)
                except Exception as e:
                    print(f"  ⚠️  Could not access Explore: {e}")
            
            elif action == 'profile':
                # Check own profile occasionally
                try:
                    print(f"  👤 Checking profile...")
                    # Click on profile icon
                    page.goto("https://twitter.com/home")
                    random_sleep(2, 4)
                    human_like_scroll(page)
                    random_sleep(3, 6)
                except Exception as e:
                    print(f"  ⚠️  Could not access profile: {e}")
            
            elif action == 'trending':
                # Look at trending topics
                try:
                    print(f"  🔥 Viewing trending topics...")
                    page.goto("https://twitter.com/explore/tabs/trending")
                    random_sleep(3, 6)
                    
                    # Scroll through trending
                    for _ in range(random.randint(1, 3)):
                        human_like_scroll(page)
                    
                    # Go back to home
                    page.goto("https://twitter.com/home")
                    random_sleep(2, 3)
                except Exception as e:
                    print(f"  ⚠️  Could not access trending: {e}")
            
            # Random pause between actions
            random_sleep(2, 5)

    except Exception as e:
        print(f"\n❌ Error during browsing: {e}")
    
    finally:
        actual_duration = int(time.time() - start_time)
        print(f"\n{'='*60}")
        print(f"✅ Browsing session completed!")
        print(f"⏱️  Total time: {actual_duration // 60} minutes {actual_duration % 60} seconds")
        print(f"🎯 Actions performed: {action_count}")
        print(f"{'='*60}\n")
        
        random_sleep(2, 4)
        context.close()
        browser.close()


def schedule_random_browsing():
    """Schedule browsing sessions at random times throughout the day"""
    print("\n🤖 Twitter Natural Browsing Scheduler")
    print("="*60)
    print("This will schedule random browsing sessions throughout the day")
    print("to make your account appear more human-like to X/Twitter.\n")
    
    # Schedule 3-5 random times per day
    sessions_per_day = random.randint(3, 5)
    
    print(f"📅 Scheduling {sessions_per_day} browsing sessions today...")
    
    # Generate random times for today
    scheduled_times = []
    for i in range(sessions_per_day):
        # Random hour between 8 AM and 11 PM
        hour = random.randint(8, 23)
        minute = random.randint(0, 59)
        time_str = f"{hour:02d}:{minute:02d}"
        scheduled_times.append(time_str)
        
        schedule.every().day.at(time_str).do(lambda: browse_with_playwright())
        print(f"  ⏰ Session {i+1}: {time_str}")
    
    print(f"\n✅ Scheduled! Waiting for next session...")
    print(f"💡 Press Ctrl+C to stop the scheduler\n")
    
    try:
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
    except KeyboardInterrupt:
        print("\n\n👋 Scheduler stopped by user")


def browse_with_playwright():
    """Wrapper to run browsing with playwright"""
    with sync_playwright() as playwright:
        browse_twitter_naturally(playwright)


def main():
    import sys
    
    if len(sys.argv) < 2:
        print("\nUsage:")
        print("  python browse_naturally.py browse    - Browse once now")
        print("  python browse_naturally.py schedule  - Schedule random browsing sessions")
        return
    
    command = sys.argv[1]
    
    if command == "browse":
        with sync_playwright() as playwright:
            browse_twitter_naturally(playwright)
    
    elif command == "schedule":
        schedule_random_browsing()
    
    else:
        print(f"Unknown command: {command}")
        print("\nAvailable commands:")
        print("  browse    - Browse once now")
        print("  schedule  - Schedule random browsing sessions")


if __name__ == "__main__":
    main()
