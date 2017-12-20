const SqliteDatabase = require('src/database/sqliteDatabase');

function resetDatabase() {
  const database = new SqliteDatabase(':memory:');
  return Promise.resolve()
  .then(() => database.connect());
  .then(() => database.tearDown());
  .then(() => database.setUp());
}

module.exports = resetDatabase;
