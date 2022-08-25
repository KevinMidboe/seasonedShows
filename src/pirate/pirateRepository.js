import http from "http";
import { URL } from "url";
import PythonShell from "python-shell";

import establishedDatabase from "../database/database.js";
import cache from "../cache/redis.js";

function getMagnetFromURL(url) {
  return new Promise(resolve => {
    const options = new URL(url);
    if (options.protocol.includes("magnet")) resolve(url);

    http.get(options, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        resolve(res.headers.location);
      }
    });
  });
}

async function find(searchterm, callback) {
  const options = {
    pythonPath: "../torrent_search/env/bin/python3",
    scriptPath: "../torrent_search",
    args: [searchterm, "-s", "jackett", "--print"]
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
      throw new Error(err);
    });
}

export async function SearchPiratebay(_query) {
  let query = String(_query);

  if (query?.includes("+")) {
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
            console.log("THERE WAS A FUCKING ERROR!\n", err); // eslint-disable-line no-console
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

export function AddMagnet(magnet, name, tmdbId) {
  return new Promise((resolve, reject) =>
    callPythonAddMagnet(magnet, (err, results) => {
      if (err) {
        /* eslint-disable no-console */
        console.log(err);
        reject(Error("Enable to add torrent", err));
      }
      /* eslint-disable no-console */
      console.log("result/error:", err, results);

      const database = establishedDatabase;
      const insertQuery =
        "INSERT INTO requested_torrent(magnet,torrent_name,tmdb_id) VALUES (?,?,?)";

      const response = database.run(insertQuery, [magnet, name, tmdbId]);
      console.log(`Response from requsted_torrent insert: ${response}`);

      resolve({ success: true });
    })
  );
}
