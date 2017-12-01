const assert = require('assert');
const establishedDatabase = require('src/database/database');

class Cache {
	constructor(database) {
		this.database = database || establishedDatabase
		this.queries = {
		'read': 'SELECT value, time_to_live, created_at, DATETIME("now", "localtime") as now, ' +
			'DATETIME(created_at, "+" || time_to_live || " seconds") as expires ' + 
			'FROM cache WHERE key = ? AND now < expires',
		'create': 'INSERT OR REPLACE INTO cache (key, value, time_to_live) VALUES (?, ?, ?)',
		};
	}

	/**
	 * Retrieve an unexpired cache entry by key.
	 * @param {String} key of the cache entry
	 * @returns {Object}
	 */
	 get(key) {
	 	return Promise.resolve()
	 	.then(() => this.database.get(this.queries.read, [key]))
	 	.then((row) => {
	 		assert(row, 'Could not find cache enrty with that key.');
	 		return JSON.parse(row.value);
	 	})
	 }

	/**
	 * Insert cache entry with key and value.
	 * @param {String} key of the cache entry
	 * @param {String} value of the cache entry
	 * @param {Number} timeToLive the number of seconds before entry expires
	 * @returns {Object}
	 */
	 set(key, value, timeToLive = 172800) {
	 	const json = JSON.stringify(value);
	 	return Promise.resolve()
	 	.then(() => this.database.run(this.queries.create, [key, json, timeToLive]))
	 	.then(() => value);
	 }
}

module.exports = Cache;
