import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toParamsArray = params => {
  if (params === undefined || params === null) return [];
  return Array.isArray(params) ? params : [params];
};

class SqliteDatabase {
  constructor(host) {
    this.host = host;
    this.connection = new DatabaseSync(this.host);
    this.connection.exec("pragma foreign_keys = on;");
    this.schemaDirectory = path.join(__dirname, "schemas");
  }

  /**
   * Run a SQL query against the database (INSERT, UPDATE, DELETE).
   * @param {String} sql SQL query
   * @param {Array|*} parameters positional parameters for the query
   * @returns {Promise<{changes: number, lastInsertRowid: number}>}
   */
  run(sql, parameters) {
    return new Promise((resolve, reject) => {
      try {
        const result = this.connection.prepare(sql).run(...toParamsArray(parameters));
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Run a SQL query and retrieve all matching rows.
   * @param {String} sql SQL query
   * @param {Array|*} parameters positional parameters for the query
   * @returns {Promise<Array>}
   */
  all(sql, parameters) {
    return new Promise((resolve, reject) => {
      try {
        const rows = this.connection.prepare(sql).all(...toParamsArray(parameters));
        resolve(rows);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Run a SQL query and retrieve the first matching row.
   * @param {String} sql SQL query
   * @param {Array|*} parameters positional parameters for the query
   * @returns {Promise<Object|undefined>}
   */
  get(sql, parameters) {
    return new Promise((resolve, reject) => {
      try {
        const row = this.connection.prepare(sql).get(...toParamsArray(parameters));
        resolve(row);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Execute one or more SQL statements (no parameter binding).
   * @param {String} sql SQL statements
   * @returns {Promise<void>}
   */
  execute(sql) {
    return new Promise((resolve, reject) => {
      try {
        this.connection.exec(sql);
        resolve();
      } catch (error) {
        console.log("ERROR: ", error);
        reject(error);
      }
    });
  }

  /**
   * Setup the database by running setup.sql file in schemas/.
   * @returns {Promise}
   */
  setUp() {
    const setupSchema = this.readSqlFile("setup.sql");
    return this.execute(setupSchema);
  }

  /**
   * Tears down the database by running tearDown.sql file in schemas/.
   * @returns {Promise}
   */
  tearDown() {
    const tearDownSchema = this.readSqlFile("teardown.sql");
    return this.execute(tearDownSchema);
  }

  /**
   * Returns the file contents of a SQL file in schemas/.
   * @returns {String}
   */
  readSqlFile(filename) {
    const schemaPath = path.join(this.schemaDirectory, filename);
    return fs.readFileSync(schemaPath).toString("utf-8");
  }
}

export default SqliteDatabase;
