import http from "http";
import { URL } from "url";
import { spawn } from "child_process";

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

function removeNewLineListItem(list) {
  return list.filter(el => !el.includes("\n"));
}

async function find(searchterm, callback) {
  let data = [];
  const args = [searchterm, "-s", "jackett", "--print"];
  const torrentSearch = spawn("torrentsearch", args);

  torrentSearch.stdout.on("data", d => {
    console.log("got data, appending:", d);
    data.push(d.toString());
  });

  torrentSearch.on("exit", () => {
    data = removeNewLineListItem(data);
    data = data.join("");
    console.log("returning to callback:", data);

    callback(null, data);
  });

  PythonShell.run("torrentsearch", options, callback);
  // PythonShell does not support return
}

async function callPythonAddMagnet(url, callback) {
  getMagnetFromURL(url)
    .then(magnet => {
      const options = { args: ["add", magnet] };

      PythonShell.run("delugeClient", options, callback);
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
            const jsonData = JSON.parse(results, null, "\t");
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
