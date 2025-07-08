# backend/scope_engine.py - V2
from taxonomy import PAIN_THEME_RULES, KEYWORD_RULES # Import both rule sets

def process_scope_and_cards(raw_cards: list[dict]) -> tuple[list[dict], list[str]]:
    enriched_cards = []
    all_activated_tiles = set()

    for card_data in raw_cards:
        title_text = card_data.get('title', '').lower()
        blurb_text = card_data.get('blurb', '').lower()

        card_triggered_tiles = set()
        card_triggering_keywords = set()

        # First, check for thematic keywords in the title
        for theme, modules in PAIN_THEME_RULES.items():
            if theme in title_text:
                card_triggering_keywords.add(theme)
                for module in modules:
                    card_triggered_tiles.add(module)

        # Second, check for granular keywords in the full text
        for keyword, modules in KEYWORD_RULES.items():
            if keyword in f"{title_text} {blurb_text}":
                card_triggering_keywords.add(keyword)
                for module in modules:
                    card_triggered_tiles.add(module)

        card_data['triggered_tiles'] = sorted(list(card_triggered_tiles))
        card_data['triggering_keywords'] = sorted(list(card_triggering_keywords))
        enriched_cards.append(card_data)

        all_activated_tiles.update(card_triggered_tiles)

    return enriched_cards, sorted(list(all_activated_tiles))