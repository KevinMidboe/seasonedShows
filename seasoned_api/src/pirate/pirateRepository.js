const assert = require("assert");
const http = require("http");
const { URL } = require("url");
const PythonShell = require("python-shell");

const establishedDatabase = require("src/database/database");

const RedisCache = require("src/cache/redis");
const cache = new RedisCache();

function getMagnetFromURL(url) {
  return new Promise((resolve, reject) => {
    const options = new URL(url);
    if (options.protocol.includes("magnet")) resolve(url);

    http.get(options, res => {
      if (res.statusCode == 301 || res.statusCode == 302) {
        resolve(res.headers.location);
      }
    });
  });
}

async function find(searchterm, callback) {
  const options = {
    pythonPath: "../torrent_search/env/bin/python3",
    scriptPath: "../torrent_search",
    args: [searchterm, "-s", "jackett", "-f", "--print"]
  };

  PythonShell.run("torrentSearch/search.py", options, callback);
  // PythonShell does not support return
}

async function callPythonAddMagnet(url, callback) {
  getMagnetFromURL(url)
    .then(magnet => {
      const options = {
        pythonPath: "../delugeClient/env/bin/python3",
        scriptPath: "../delugeClient",
        args: ["add", magnet]
      };

      PythonShell.run("deluge_cli.py", options, callback);
    })
    .catch(err => {
      console.log(err);
      throw new Error(err);
    });
}

async function SearchPiratebay(query) {
  if (query && query.includes("+")) {
    query = query.replace("+", "%20");
  }

  const cacheKey = `pirate/${query}`;

  return new Promise((resolve, reject) =>
    cache
      .get(cacheKey)
      .then(resolve)
      .catch(() =>
        find(query, (err, results) => {
          if (err) {
            console.log("THERE WAS A FUCKING ERROR!\n", err);
            reject(Error("There was a error when searching for torrents"));
          }

          if (results) {
            const jsonData = JSON.parse(results[1], null, "\t");
            cache.set(cacheKey, jsonData);
            resolve(jsonData);
          }
        })
      )
  );
}

async function AddMagnet(magnet, name, tmdb_id) {
  return await new Promise((resolve, reject) =>
    callPythonAddMagnet(magnet, (err, results) => {
      if (err) {
        /* eslint-disable no-console */
        console.log(err);
        reject(Error("Enable to add torrent", err));
      }
      /* eslint-disable no-console */
      console.log("result/error:", err, results);

      database = establishedDatabase;
      insert_query =
        "INSERT INTO requested_torrent(magnet,torrent_name,tmdb_id) \
         VALUES (?,?,?)";

      let response = database.run(insert_query, [magnet, name, tmdb_id]);
      console.log("Response from requsted_torrent insert: " + response);

      resolve({ success: true });
    })
  );
}

module.exports = { SearchPiratebay, AddMagnet };
