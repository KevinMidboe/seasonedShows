import SqliteDatabase from "./sqliteDatabase.js";
import Configuration from "../config/configuration.js";

const configuration = Configuration.getInstance();

const database = new SqliteDatabase(configuration.get("database", "host"));
/**
 * This module establishes a connection to the database
 * specified in the confgiuration file. It tries to setup
 * the required tables after successfully connecting.
 * If the tables already exists, it simply proceeds.
 */
Promise.resolve().then(() => database.setUp());

export default database;
