import { get, set } from "./storage.js";

function cantoSlug() {
  const meta = document.querySelector("article.canto");
  if (!meta) return null;
  const path = location.pathname.replace(/\/$/, "").split("/");
  return path[path.length - 1];
}

function cantoTitle() {
  const h1 = document.querySelector("article > header h1");
  return h1 ? h1.textContent.trim() : "";
}

function throttle(fn, ms) {
  let t = 0, last = 0;
  return function(...args) {
    const now = Date.now();
    const wait = ms - (now - last);
    if (wait <= 0) { last = now; fn.apply(this, args); }
    else { clearTimeout(t); t = setTimeout(() => { last = Date.now(); fn.apply(this, args); }, wait); }
  };
}

function save() {
  const slug = cantoSlug();
  if (!slug) return;
  set("progresso", {
    canto: slug,
    titulo: cantoTitle(),
    scroll: Math.round(window.scrollY),
    url: location.pathname,
    atualizado: new Date().toISOString(),
  });
}

function renderResume() {
  const box = document.getElementById("resume-box");
  if (!box) return;
  const p = get("progresso");
  const link = box.querySelector("a");
  const label = box.querySelector(".resume-label");
  const prefix = box.querySelector(".resume-prefix");
  if (p && p.url) {
    if (link) link.href = p.url;
    if (label) label.textContent = p.titulo || p.canto || "o teu lugar";
    if (prefix) prefix.textContent = "Retomar leitura";
    box.hidden = false;
  } else {
    if (link) {
      const first = document.querySelector(".home-start-link");
      link.href = first ? first.getAttribute("href") : "/liber-oceani/cantos/canto-01/";
    }
    if (label) label.textContent = "Canto I";
    if (prefix) prefix.textContent = "Começar a ler";
    box.hidden = false;
  }
}

export function initProgress() {
  renderResume();
  if (!cantoSlug()) return;
  const saved = get("progresso");
  if (saved && saved.canto === cantoSlug() && typeof saved.scroll === "number") {
    if (window.scrollY === 0 && saved.scroll > 0) {
      requestAnimationFrame(() => window.scrollTo({ top: saved.scroll, behavior: "instant" }));
    }
  }
  save();
  window.addEventListener("scroll", throttle(save, 500), { passive: true });
}
