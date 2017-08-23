const fs = require('fs');
const path = require('path');
const sqlite = require('sqlite');

class SqliteDatabase {

	constructor(host) {
		this.host = host;
		this.connection = sqlite;

		// this.schemaDirectory = path.join(__dirname, 'schemas');
	}

	connect() {
		return Promise.resolve()
		.then(() => sqlite.open(this.host))
		.then(() => sqlite.exec('pragma foreign_keys = on;'));
	}

	all(sql, parameters) {
		return this.connection.all(sql, parameters);
	}

	get(sql, parameters) {
		return this.connection.get(sql, parameters);
	}

	run(sql, parameters) {
		return this.connection.run(sql, parameters);
	}
}

module.exports = SqliteDatabase;
