import { get, set } from "./storage.js";

function cantoSlug() {
  const path = location.pathname.replace(/\/$/, "").split("/");
  return path[path.length - 1];
}
function cantoTitle() {
  const h1 = document.querySelector("article > header h1");
  return h1 ? h1.textContent.trim() : "";
}
function all() { return get("marcadores", []) || []; }
function save(list) { set("marcadores", list); }

function tagStanzas() {
  const nums = document.querySelectorAll("article.canto > p:has(strong:only-child)");
  nums.forEach((p, i) => {
    const strong = p.querySelector("strong");
    const num = strong ? strong.textContent.trim() : String(i + 1);
    p.dataset.estancia = num;
    p.id = `e${num}`;
  });
  return nums;
}

function marked() {
  const slug = cantoSlug();
  const set = new Set();
  for (const b of all()) {
    if (b.canto === slug) set.add(b.estancia);
  }
  return set;
}

function stanzaExcerpt(cantoElement, num) {
  const strongP = cantoElement.querySelector(`p[data-estancia="${num}"]`);
  if (!strongP) return "";
  const verseP = strongP.nextElementSibling;
  if (!verseP || verseP.tagName !== "P" || verseP.querySelector("strong:only-child")) return "";
  const text = verseP.textContent.trim();
  return text.length > 140 ? text.slice(0, 140).replace(/\s+\S*$/, "") + "\u2026" : text;
}

function renderCantoControls() {
  const article = document.querySelector("article.canto");
  if (!article) return;
  const slug = cantoSlug();
  const title = cantoTitle();
  const marcados = marked();
  tagStanzas().forEach((p) => {
    const num = p.dataset.estancia;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "marcador-toggle";
    btn.title = "Marcar/desmarcar estância";
    btn.setAttribute("aria-label", `Marcar estância ${num}`);
    btn.dataset.estancia = num;
    btn.setAttribute("aria-pressed", marcados.has(num) ? "true" : "false");
    p.appendChild(btn);
  });
  article.addEventListener("click", (e) => {
    const btn = e.target.closest(".marcador-toggle");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const num = btn.dataset.estancia;
    const list = all();
    const idx = list.findIndex((b) => b.canto === slug && b.estancia === num);
    if (idx >= 0) {
      list.splice(idx, 1);
      btn.setAttribute("aria-pressed", "false");
    } else {
      list.push({
        canto: slug,
        canto_titulo: title,
        estancia: num,
        excerto: stanzaExcerpt(article, num),
        nota: "",
        criado: new Date().toISOString(),
      });
      btn.setAttribute("aria-pressed", "true");
    }
    save(list);
  });
}

function renderList() {
  const root = document.getElementById("marcadores-app");
  if (!root) return;
  const list = all().slice().sort((a, b) => (b.criado || "").localeCompare(a.criado || ""));
  if (list.length === 0) {
    root.innerHTML = `<p class="vazio">Ainda sem marcadores. Abre um canto e clica no ícone ao lado da estância.</p>`;
    return;
  }
  const items = list.map((b) => `
    <li class="marcador-item">
      <a class="marcador-link" href="${escapeAttr(`/liber-oceani/cantos/${b.canto}/#e${b.estancia}`)}">
        <span class="marcador-canto">${escapeHTML(b.canto_titulo || b.canto)}</span>
        <span class="marcador-estancia">estância ${b.estancia}</span>
      </a>
      ${b.excerto ? `<blockquote class="marcador-excerto"><p>${escapeHTML(b.excerto)}</p></blockquote>` : ""}
      ${b.nota ? `<p class="marcador-nota">${escapeHTML(b.nota)}</p>` : ""}
      <button type="button" class="marcador-remover" data-canto="${escapeAttr(b.canto)}" data-estancia="${b.estancia}">Remover</button>
    </li>
  `).join("");
  root.innerHTML = `<ul class="marcador-lista">${items}</ul>`;
  root.addEventListener("click", (e) => {
    const btn = e.target.closest(".marcador-remover");
    if (!btn) return;
    const canto = btn.dataset.canto;
    const estancia = btn.dataset.estancia;
    const next = all().filter((b) => !(b.canto === canto && b.estancia === estancia));
    save(next);
    renderList();
  });
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function escapeAttr(s) { return escapeHTML(s); }

export function initMarcadores() {
  renderCantoControls();
  renderList();
}
