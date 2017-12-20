const Cache = require('src/tmdb/cache');
const SqliteDatabase = require('src/database/sqliteDatabase');

function createCacheEntry(key, value) {
  const database = new SqliteDatabase(':memory:');
  const cache = new Cache(database);
  return cache.set(key, value);
}

module.exports = createCacheEntry;
