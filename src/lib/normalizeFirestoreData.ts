export function normalizeFirestoreData(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;

  if (obj.toDate && typeof obj.toDate === 'function') {
    return obj.toDate().toISOString();
  }

  if (obj.latitude !== undefined && obj.longitude !== undefined) {
    return { lat: obj.latitude, lng: obj.longitude };
  }

  if (Array.isArray(obj)) {
    return obj.map(normalizeFirestoreData);
  }

  const out: any = {};
  for (const key in obj) {
    out[key] = normalizeFirestoreData(obj[key]);
  }
  return out;
}
