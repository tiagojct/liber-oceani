import { get, set } from "./storage.js";

const MODES = ["pergaminho", "sepia", "escuro"];
const DEFAULT = "pergaminho";

function read() {
  const v = get("mode", DEFAULT);
  return MODES.includes(v) ? v : DEFAULT;
}

function apply(mode) {
  document.documentElement.setAttribute("data-mode", mode);
  document.querySelectorAll(".mode-toggle button").forEach((b) => {
    b.setAttribute("aria-pressed", b.dataset.mode === mode ? "true" : "false");
  });
}

export function initMode() {
  apply(read());
  const toggle = document.querySelector(".mode-toggle");
  if (!toggle) return;
  toggle.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-mode]");
    if (!btn) return;
    const mode = btn.dataset.mode;
    if (!MODES.includes(mode)) return;
    set("mode", mode);
    apply(mode);
  });
}
