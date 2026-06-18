let pf = null;
let loading = null;

async function ensurePagefind() {
  if (pf) return pf;
  if (loading) return loading;
  const base = document.documentElement.dataset.basepath || "/liber-oceani/";
  loading = import(`${base}pagefind/pagefind.js`).then(async (mod) => {
    await mod.options({ baseUrl: base });
    pf = mod;
    return mod;
  });
  return loading;
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function debounce(fn, ms) {
  let t;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), ms);
  };
}

function renderResults(panel, results, query) {
  if (!results || results.length === 0) {
    panel.innerHTML = `<p class="pesquisa-vazia">Nenhum resultado para "${escapeHTML(query)}".</p>`;
    panel.hidden = false;
    return;
  }
  panel.innerHTML = `<ul class="pesquisa-resultados">${results.slice(0, 8).map((r) => `
    <li class="pesquisa-item">
      <a href="${escapeHTML(r.url)}">
        <span class="pesquisa-titulo">${escapeHTML(r.meta && r.meta.title ? r.meta.title : r.url)}</span>
        <span class="pesquisa-excerto">${r.excerpt || ""}</span>
      </a>
    </li>
  `).join("")}</ul>`;
  panel.hidden = false;
}

async function runSearch(query, panel) {
  if (!query || query.length < 2) {
    panel.hidden = true;
    panel.innerHTML = "";
    return;
  }
  try {
    const mod = await ensurePagefind();
    const out = await mod.search(query);
    const top = await Promise.all(out.results.slice(0, 8).map((r) => r.data()));
    renderResults(panel, top, query);
  } catch (e) {
    panel.innerHTML = `<p class="pesquisa-vazia">Pesquisa indisponível.</p>`;
    panel.hidden = false;
  }
}

export function initPesquisa() {
  const form = document.querySelector(".site-search");
  if (!form) return;
  const input = form.querySelector("input[type='search']");
  const panel = form.querySelector(".search-panel");
  if (!input || !panel) return;

  const handler = debounce(() => runSearch(input.value.trim(), panel), 180);
  input.addEventListener("input", handler);
  input.addEventListener("focus", () => {
    if (panel.innerHTML) panel.hidden = false;
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    runSearch(input.value.trim(), panel);
  });
  document.addEventListener("click", (e) => {
    if (!form.contains(e.target)) panel.hidden = true;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { panel.hidden = true; input.blur(); }
  });
}
