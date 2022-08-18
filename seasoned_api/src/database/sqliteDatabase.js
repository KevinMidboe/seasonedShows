const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

class SqliteDatabase {
  constructor(host) {
    this.host = host;
    this.connection = new sqlite3.Database(this.host);
    this.execute("pragma foreign_keys = on;");
    this.schemaDirectory = path.join(__dirname, "schemas");
  }

  /**
   * Connect to the database.
   * @returns {Promise} succeeds if connection was established
   */
  // connect() {
  //    let database = ;
  //    this.connection = database;
  //    return database;
  // }

  /**
   * Run a SQL query against the database.
   * @param {String} sql SQL query
   * @param {Array} parameters in the SQL query
   * @returns {Promise}
   */
  run(sql, parameters) {
    return new Promise((resolve, reject) => {
      this.connection.run(sql, parameters, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  }

  /**
   * Run a SQL query against the database and retrieve all the rows.
   * @param {String} sql SQL query
   * @param {Array} parameters in the SQL query
   * @returns {Promise}
   */
  all(sql, parameters) {
    return new Promise((resolve, reject) => {
      this.connection.all(sql, parameters, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  }

  /**
   * Run a SQL query against the database and retrieve one row.
   * @param {String} sql SQL query
   * @param {Array} parameters in the SQL query
   * @returns {Promise}
   */
  get(sql, parameters) {
    return new Promise((resolve, reject) => {
      this.connection.get(sql, parameters, (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  }

  /**
   * Run a SQL query against the database and retrieve the status.
   * @param {String} sql SQL query
   * @param {Array} parameters in the SQL query
   * @returns {Promise}
   */
  execute(sql) {
    return new Promise(resolve => {
      this.connection.exec(sql, (err, database) => {
        if (err) {
          console.log("ERROR: ", err);
          reject(err);
        }
        resolve();
      });
    });
  }

  /**
   * Setup the database by running setup.sql file in schemas/.
   * @returns {Promise}
   */
  setUp() {
    const setupSchema = this.readSqlFile("setup.sql");
    return Promise.resolve(this.execute(setupSchema));
  }

  /**
   * Tears down the database by running tearDown.sql file in schemas/.
   * @returns {Promise}
   */
  tearDown() {
    const tearDownSchema = this.readSqlFile("teardown.sql");
    return Promise.resolve(this.execute(tearDownSchema));
  }

  /**
   * Returns the file contents of a SQL file in schemas/.
   * @returns {String}
   */
  readSqlFile(filename) {
    const schemaPath = path.join(this.schemaDirectory, filename);
    const schema = fs.readFileSync(schemaPath).toString("utf-8");
    return schema;
  }
}

module.exports = SqliteDatabase;
