# Contribuir para o Liber Oceani

Obrigado pelo interesse em contribuir. O *Liber Oceani* é um projecto
aberto, mantido por voluntários com paixão por Camões e pela edição
digital.

## Como contribuir

### Reportar erros
Se encontrar um erro textual, uma anotação incorrecta ou um *bug*,
abra uma **issue** no GitHub com:
- O canto e a estância afectada
- O texto original (cópia exacta)
- A correcção proposta
- A fonte da correcção (edição crítica, fac-símile, etc.)

### Melhorar o glossário
O glossário aceita contribuições. Cada entrada deve:
- Ser concisa (1–2 parágrafos)
- Incluir referência ao(s) canto(s) onde o termo aparece
- Citar fontes quando relevante
- Usar português europeu

### Melhorar as personagens
Vale o mesmo que para o glossário. Cada perfil deve:
- Identificar a personagem (mitológica, histórica, literária)
- Contextualizar a sua presença n'*Os Lusíadas*
- Indicar os cantos e estâncias relevantes

### Modernização ortográfica
A modernização é feita pelo *script* `scripts/modernize.py`. Se
encontrar erros na ortografia moderna, contribua com:
- *Patches* ao dicionário de palavras no *script*
- Relatórios de falsos positivos/negativos

## Estilo

- **Língua**: português europeu (Acordo Ortográfico de 1990)
- **Tom**: académico mas acessível; evite jargão desnecessário
- **Anotações**: 1–2 parágrafos; fonte citada quando relevante
- **Commits**: atómicos, com mensagens em português

## Processo

1. *Fork* o repositório
2. Crie um *branch* para a sua contribuição
3. Faça as alterações
4. Verifique que `hugo` compila sem erros
5. Abra um *Pull Request*

## Stack técnica

- **Hugo** extended (gerador de sites estáticos)
- **CSS** único em `assets/css/main.css`
- **JavaScript** vanilla (sem frameworks) em `assets/js/`
- **GitHub Pages** para *deploy*

## Contacto

Dúvidas? Abra uma *issue* no GitHub.

Obrigado por ajudar a tornar Camões mais acessível.
