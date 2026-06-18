import { exportAll, importAll } from "./storage.js";

function download(filename, content, mime = "application/json") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 0);
}

function stamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

export function initDados() {
  const root = document.getElementById("dados-ferramentas");
  if (!root) return;
  const exportBtn = root.querySelector(".dados-exportar");
  const importInput = root.querySelector(".dados-importar");
  const status = root.querySelector(".dados-estado");

  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const payload = exportAll();
      download(`liber-oceani-${stamp()}.json`, JSON.stringify(payload, null, 2));
      if (status) status.textContent = `Exportados ${Object.keys(payload.data).length} items.`;
    });
  }
  if (importInput) {
    importInput.addEventListener("change", async () => {
      const file = importInput.files && importInput.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const payload = JSON.parse(text);
        importAll(payload);
        if (status) status.textContent = `Importados ${Object.keys(payload.data || {}).length} items. Recarrega para aplicar.`;
      } catch (e) {
        if (status) status.textContent = `Erro na importação: ${e.message}`;
      } finally {
        importInput.value = "";
      }
    });
  }
}
