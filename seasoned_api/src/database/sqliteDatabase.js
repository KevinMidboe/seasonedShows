const fs = require('fs');
const path = require('path');
const sqlite = require('sqlite');

class SqliteDatabase {

   constructor(host) {
      this.host = host;
      this.connection = sqlite;
      this.schemaDirectory = path.join(__dirname, 'schemas');
   }

   /**
   * Connect to the database.
   * @returns {Promise} succeeds if connection was established
   */
   connect() {
      return Promise.resolve()
      .then(() => sqlite.open(this.host))
      .then(() => sqlite.exec('pragma foreign_keys = on;'));
   }

   /**
   * Run a SQL query against the database.
   * @param {String} sql SQL query
   * @param {Array} parameters in the SQL query
   * @returns {Promise}
   */
   run(sql, parameters) {
      return this.connection.run(sql, parameters);
   }

   /**
   * Run a SQL query against the database and retrieve all the rows.
   * @param {String} sql SQL query
   * @param {Array} parameters in the SQL query
   * @returns {Promise}
   */
   all(sql, parameters) {
      return this.connection.all(sql, parameters);
   }

   /**
   * Run a SQL query against the database and retrieve one row.
   * @param {String} sql SQL query
   * @param {Array} parameters in the SQL query
   * @returns {Promise}
   */
   get(sql, parameters) {
      return this.connection.get(sql, parameters);
   }

   /**
   * Run a SQL query against the database and retrieve the status.
   * @param {String} sql SQL query
   * @param {Array} parameters in the SQL query
   * @returns {Promise}
   */
   execute(sql) {
      return this.connection.exec(sql);
   }

   /**
   * Setup the database by running setup.sql file in schemas/.
   * @returns {Promise}
   */
   setUp() {
      const setupSchema = this.readSqlFile('setup.sql');
      return this.execute(setupSchema);
   }

   /**
   * Returns the file contents of a SQL file in schemas/.
   * @returns {String}
   */
   readSqlFile(filename) {
      const schemaPath = path.join(this.schemaDirectory, filename);
      const schema = fs.readFileSync(schemaPath).toString('utf-8');
      return schema;
   }
}

module.exports = SqliteDatabase;
