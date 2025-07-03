# backend/scraper.py
from requests_html import HTMLSession

async def get_company_context(identifier: str) -> str:
    """
    Scrapes top news headlines for a given company ticker using requests-html
    to handle JavaScript rendering.
    """
    print(f"Scraping context for {identifier} with HTMLSession...")

    # Create an HTML Session object, which is like a browser tab
    session = HTMLSession()
    url = f"https://finance.yahoo.com/quote/{identifier}"

    try:
        # Get the page
        response = session.get(url)

        # This is the crucial step: Render the JavaScript on the page.
        # We give it a 10-second timeout to load everything.
        await response.html.arender(timeout=20)

        print("Page content rendered.")

        # Now we search the rendered HTML for the headlines.
        # Yahoo's structure has changed again. We'll look for links within list items.
        # A more stable selector targets the list containing the news.
        headlines = response.html.find('li[class*="news-stream-story"] a')

        if not headlines:
            print("Could not find news headlines after rendering.")
            # We can remove the debug file saving later, but it's good for now
            with open("debug_page_rendered.html", "w", encoding="utf-8") as f:
                f.write(response.html.html)
            return "No news headlines found on the page."

        # Extract the text from the headline tags and join them
        context = " ".join([h.text for h in headlines])
        print(f"Successfully scraped {len(headlines)} headlines.")
        return context

    except Exception as e:
        print(f"An unexpected error occurred with HTMLSession: {e}")
        return "An unexpected error occurred during scraping."
    finally:
        # It's good practice to close the session
        session.close()