const configuration = require('src/config/configuration').getInstance();
const SqliteDatabase = require('src/database/sqliteDatabase');

const database = new SqliteDatabase(configuration.get('database', 'host'));
/**
 * This module establishes a connection to the database
 * specified in the confgiuration file. It tries to setup
 * the required tables after successfully connecting.
 * If the tables already exists, it simply proceeds.
 */
Promise.resolve()
   .then(() => database.setUp());

module.exports = database;
