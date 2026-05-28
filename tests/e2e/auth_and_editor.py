from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:5173")
    page.wait_for_timeout(1000)

    # Register
    page.get_by_role("link", name="Register").click()
    page.wait_for_timeout(500)

    page.get_by_label("Email").fill("pwa2@example.com")
    page.wait_for_timeout(500)
    page.get_by_label("Password").fill("test")
    page.wait_for_timeout(500)
    page.get_by_role("button", name="Register").click()
    page.wait_for_timeout(2000)

    # Dashboard edit
    page.get_by_label("Full Name").fill("PWA Creator")
    page.wait_for_timeout(500)
    page.get_by_label("Bio").fill("I build awesome standalone web apps.")
    page.wait_for_timeout(500)
    page.get_by_label("Theme").select_option("vibe")
    page.wait_for_timeout(500)

    # Add section
    page.get_by_role("button", name="+ Add New Section").click()
    page.wait_for_timeout(500)

    page.get_by_role("button", name="+ Add Item").click()
    page.wait_for_timeout(500)

    page.get_by_placeholder("Title (e.g. Software Engineer)").fill("Lead Developer")
    page.wait_for_timeout(500)

    page.get_by_placeholder("Subtitle (e.g. Google)").fill("Tech Corp")
    page.wait_for_timeout(500)

    page.get_by_role("button", name="Save Changes").click()
    page.wait_for_timeout(1500)

    # Check public profile
    with page.expect_popup() as page_info:
        page.get_by_role("link", name="View Public").click()
    new_page = page_info.value
    new_page.wait_for_timeout(2000)

    new_page.screenshot(path="/home/jules/verification/screenshots/verification2.png")
    new_page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
