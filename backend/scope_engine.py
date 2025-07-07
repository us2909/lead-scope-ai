from taxonomy import SCOPE_RULES
from schemas import PainCard

def determine_scope(pain_cards: list[PainCard]) -> list[str]:
    """
    Processes a list of pain cards against the SCOPE_RULES
    to determine which tiles should be activated.
    """
    activated_tiles = set() # Use a set to automatically handle duplicates

    for card in pain_cards:
        # Combine title and blurb into a single searchable text, in lowercase
        card_text = f"{card.title} {card.blurb}".lower()

        # Check each rule
        for keyword, modules in SCOPE_RULES.items():
            if keyword in card_text:
                # If a keyword is found, add all its associated modules to the set
                for module in modules:
                    activated_tiles.add(module)

    return sorted(list(activated_tiles)) # Return a sorted list