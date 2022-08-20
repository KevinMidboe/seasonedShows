const redisCache = require("../../src/cache/redis");

function createCacheEntry(key, value) {
  return redisCache.set(key, value);
}

module.exports = createCacheEntry;
