const cache = new Map();

exports.getCache = (key) => {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.exp) { cache.delete(key); return null; }
  return item.value;
};

exports.setCache = (key, value, ttlMs = 5 * 60 * 1000) => {
  cache.set(key, { value, exp: Date.now() + ttlMs });
};
