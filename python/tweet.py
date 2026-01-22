import os
import sys
import json
from playwright.sync_api import Playwright, sync_playwright
from dotenv import load_dotenv

load_dotenv()

USERNAME = "mrcentimetre@gmail.com"
PASSWORD = "Centi@2001#"
AUTH_FILE = "twitter.json"
COOKIES_FILE = "twitter_cookies.json"


def login(playwright: Playwright) -> None:
    """Login to Twitter and save session"""
    print("Opening browser for manual login...")
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context(
        viewport={'width': 1280, 'height': 720},
        user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    )
    page = context.new_page()

    page.goto("https://twitter.com/i/flow/login")
    
    print("\n=================================================")
    print("PLEASE LOG IN MANUALLY IN THE BROWSER WINDOW")
    print("After successful login, close the browser window")
    print("Or press Ctrl+C when done")
    print("=================================================\n")
    
    # Wait for user to login manually
    try:
        page.wait_for_timeout(120000)  # Wait 2 minutes
    except:
        pass
    
    # Save the session
    context.storage_state(path=AUTH_FILE)
    print(f"\n✓ Session saved to {AUTH_FILE}")
    print("You can now use the 'post' command to send tweets automatically!\n")

    context.close()
    browser.close()


def post(playwright: Playwright, message: str) -> None:
    """Post a tweet using saved session"""
    if not os.path.exists(AUTH_FILE):
        print(f"Error: {AUTH_FILE} not found. Please run login first:")
        print("  python tweet_python.py login")
        return

    print("Loading saved session...")
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context(storage_state=AUTH_FILE)
    page = context.new_page()

    print("Navigating to Twitter...")
    page.goto("https://twitter.com/home")
    page.wait_for_timeout(2000)
    
    # Close any popups if they appear
    try:
        page.get_by_test_id("app-bar-close").click(timeout=2000)
    except:
        pass
    
    print("Composing tweet...")
    page.get_by_test_id("tweetTextarea_0").fill(message)
    page.wait_for_timeout(1000)
    
    print("Posting tweet...")
    page.get_by_test_id("tweetButtonInline").click()
    
    print("✓ Tweet posted successfully!")
    page.wait_for_timeout(3000)

    context.close()
    browser.close()


def post_with_browser(playwright: Playwright, message: str) -> None:
    """Post a tweet using your existing Chrome browser profile"""
    # Chrome user data directory on macOS
    user_data_dir = os.path.expanduser("~/Library/Application Support/Google/Chrome")
    
    if not os.path.exists(user_data_dir):
        print("Error: Chrome profile not found. Make sure Chrome is installed.")
        print("Trying alternative path...")
        user_data_dir = os.path.expanduser("~/Library/Application Support/Chromium")
        if not os.path.exists(user_data_dir):
            print("No browser profile found. Use 'login' command instead.")
            return
    
    print("Opening your Chrome browser with existing cookies...")
    context = playwright.chromium.launch_persistent_context(
        user_data_dir,
        headless=False,
        channel="chrome",  # Use installed Chrome instead of Chromium
        args=['--disable-blink-features=AutomationControlled']
    )
    
    page = context.new_page()

    print("Navigating to Twitter...")
    page.goto("https://twitter.com/home")
    page.wait_for_timeout(3000)
    
    # Close any popups if they appear
    try:
        page.get_by_test_id("app-bar-close").click(timeout=2000)
    except:
        pass
    
    print("Composing tweet...")
    page.get_by_test_id("tweetTextarea_0").fill(message)
    page.wait_for_timeout(1000)
    
    print("Posting tweet...")
    page.get_by_test_id("tweetButtonInline").click()
    
    print("✓ Tweet posted successfully!")
    page.wait_for_timeout(3000)

    context.close()


def post_with_cookies(playwright: Playwright, message: str) -> None:
    """Post a tweet using cookies exported from browser"""
    if not os.path.exists(COOKIES_FILE):
        print(f"Error: {COOKIES_FILE} not found!")
        print("\nHow to export cookies:")
        print("1. Install 'Cookie-Editor' extension in your browser")
        print("2. Go to twitter.com and make sure you're logged in")
        print("3. Click the Cookie-Editor extension icon")
        print("4. Click 'Export' -> 'Export as JSON'")
        print(f"5. Save the file as '{COOKIES_FILE}' in this directory")
        print("\nAlternatively, you can use 'EditThisCookie' or similar extensions.")
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
            elif same_site == 'lax':
                same_site = 'Lax'
            elif same_site == 'strict':
                same_site = 'Strict'
            else:
                same_site = 'Lax'
        
        playwright_cookie = {
            'name': cookie.get('name'),
            'value': cookie.get('value'),
            'domain': cookie.get('domain'),
            'path': cookie.get('path', '/'),
            'expires': cookie.get('expirationDate', -1),
            'httpOnly': cookie.get('httpOnly', False),
            'secure': cookie.get('secure', False),
            'sameSite': same_site
        }
        cookies.append(playwright_cookie)
    
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context(
        viewport={'width': 1280, 'height': 720},
        user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
    )
    
    # Add cookies to context
    context.add_cookies(cookies)
    
    page = context.new_page()

    print("Navigating to Twitter...")
    page.goto("https://twitter.com/home")
    page.wait_for_timeout(3000)
    
    # Close any popups if they appear
    try:
        page.get_by_test_id("app-bar-close").click(timeout=2000)
    except:
        pass
    
    print("Composing tweet...")
    page.get_by_test_id("tweetTextarea_0").fill(message)
    page.wait_for_timeout(1000)
    
    print("Posting tweet...")
    page.get_by_test_id("tweetButtonInline").click()
    
    print("✓ Tweet posted successfully!")
    page.wait_for_timeout(3000)

    context.close()
    browser.close()


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage:")
        print("  Login:           python3 tweet_python.py login")
        print("  Post (saved):    python3 tweet_python.py post 'Your message'")
        print("  Post (cookies):  python3 tweet_python.py cookies 'Your message'")
        print("  Post (browser):  python3 tweet_python.py browser 'Your message'")
        sys.exit(1)
    
    command = sys.argv[1]
    
    with sync_playwright() as playwright:
        if command == "login":
            login(playwright)
        elif command == "post":
            if len(sys.argv) < 3:
                print("Error: Please provide a message to post")
                print("Usage: python3 tweet_python.py post 'Your message here'")
                sys.exit(1)
            message = sys.argv[2]
            post(playwright, message)
        elif command == "cookies":
            if len(sys.argv) < 3:
                print("Error: Please provide a message to post")
                print("Usage: python3 tweet_python.py cookies 'Your message here'")
                sys.exit(1)
            message = sys.argv[2]
            post_with_cookies(playwright, message)
        elif command == "browser":
            if len(sys.argv) < 3:
                print("Error: Please provide a message to post")
                print("Usage: python3 tweet_python.py browser 'Your message here'")
                sys.exit(1)
            message = sys.argv[2]
            post_with_browser(playwright, message)
        else:
            print(f"Unknown command: {command}")
            print("Available commands: login, post, cookies, browser")
            sys.exit(1)
