# Arquitectura do Liber Oceani

## Visão geral

*Liber Oceani* é um site estático gerado com [Hugo](https://gohugo.io/)
e alojado no GitHub Pages. Não há *backend*, base de dados, *cookies*,
*analytics*, ou CDNs de terceiros.

## Estrutura de directórios

```
liber-oceani/
├── assets/
│   ├── css/main.css           # CSS único (~900 linhas)
│   └── js/
│       ├── main.js            # Ponto de entrada (ES modules)
│       ├── anot.js            # Anotações popup (glossário/personagens)
│       ├── font.js            # Controlo de tamanho de letra
│       ├── mode.js            # Modos de leitura (pergaminho/sépia/escuro)
│       ├── progress.js        # Progresso de leitura por canto
│       ├── marcadores.js      # Marcadores por estância
│       ├── destaques.js       # Destaques de texto (Range API)
│       ├── dados.js           # Export/import JSON
│       ├── pesquisa.js        # Pagefind lazy-loaded
│       ├── orto.js            # Toggle ortografia 1572/moderna
│       └── storage.js         # localStorage wrapper
├── content/
│   ├── cantos/                # 10 ficheiros .md, um por canto
│   ├── cantos-modernos/       # Ortografia moderna (gerada)
│   ├── glossario/             # ~50 entradas de glossário
│   ├── personagens/           # ~40 perfis de personagens
│   ├── estudo/                # Estudo introdutório
│   ├── episodios/             # 6 episódios canónicos
│   └── *.md                   # Páginas de topo (sobre, cronologia, etc.)
├── data/
│   └── notas.yaml             # Notas críticas por canto:estância
├── layouts/
│   ├── _default/              # Templates base (baseof, single, list)
│   ├── partials/              # Nav, auto-anotar
│   └── shortcodes/            # gloss, char, nota
├── static/
│   └── fonts/                 # Fontes self-hosted (Cormorant Garamond + Source Serif 4)
├── scripts/
│   ├── split_cantos.py        # Divisão do texto Gutenberg em 10 cantos
│   └── modernize.py           # Modernização ortográfica
└── config.yaml                # Configuração Hugo
```

## Decisões de design

### Porquê Hugo?
- Gera HTML estático — sem servidor, sem base de dados
- *Build* rápido (< 1 segundo)
- *Shortcodes* permitem anotações inline
- *Data files* para notas críticas
- Suporta *output formats* custom (JSON para anotações)

### Porquê vanilla JS?
- Zero dependências npm
- Sem *bundlers*, sem *transpilers*
- ES modules nativos (suportados por todos os *browsers* modernos)
- Pagefind é o único código externo, carregado *lazy*

### Porquê CSS único?
- Um ficheiro, sem *frameworks*
- Variáveis CSS para modos de leitura
- Sem *media queries* desnecessárias
- Acessibilidade cuidada (contraste, *skip link*, *aria-*)

### Porquê ortografia 1572 como padrão?
- É a edição que Camões viu e aprovou em vida
- Mantém a historicidade do texto
- A ortografia moderna é uma conveniência, não uma autoridade
- O *toggle* permite o melhor dos dois mundos

### Porquê GitHub Pages?
- Gratuito
- HTTPS automático
- *Deploy* automático via GitHub Actions
- Sem custos de alojamento perpétuos

## Pipeline de build

1. `hugo` compila o site para `public/`
2. GitHub Actions faz *deploy* para `gh-pages`
3. Pagefind indexa o conteúdo após o *build*

## Fontes textuais

- Texto base: Project Gutenberg ebook #3333
- Modernização: `scripts/modernize.py` (aproximada)
- Notas críticas: baseadas nas edições de Emanuel Paulo Ramos (Porto Editora) e Frank Pierce (Clarendon Press)
