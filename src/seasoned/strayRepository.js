const assert = require("assert");
const pythonShell = require("python-shell");
const Stray = require("./stray");
const establishedDatabase = require("../database/database");

class StrayRepository {
  constructor(database) {
    this.database = database || establishedDatabase;
    this.queries = {
      read: "SELECT * FROM stray_eps WHERE id = ?",
      readAll: "SELECT id, name, season, episode, verified FROM stray_eps",
      readAllFiltered:
        "SELECT id, name, season, episode, verified FROM stray_eps WHERE verified = ",
      checkVerified: "SELECT id FROM stray_eps WHERE verified = 0 AND id = ?",
      verify: "UPDATE stray_eps SET verified = 1 WHERE id = ?"
    };
  }

  read(strayId) {
    return this.database.get(this.queries.read, strayId).then(row => {
      assert.notEqual(
        row,
        undefined,
        `Could not find list with id ${strayId}.`
      );
      return row;
    });
  }

  readAll(verified = null) {
    let dbSearchQuery = this.queries.readAll;
    if (verified != null) {
      dbSearchQuery = this.queries.readAllFiltered + verified.toString();
    }
    return this.database.all(dbSearchQuery).then(rows =>
      rows.map(row => {
        const stray = new Stray(row.id);
        stray.name = row.name;
        stray.season = row.season;
        stray.episode = row.episode;
        stray.verified = row.verified;
        return stray;
      })
    );
  }

  verifyStray(strayId) {
    return this.database.get(this.queries.checkVerified, strayId).then(row => {
      assert.notEqual(row, undefined, `Stray '${strayId}' already verified.`);

      const options = {
        pythonPath: "../app/env/bin/python3",
        args: [strayId]
      };

      pythonShell.run("../app/moveSeasoned.py", options, (err, results) => {
        if (err) throw err;
        // TODO Add error handling!! StrayRepository.ERROR
        // results is an array consisting of messages collected during execution
        console.log("results: %j", results);
      });

      return this.database.run(this.queries.verify, strayId);
    });
  }
}

module.exports = StrayRepository;
