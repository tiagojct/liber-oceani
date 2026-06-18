import { get, set } from "./storage.js";

const COLOURS = ["amarelo", "verde", "azul"];

function cantoSlug() {
  const path = location.pathname.replace(/\/$/, "").split("/");
  return path[path.length - 1];
}
function cantoTitle() {
  const h1 = document.querySelector("article > header h1");
  return h1 ? h1.textContent.trim() : "";
}
function all() { return get("destaques", []) || []; }
function save(list) { set("destaques", list); }

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function renderDestaques() {
  const article = document.querySelector("article.canto");
  if (!article) return;
  const slug = cantoSlug();
  const here = all().filter((h) => h.canto === slug);
  if (here.length === 0) return;
  const versePs = article.querySelectorAll("p:not(:has(strong:only-child))");
  for (const h of here) {
    if (!h.texto || h.texto.length < 3) continue;
    const colour = COLOURS.includes(h.cor) ? h.cor : "amarelo";
    for (const p of versePs) {
      if (!p.textContent.includes(h.texto)) continue;
      const re = new RegExp(escapeRegExp(h.texto));
      const original = p.innerHTML;
      const next = original.replace(re, (m) => `<mark class="dst dst-${colour}" data-did="${escapeHTML(h.id || "")}" title="${h.nota ? escapeHTML(h.nota) : ""}">${m}</mark>`);
      if (next !== original) { p.innerHTML = next; break; }
    }
  }
}

function applyDestaqueToRange(range, colour) {
  try {
    const mark = document.createElement("mark");
    mark.className = `dst dst-${colour}`;
    mark.dataset.did = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    range.surroundContents(mark);
    return mark;
  } catch {
    try {
      const mark = document.createElement("mark");
      mark.className = `dst dst-${colour}`;
      mark.dataset.did = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const fragment = range.extractContents();
      mark.appendChild(fragment);
      range.insertNode(mark);
      return mark;
    } catch {
      return null;
    }
  }
}

function buildToolbar() {
  const tb = document.createElement("div");
  tb.className = "dst-toolbar";
  tb.hidden = true;
  tb.innerHTML = `
    <span class="dst-toolbar-label">Destacar</span>
    ${COLOURS.map((c) => `<button type="button" class="dst-amostra dst-${c}" data-cor="${c}" aria-label="Destacar em ${c}"></button>`).join("")}
    <button type="button" class="dst-fechar" aria-label="Fechar">x</button>
  `;
  document.body.appendChild(tb);
  return tb;
}

function selectionWithin(article) {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null;
  const range = sel.getRangeAt(0);
  if (!article.contains(range.commonAncestorContainer)) return null;
  const text = sel.toString().trim();
  if (text.length < 3) return null;
  return { range, text };
}

function positionToolbar(tb, range) {
  const rect = range.getBoundingClientRect();
  const top = window.scrollY + rect.top - tb.offsetHeight - 10;
  const left = window.scrollX + rect.left + rect.width / 2 - tb.offsetWidth / 2;
  tb.style.top = `${Math.max(window.scrollY + 8, top)}px`;
  tb.style.left = `${Math.max(8, left)}px`;
}

function renderList() {
  const root = document.getElementById("destaques-app");
  if (!root) return;
  const list = all().slice().sort((a, b) => (b.criado || "").localeCompare(a.criado || ""));
  if (list.length === 0) {
    root.innerHTML = `<p class="vazio">Ainda sem destaques. Selecciona texto num canto para o destacar.</p>`;
    return;
  }
  const items = list.map((h) => `
    <li class="destaque-item">
      <a class="destaque-link" href="${escapeHTML(`/liber-oceani/cantos/${h.canto}/`)}">
        <span class="dst-canto">${escapeHTML(h.canto_titulo || h.canto)}</span>
      </a>
      <mark class="dst dst-${COLOURS.includes(h.cor) ? h.cor : "amarelo"}">${escapeHTML(h.texto)}</mark>
      ${h.nota ? `<p class="destaque-nota">${escapeHTML(h.nota)}</p>` : ""}
      <button type="button" class="destaque-remover" data-id="${escapeHTML(h.id)}">Remover</button>
    </li>
  `).join("");
  root.innerHTML = `<ul class="destaque-lista">${items}</ul>`;
  root.addEventListener("click", (e) => {
    const btn = e.target.closest(".destaque-remover");
    if (!btn) return;
    const id = btn.dataset.id;
    save(all().filter((h) => h.id !== id));
    renderList();
  });
}

export function initDestaques() {
  renderDestaques();
  renderList();
  const article = document.querySelector("article.canto");
  if (!article) return;
  const tb = buildToolbar();
  let current = null;
  function hide() { tb.hidden = true; current = null; }
  document.addEventListener("mouseup", () => {
    setTimeout(() => {
      const sel = selectionWithin(article);
      if (!sel) { hide(); return; }
      current = sel;
      tb.hidden = false;
      positionToolbar(tb, sel.range);
    }, 0);
  });
  document.addEventListener("scroll", () => { if (!tb.hidden && current) positionToolbar(tb, current.range); }, { passive: true });
  tb.addEventListener("click", (e) => {
    const swatch = e.target.closest(".dst-amostra");
    const close = e.target.closest(".dst-fechar");
    if (close) { window.getSelection().removeAllRanges(); hide(); return; }
    if (!swatch || !current) return;
    const cor = swatch.dataset.cor;
    const mark = applyDestaqueToRange(current.range, cor);
    const entry = {
      id: mark ? mark.dataset.did : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      canto: cantoSlug(),
      canto_titulo: cantoTitle(),
      texto: current.text,
      cor,
      nota: "",
      criado: new Date().toISOString(),
    };
    save([...all(), entry]);
    window.getSelection().removeAllRanges();
    hide();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
}
