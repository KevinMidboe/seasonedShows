const Cache = require('src/tmdb/cache');
const SqliteDatabase = require('src/database/sqliteDatabase');

function createCacheEntry(key, value) {
  const cache = new Cache();
  return cache.set(key, value);
}

module.exports = createCacheEntry;
