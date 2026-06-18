const KEY = "liber-oceani.ortografia";

function getSaved() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}

function save(orto) {
  localStorage.setItem(KEY, JSON.stringify(orto));
}

function switchTo(orto) {
  document.querySelectorAll(".orto-texto").forEach((el) => {
    el.hidden = el.dataset.orto !== orto;
  });
  document.querySelectorAll(".orto-btn").forEach((btn) => {
    const active = btn.dataset.orto === orto;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });
  save(orto);
}

function initOrto() {
  const controls = document.querySelector(".orto-controls");
  if (!controls) return;

  const saved = getSaved() || "1572";
  switchTo(saved);

  controls.addEventListener("click", (e) => {
    const btn = e.target.closest(".orto-btn");
    if (!btn) return;
    switchTo(btn.dataset.orto);
  });
}

export { initOrto };
