import redisCache from "../../src/cache/redis.js";

export default function createCacheEntry(key, value) {
  return redisCache.set(key, value);
}
