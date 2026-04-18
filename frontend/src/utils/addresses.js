const ADDRESS_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "street",
  "city",
  "state",
  "zipcode",
  "country",
  "phone",
];

export function getUserIdFromToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4;
    const padded = pad ? b64 + "=".repeat(4 - pad) : b64;
    const json = JSON.parse(atob(padded));
    return json.id != null ? String(json.id) : null;
  } catch {
    return null;
  }
}

function storageKey(userId) {
  return `bitehub_addresses_${userId}`;
}

export function readAddresses(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function writeAddresses(userId, list) {
  if (!userId) return;
  localStorage.setItem(storageKey(userId), JSON.stringify(list));
}

export function pickAddressFields(obj) {
  const o = {};
  ADDRESS_FIELDS.forEach((k) => {
    o[k] = obj[k] != null ? String(obj[k]) : "";
  });
  return o;
}

export function addressToForm(addr) {
  return pickAddressFields(addr || {});
}
