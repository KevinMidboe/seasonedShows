const Cache = require("../../src/tmdb/cache");

function createCacheEntry(key, value) {
  const cache = new Cache();
  return cache.set(key, value);
}

module.exports = createCacheEntry;
