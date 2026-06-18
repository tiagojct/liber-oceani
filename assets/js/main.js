import { initFont } from "./font.js";
import { initMode } from "./mode.js";
import { initProgress } from "./progress.js";

function start() {
  initFont();
  initMode();
  initProgress();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
