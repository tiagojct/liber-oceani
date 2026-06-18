import { get, set } from "./storage.js";

const MIN = 14;
const MAX = 26;
const STEP = 2;

function read() {
  const v = get("fontSize");
  if (typeof v === "number" && v >= MIN && v <= MAX) return v;
  return null;
}

function apply(sz) {
  if (sz === null) {
    document.documentElement.style.fontSize = "";
  } else {
    document.documentElement.style.fontSize = `${sz}px`;
  }
}

export function initFont() {
  const saved = read();
  if (saved !== null) apply(saved);

  const smaller = document.querySelector(".font-smaller");
  const larger = document.querySelector(".font-larger");
  const reset = document.querySelector(".font-reset");
  if (!smaller || !larger || !reset) return;

  function currentSz() {
    const v = read();
    if (v !== null) return v;
    const style = getComputedStyle(document.documentElement);
    const px = parseFloat(style.fontSize);
    return isNaN(px) ? 18 : Math.round(px);
  }

  smaller.addEventListener("click", () => {
    const sz = Math.max(MIN, currentSz() - STEP);
    set("fontSize", sz);
    apply(sz);
  });

  larger.addEventListener("click", () => {
    const sz = Math.min(MAX, currentSz() + STEP);
    set("fontSize", sz);
    apply(sz);
  });

  reset.addEventListener("click", () => {
    set("fontSize", null);
    apply(null);
    localStorage.removeItem("liber-oceani.fontSize");
  });
}
