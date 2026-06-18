import { initFont } from "./font.js";
import { initMode } from "./mode.js";
import { initAnot } from "./anot.js";
import { initProgress } from "./progress.js";
import { initMarcadores } from "./marcadores.js";
import { initDestaques } from "./destaques.js";
import { initDados } from "./dados.js";
import { initPesquisa } from "./pesquisa.js";

function start() {
  initFont();
  initMode();
  initAnot();
  initMarcadores();
  initDestaques();
  initProgress();
  initDados();
  initPesquisa();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
