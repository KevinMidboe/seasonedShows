const assert = require('assert');
const Stray = require('src/seasoned/stray');
const establishedDatabase = require('src/database/database');
var pythonShell = require('python-shell');

function foo(e) {
	throw('Foooo');
}

class StrayRepository {

	constructor(database) {
		this.database = database || establishedDatabase;
		this.queries = {
			'read': 'SELECT * FROM stray_eps WHERE id = ?',
			'readAll': 'SELECT id, name, season, episode FROM stray_eps',
			'checkVerified': 'SELECT id FROM stray_eps WHERE verified = 0 AND id = ?',
			'verify': 'UPDATE stray_eps SET verified = 1 WHERE id = ?',
		};
	}

	read(strayId) {
		return this.database.get(this.queries.read, strayId).then((row) => {
			assert.notEqual(row, undefined, `Could not find list with id ${strayId}.`);
			return row;
		})
	}

	readAll() {
		return this.database.all(this.queries.readAll).then(rows =>
			rows.map((row) => {
				const stray = new Stray(row.id);
				stray.name = row.name;
				stray.season = row.season;
				stray.episode = row.episode;
				return stray;
			}))
	}

	verifyStray(strayId) {
		return this.database.get(this.queries.checkVerified, strayId).then((row) => {
			assert.notEqual(row, undefined, `Stray '${strayId}' already verified.`);

			var options = {
				args: [strayId]
			}

			pythonShell.run('moveSeasoned.py', options, function (err, results) {
			  if (err) throw err;
			  // results is an array consisting of messages collected during execution
			  console.log('results: %j', results);
			});

			return this.database.run(this.queries.verify, strayId);
		})
	}
}

module.exports = StrayRepository;