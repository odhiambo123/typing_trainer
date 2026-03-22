import json
def compile_regular():
    prose = [
        "The quick brown fox jumps over the lazy dog.",
        "Precision and accuracy are the hallmarks of a great engineer.",
        "System validation requires attention to detail and patience.",
        "Hardware and software must work in perfect harmony.",
        "Documentation is just as important as the code itself."
    ]
    with open('practice_regular.json', 'w') as f:
        json.dump({"sentences": prose}, f, indent=4)
# ... run compile_regular() ...