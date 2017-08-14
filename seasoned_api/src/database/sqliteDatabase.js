const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

class SqliteDatabase {

	constructor(host) {
		this.host = host;
		this.connection = sqlite3;

		// this.schemaDirectory = path.join(__dirname, 'schemas');
	}

	connect() {
		return Promise.resolve()
		.then(() => new sqlite3.Database(this.host))
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