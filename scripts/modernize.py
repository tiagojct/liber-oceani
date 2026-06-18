#!/usr/bin/env python3
"""Moderniza a ortografia de Os Lusíadas (1572 → moderno).
Aplica regras sistemáticas + dicionário de excepções.
Resultado: aproximação filológica, não edição crítica."""

import re, sys

# ── REGRAS DE SUBSTITUIÇÃO (ordenadas) ──────────────────────────────

# Caracteres
RULES_CHAR = [
    ("\u017f", "s"),    # ſ (long s) → s
    ("ß", "ss"),         # ß → ss
    ("æ", "e"),          # æ → e
    ("œ", "e"),          # œ → e
    ("û", "u"),          # û → u
    ("ê", "e"),          # ê → e (careful, some ê remain in modern PT)
    ("î", "i"),
    ("ô", "o"),
    ("â", "a"),
    ("\u1ebd", "e"),     # ẽ → e
    ("\u1e73", "u"),     # ṳ → u
    ("\u0169", "u"),     # ũ → u
    ("\u1e71", "u"),
    ("\u0129", "i"),     # ĩ → i
]

# Palavra-por-palavra (ortografia 1572 → moderna)
WORD_MAP = {
    # Artigos/pronomes
    "d'": "de ",
    "d'alg\u0169": "de algum",
    "d'alg\u0169a": "de alguma",
    "n'hum": "num",
    "n'h\u0169": "num",
    "n\u0169": "num",
    "n\u0169a": "numa",
    "n'aquella": "naquela",
    "n'aquelle": "naquele",
    "n'esta": "nesta",
    "n'este": "neste",
    "n'estes": "nestes",
    "n'isto": "nisto",
    "d'elle": "dele",
    "d'ella": "dela",
    "d'ellas": "delas",
    "d'elles": "deles",
    "d'ahi": "daí",
    "d'ali": "dali",
    "d'aqui": "daqui",
    "d'antes": "dantes",
    "d'aquelle": "daquele",
    "d'aquella": "daquela",
    "d'aquelles": "daqueles",
    "d'aquellas": "daquelas",
    "d'este": "deste",
    "d'esta": "desta",
    "d'estes": "destes",
    "d'estas": "destas",
    "d'outro": "doutro",
    "d'outra": "doutra",
    "d'outros": "doutros",
    "d'outras": "doutras",
    "n'elle": "nele",
    "n'ella": "nela",
    "n'elles": "neles",
    "n'ellas": "nelas",
    "p'ra": "para",
    "p'lo": "pelo",
    "p'la": "pela",
    "p'los": "pelos",
    "p'las": "pelas",
    "c'o": "com o",
    "c'a": "com a",
    "c'os": "com os",
    "c'as": "com as",
    "co'a": "com a",
    "co'o": "com o",
    "co'os": "com os",
    "co'as": "com as",
    "pollo": "pelo",
    "polla": "pela",
    "pollos": "pelos",
    "pollas": "pelas",
    "antre": "entre",
    "pera": "para",
    "per": "por",
    "polo": "pelo",
    "pola": "pela",
    "polos": "pelos",
    "polas": "pelas",

    # Conjugações verbais
    "sam": "são",
    "estam": "estão",
    "dão": "dão",
    "vão": "vão",
    "tem": "têm",
    "vem": "vêm",
    "soster": "suster",
    "póde": "pode",
    "pódem": "podem",
    "foy": "foi",
    "forão": "foram",
    "foraõ": "foram",
    "viram": "viram",
    "viraõ": "viram",
    "tiveram": "tiveram",
    "tiveraõ": "tiveram",
    "ouveram": "houveram",
    "ouveraõ": "houveram",
    "deram": "deram",
    "deraõ": "deram",
    "fizeram": "fizeram",
    "fizeraõ": "fizeram",
    "foraõ": "foram",
    "estavaõ": "estavam",
    "estavão": "estavam",
    "andavao": "andavam",
    "andavaõ": "andavam",
    "tinhao": "tinham",
    "tinhaõ": "tinham",
    "vinhao": "vinham",
    "vinhaõ": "vinham",
    "punhao": "punham",
    "punhaõ": "punham",
    "quiz": "quis",
    "quizer": "quiser",
    "quizeram": "quiseram",
    "poderáõ": "poderão",
    "seráõ": "serão",
    "teráõ": "terão",
    "faráõ": "farão",
    "diráõ": "dirão",
    "viráõ": "virão",
    "veráõ": "verão",
    "faráo": "farão",
    "seráo": "serão",
    "hão": "hão",
    "haõ": "hão",
    "haverà": "haverá",
    "serà": "será",
    "està": "está",
    "dà": "dá",
    "dàlhe": "dá-lhe",
    "vè": "vê",
    "lè": "lê",
    "crè": "crê",
    "dè": "dê",
    "pòr": "pôr",
    "pòde": "pode",
    "partindose": "partindo-se",

    # Adverbios e conjunções
    "assi": "assim",
    "inda": "ainda",
    "entam": "então",
    "então": "então",
    "porèm": "porém",
    "porem": "porém",
    "tambem": "também",
    "ninguem": "ninguém",
    "alguem": "alguém",
    "porem": "porém",
    "ja": "já",
    "jà": "já",
    "ate": "até",
    "atè": "até",
    "sò": "só",
    "sòmente": "somente",
    "como": "como",
    "com": "com",
    "deos": "deus",
    "Deos": "Deus",
    "Céos": "Céus",
    "ceos": "céus",
    "Ceos": "Céus",
    "reos": "réus",
    "véo": "véu",
    "pè": "pé",
    "pès": "pés",
    "sè": "sé",
    "rè": "ré",

    # Substantivos comuns
    "peito": "peito",
    "guerra": "guerra",
    "terra": "terra",
    "honrra": "honra",
    "honrrado": "honrado",
    "deshonrra": "desonra",
    "cavallo": "cavalo",
    "cavallos": "cavalos",
    "cavalleiro": "cavaleiro",
    "cavalleiros": "cavaleiros",
    "batalha": "batalha",
    "batalhas": "batalhas",
    "maravilha": "maravilha",
    "maravilhas": "maravilhas",
    "conselho": "conselho",
    "conselhos": "conselhos",
    "trabalho": "trabalho",
    "trabalhos": "trabalhos",
    "ilha": "ilha",
    "ilhas": "ilhas",
    "filho": "filho",
    "filhos": "filhos",
    "molher": "mulher",
    "molheres": "mulheres",
    "inveja": "inveja",
    "luz": "luz",
    "cruz": "cruz",
    "flor": "flor",
    "flores": "flores",
    "amor": "amor",
    "amores": "amores",
    "dor": "dor",
    "dores": "dores",
    "mar": "mar",
    "mares": "mares",
    "ar": "ar",
    "ares": "ares",
    "rey": "rei",
    "reys": "reis",
    "reyno": "reino",
    "reynos": "reinos",
    "Reyno": "Reino",
    "Reynos": "Reinos",
    "capitão": "capitão",
    "nação": "nação",
    "nações": "nações",
    "lição": "lição",
    "oração": "oração",
    "orações": "orações",
    "esprito": "espírito",
    "espritos": "espíritos",
    "esprito": "espírito",
    "christão": "cristão",
    "christãos": "cristãos",
    "Christo": "Cristo",
    "christandade": "cristandade",
    "esphera": "esfera",
    "espheras": "esferas",
    "thesouro": "tesouro",
    "thesouros": "tesouros",
    "author": "autor",
    "authors": "autores",
    "authors": "autores",
    "catholico": "católico",
    "catholicos": "católicos",
    "philosophia": "filosofia",
    "philosopho": "filósofo",
    "theatro": "teatro",
    "thesouro": "tesouro",
    "throno": "trono",
    "Espanha": "Espanha",
    "Hespanha": "Espanha",
    "França": "França",
    "França": "França",
    "Inglaterra": "Inglaterra",
    "Ingraterra": "Inglaterra",

    # Adjectivos
    "illustre": "ilustre",
    "illustres": "ilustres",
    "generoso": "generoso",
    "generosos": "generosos",
    "glorioso": "glorioso",
    "gloriosos": "gloriosos",
    "famoso": "famoso",
    "famosos": "famosos",
    "valeroso": "valeroso",
    "valerosos": "valerosos",
    "cubicoso": "cobiçoso",
    "cubicosos": "cobiçosos",
    "fermoso": "formoso",
    "fermosos": "formosos",
    "fermosura": "formosura",
    "estranho": "estranho",
    "estranhos": "estranhos",
    "antigo": "antigo",
    "antigos": "antigos",
    "antigua": "antiga",
    "antígua": "antiga",
    "grandilóquo": "grandíloquo",
    "antiguo": "antigo",
    "só": "só",
    "sós": "sós",
    "vão": "vão",
    "vã": "vã",
    "vãos": "vãos",
    "vãs": "vãs",
    "cru": "cru",
    "crus": "crus",
    "nu": "nu",
    "nua": "nua",
    "dino": "digno",
    "dina": "digna",
    "dinos": "dignos",
    "dinas": "dignas",
    "benino": "benigno",
    "benina": "benigna",
    "beninos": "benignos",
    "sublime": "sublime",
    "sublimes": "sublimes",
    "humilde": "humilde",
    "humildes": "humildes",

    # Prefixos
    "des-": "des-",
    "in-": "in-",
    "re-": "re-",
    "ex-": "ex-",
    "sub-": "sub-",

    # Outros
    "cà": "cá",
    "là": "lá",
    "lhe": "lhe",
    "nos": "nos",
    "vos": "vos",
    "se": "se",
    "te": "te",
    "me": "me",
    "mim": "mim",
    "ti": "ti",
    "si": "si",
    "aquelle": "aquele",
    "aquella": "aquela",
    "aquelles": "aqueles",
    "aquellas": "aquelas",
    "este": "este",
    "esta": "esta",
    "estes": "estes",
    "estas": "estas",
    "esse": "esse",
    "essa": "essa",
    "esses": "esses",
    "essas": "essas",
    "aquelle": "aquele",
    "isto": "isto",
    "isso": "isso",
    "aquillo": "aquilo",
    "tanto": "tanto",
    "tantos": "tantos",
    "quanto": "quanto",
    "quantos": "quantos",
    "todo": "todo",
    "toda": "toda",
    "todos": "todos",
    "todas": "todas",
    "outro": "outro",
    "outra": "outra",
    "outros": "outros",
    "outras": "outras",
    "hum": "um",
    "huma": "uma",
    "huns": "uns",
    "humas": "umas",
    "hua": "uma",
    "huã": "uma",
    "hu\u0169": "um",
    "h\u0169": "um",
    "\u0169": "um",
    "\u0169a": "uma",
    "oje": "hoje",
    "hora": "hora",
    "horas": "horas",
    "honra": "honra",
    "honras": "honras",
    "ho": "o",
    "he": "é",
    "ha": "há",
    "hia": "ia",
    "hião": "iam",
}

# Regex substitutions (applied after word map)
REGEX_RULES = [
    # -am → -ão (verb endings)
    # Too aggressive for now, handle via word map
    # ct → t
    (r'\b([A-Za-zÀ-ÿ]+)ct([a-záàâãéêíóôõú]+)\b', r'\1t\2'),
    # ph → f
    (r'\b([A-Za-zÀ-ÿ]*)ph([a-záàâãéêíóôõú]+)\b', r'\1f\2'),
    # th → t (except at start of word where it might be aspiration)
    (r'th([aeiouáàâãéêíóôõú])', r't\1'),
    # initial chr → cr
    (r'\bchr', r'cr'),
    # -ão → -ão (keep)
    # -am → -ão (verbal ending, contextual)
    (r'(ã|â|ê|ô)([bcdfghjklmnpqrstvwxyz])', lambda m: m.group(1) + m.group(2)),
]

def apply_word_map(text):
    """Apply word-level substitutions, longest match first."""
    words = re.findall(r"[\wÀ-ÿ']+|[^\wÀ-ÿ']+", text)
    result = []
    for w in words:
        if re.match(r"[\wÀ-ÿ']+", w):
            # Try longest match first
            matched = False
            for key in sorted(WORD_MAP.keys(), key=len, reverse=True):
                if w == key:
                    result.append(WORD_MAP[key])
                    matched = True
                    break
            if not matched:
                result.append(w)
        else:
            result.append(w)
    return "".join(result)

def modernize_line(line):
    """Modernize a single line of text."""
    # Apply character substitutions
    for old, new in RULES_CHAR:
        line = line.replace(old, new)

    # Apply word map
    line = apply_word_map(line)

    # Handle -ão/-am endings
    # This is complex and context-dependent; the word map handles common cases

    return line

def modernize_stanza(stanza):
    """Modernize a stanza (8 lines of verse)."""
    lines = stanza.strip().split("\n")
    return "\n".join(modernize_line(l) for l in lines)

def main():
    import os, glob

    input_dir = sys.argv[1] if len(sys.argv) > 1 else "content/cantos"
    output_dir = sys.argv[2] if len(sys.argv) > 2 else "content/cantos-modernos"

    os.makedirs(output_dir, exist_ok=True)

    for fpath in sorted(glob.glob(f"{input_dir}/*.md")):
        with open(fpath) as f:
            text = f.read()

        # Split into frontmatter and body
        parts = text.split("---", 2)
        if len(parts) < 3:
            print(f"Warning: no frontmatter in {fpath}, skipping")
            continue

        frontmatter = parts[1]
        body = parts[2]

        # Modernize frontmatter (slug etc.)
        fm_lines = frontmatter.strip().split("\n")
        new_fm = []
        for line in fm_lines:
            if line.startswith("slug:"):
                # Keep original slug, add modern slug
                slug = line.split(":", 1)[1].strip().strip('"')
                new_fm.append(line)
                new_fm.append(f'slug_modern: "{slug}-moderno"')
            elif line.startswith("title:"):
                new_fm.append(line)
                # Add modern title
                title = line.split(":", 1)[1].strip().strip('"')
                new_fm.append(f'title_modern: "{title} (ortografia moderna)"')
            else:
                new_fm.append(line)

        # Modernize body
        lines = body.split("\n")
        modern_lines = []
        for line in lines:
            if line.startswith("**") and line.endswith("**"):
                # Stanza number - keep as is
                modern_lines.append(line)
            elif line.strip() == "":
                modern_lines.append(line)
            else:
                modern_lines.append(modernize_line(line))

        modern_body = "\n".join(modern_lines)

        output = f"---\n" + "\n".join(new_fm) + "\n---\n" + modern_body

        outpath = os.path.join(output_dir, os.path.basename(fpath))
        with open(outpath, "w") as f:
            f.write(output)

        print(f"Modernizado: {os.path.basename(fpath)} → {outpath}")

    print(f"\nTotal: {len(list(glob.glob(f'{input_dir}/*.md')))} cantos processados.")

if __name__ == "__main__":
    main()
