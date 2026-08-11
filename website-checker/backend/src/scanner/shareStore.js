// In-memory store for shareable scan reports. Not persistent — resets on
// server restart. Good enough for now; swap for a real DB if/when this
// needs to survive restarts or scale across multiple server instances.
const TTL_MS = 48 * 60 * 60 * 1000; // 48 hours
const store = new Map();

function generateId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

export function saveReport(result) {
  const id = generateId();
  store.set(id, { result, expiresAt: Date.now() + TTL_MS });
  return id;
}

export function getReport(id) {
  const entry = store.get(id);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    store.delete(id);
    return null;
  }
  return entry.result;
}

setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of store.entries()) {
    if (entry.expiresAt < now) store.delete(id);
  }
}, 60 * 60 * 1000).unref();
