import SqliteDatabase from "./sqliteDatabase";
import Configuration from "../config/configuration";

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
