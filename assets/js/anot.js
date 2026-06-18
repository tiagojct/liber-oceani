let cache = null;
let cachePromise = null;
let card = null;
let openTrigger = null;

function basepath() {
  return document.documentElement.dataset.basepath || "/";
}

async function loadData() {
  if (cache) return cache;
  if (cachePromise) return cachePromise;
  cachePromise = fetch(`${basepath()}anotacoes.json`)
    .then((r) => r.json())
    .then((d) => { cache = d; return d; });
  return cachePromise;
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function ensureCard() {
  if (card) return card;
  card = document.createElement("aside");
  card.id = "anotar-card";
  card.className = "anotar-card";
  card.hidden = true;
  card.setAttribute("role", "dialog");
  card.setAttribute("aria-labelledby", "anotar-card-titulo");
  document.body.appendChild(card);
  card.addEventListener("click", (e) => {
    if (e.target.closest(".anotar-card-fechar")) {
      hide();
      if (openTrigger) openTrigger.focus();
    }
  });
  return card;
}

function hide() {
  if (!card) return;
  card.hidden = true;
  if (openTrigger) {
    openTrigger.setAttribute("aria-expanded", "false");
    openTrigger = null;
  }
}

function placeCard(card, trigger) {
  card.classList.remove("anotar-card-margem", "anotar-card-folha");
  if (window.innerWidth >= 1100) {
    const article = trigger.closest("article") || document.querySelector("main");
    const articleRect = article.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    card.classList.add("anotar-card-margem");
    card.style.position = "absolute";
    card.style.left = `${window.scrollX + articleRect.right + 24}px`;
    card.style.top = `${window.scrollY + triggerRect.top - 6}px`;
    card.style.right = "auto";
    card.style.bottom = "auto";
    card.style.width = "16rem";
    card.style.maxHeight = "";
  } else {
    card.classList.add("anotar-card-folha");
    card.style.position = "fixed";
    card.style.left = "0";
    card.style.right = "0";
    card.style.bottom = "0";
    card.style.top = "auto";
    card.style.width = "auto";
    card.style.maxHeight = "60vh";
  }
}

function renderCard(card, tipo, entry) {
  const label = tipo === "glossario" ? "Glossário" : "Personagem";
  card.innerHTML = `
<header class="anotar-card-cabecalho">
<span class="anotar-card-tipo">${label}</span>
<button type="button" class="anotar-card-fechar" aria-label="Fechar">&times;</button>
</header>
<h3 id="anotar-card-titulo" class="anotar-card-titulo"><a href="${escapeHTML(entry.url)}">${escapeHTML(entry.titulo)}</a></h3>
<div class="anotar-card-corpo">${entry.html}</div>
<footer class="anotar-card-rodape"><a class="anotar-card-mais" href="${escapeHTML(entry.url)}">Abrir entrada &rarr;</a></footer>
`;
}

async function show(trigger) {
  const slug = trigger.dataset.slug;
  const tipo = trigger.dataset.tipo;
  if (!slug || !tipo) return;
  try {
    const data = await loadData();
    const entry = data[tipo] && data[tipo][slug];
    if (!entry) {
      window.location.href = trigger.getAttribute("href");
      return;
    }
    const c = ensureCard();
    renderCard(c, tipo, entry);
    c.hidden = false;
    if (openTrigger && openTrigger !== trigger) openTrigger.setAttribute("aria-expanded", "false");
    openTrigger = trigger;
    trigger.setAttribute("aria-expanded", "true");
    placeCard(c, trigger);
  } catch (e) {
    window.location.href = trigger.getAttribute("href");
  }
}

export function initAnot() {
  document.body.addEventListener("click", (e) => {
    const trigger = e.target.closest(".anotar[data-slug]");
    if (trigger) {
      e.preventDefault();
      show(trigger);
      return;
    }
    if (card && !card.hidden && !e.target.closest("#anotar-card")) hide();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (card && !card.hidden) {
        const focusTarget = openTrigger;
        hide();
        if (focusTarget) focusTarget.focus();
      }
    }
  });
  window.addEventListener("resize", () => {
    if (card && !card.hidden && openTrigger) placeCard(card, openTrigger);
  });
  window.addEventListener("scroll", () => {
    if (card && !card.hidden && openTrigger && window.innerWidth >= 1100) placeCard(card, openTrigger);
  }, { passive: true });
}
