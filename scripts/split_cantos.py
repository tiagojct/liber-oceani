#!/usr/bin/env python3
"""Split Project Gutenberg ebook 3333 (Os Lusíadas) into 10 canto Markdown files.

Deterministic; safe to re-run. Each canto file carries frontmatter with
title, number, and weight for Hugo ordering. Stanzas are numbered and
formatted as Markdown with blank-line separation between stanzas.
"""

import os
import re

SOURCE = os.path.join(os.path.dirname(__file__), "source", "3333.txt")
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "content", "cantos")

CANTO_NAMES = {
    1: "Canto Primeiro",
    2: "Canto Segundo",
    3: "Canto Terceiro",
    4: "Canto Quarto",
    5: "Canto Quinto",
    6: "Canto Sexto",
    7: "Canto Sétimo",
    8: "Canto Oitavo",
    9: "Canto Nono",
    10: "Canto Décimo",
}

CANTO_MARKERS = [CANTO_NAMES[i] for i in range(1, 11)]


def read_text():
    with open(SOURCE, encoding="utf-8") as f:
        text = f.read()
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return text


def strip_gutenberg_frontmatter(text):
    """Remove everything before 'Canto Primeiro' and after the final stanza."""
    idx = text.find("Canto Primeiro")
    if idx == -1:
        return text
    text = text[idx:]

    # Remove Gutenberg footer
    for marker in [
        "*** END OF THE PROJECT GUTENBERG EBOOK",
        "Final de Os Lusíadas",
        "---------------------oOo---------------------",
    ]:
        idx = text.find(marker)
        if idx != -1:
            text = text[:idx].rstrip()
    return text


def find_canto_boundaries(text):
    """Find the line number where each canto starts (0-indexed)."""
    lines = text.split("\n")
    boundaries = {}
    for i, line in enumerate(lines):
        stripped = line.strip()
        for num, name in CANTO_NAMES.items():
            if stripped == name:
                boundaries[num] = i
                break
    return boundaries


def extract_canto(text, boundaries, canto_num):
    """Extract a single canto's text between boundaries."""
    lines = text.split("\n")
    start = boundaries[canto_num]

    next_nums = [n for n in boundaries if n > canto_num]
    if next_nums:
        end = boundaries[min(next_nums)]
    else:
        end = len(lines)

    return "\n".join(lines[start:end])


def format_stanzas(canto_text):
    """Parse canto text into list of (stanza_num, [lines])."""
    lines = canto_text.split("\n")

    # Remove the "Canto Primeiro" header line
    if lines and lines[0].strip() in CANTO_MARKERS:
        lines = lines[1:]

    stanzas = []
    current_stanza = []
    stanza_num = None
    stanza_re = re.compile(r"^\s*(\d{1,3})\s*$")

    for line in lines:
        stripped = line.strip()

        if not stripped:
            # Blank line: flush current stanza if we have one
            if current_stanza and len(current_stanza) >= 2:
                stanzas.append((stanza_num, current_stanza))
                current_stanza = []
                stanza_num = None
            continue

        m = stanza_re.match(stripped)
        if m and not current_stanza:
            stanza_num = int(m.group(1))
            continue

        current_stanza.append(stripped)

    # Final stanza
    if current_stanza and len(current_stanza) >= 2:
        stanzas.append((stanza_num, current_stanza))

    return stanzas


def stanzas_to_markdown(stanzas):
    """Convert parsed stanzas to Markdown."""
    out = []
    for num, lines in stanzas:
        if num:
            out.append(f"**{num}**")
            out.append("")
        for line in lines:
            out.append(line)
        out.append("")
    return "\n".join(out).strip()


def main():
    text = read_text()
    text = strip_gutenberg_frontmatter(text)
    boundaries = find_canto_boundaries(text)

    if len(boundaries) != 10:
        missing = [n for n in range(1, 11) if n not in boundaries]
        print(f"ERROR: found {len(boundaries)}/10 canto markers. Missing: {missing}")
        return

    os.makedirs(OUT_DIR, exist_ok=True)

    for num in range(1, 11):
        canto_text = extract_canto(text, boundaries, num)
        stanzas = format_stanzas(canto_text)
        md = stanzas_to_markdown(stanzas)

        slug = str(num).zfill(2)
        roman_map = {1: "I", 2: "II", 3: "III", 4: "IV", 5: "V",
                     6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X"}

        frontmatter = f"""---
title: "{CANTO_NAMES[num]}"
slug: "canto-{slug}"
number: {num}
weight: {num}
roman: "{roman_map[num]}"
summary: ""
---

"""
        filepath = os.path.join(OUT_DIR, f"{slug}.md")
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(frontmatter)
            f.write(md)
            if not md.endswith("\n"):
                f.write("\n")

        print(f"Canto {num:2d}: {len(stanzas)} estâncias -> {filepath}")

    total = 0
    for n in range(1, 11):
        total += len(format_stanzas(extract_canto(text, boundaries, n)))
    print(f"\nDone. {total} total estâncias escritas.")


if __name__ == "__main__":
    main()
