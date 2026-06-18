export const NS = "liber-oceani.";

export function get(key, fallback = null) {
  try {
    const raw = localStorage.getItem(NS + key);
    if (raw == null) return fallback;
    try { return JSON.parse(raw); }
    catch { return raw; }
  } catch {
    return fallback;
  }
}

export function set(key, value) {
  try { localStorage.setItem(NS + key, JSON.stringify(value)); } catch {}
}

export function remove(key) {
  try { localStorage.removeItem(NS + key); } catch {}
}

export function keys() {
  const out = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(NS)) out.push(k.slice(NS.length));
    }
  } catch {}
  return out;
}

export function exportAll() {
  const dump = {};
  for (const k of keys()) dump[k] = get(k);
  return { schema: "liber-oceani.v1", exported_at: new Date().toISOString(), data: dump };
}

export function importAll(payload) {
  if (!payload || typeof payload !== "object" || !payload.data) {
    throw new Error("payload inválido");
  }
  for (const [k, v] of Object.entries(payload.data)) {
    set(k, v);
  }
}
