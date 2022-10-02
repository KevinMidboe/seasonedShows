import http from "http";
import { URL } from "url";
import { spawn } from "child_process";

import establishedDatabase from "../database/database.js";
import cache from "../cache/redis.js";

class SearchPackageNotFoundError extends Error {
  constructor() {
    const message = "Search is not setup, view logs.";
    super(message);

    const warningMessage = `Warning! Package 'torrentSearch' not setup! View project README.`;
    console.log(warningMessage); /* eslint-disable-line no-console */
  }
}

class AddMagnetPackageNotFoundError extends Error {
  constructor() {
    const message = "Adding magnet is not setup, view logs.";
    super(message);

    const warningMessage = `Warning! Package 'delugeClient' not setup! View project README.`;
    console.log(warningMessage); /* eslint-disable-line no-console */
  }
}

class InvalidMagnetUrlError extends Error {
  constructor() {
    const message = "Invalid magnet url.";
    super(message);
  }
}

class UnexpectedScriptError extends Error {
  constructor(_package, error = null) {
    const message = `There was an unexpected error while running package: ${_package}`;
    super(message);
    this.error = error;

    // console.log("Unexpected script error:", error);
  }
}

function getMagnetFromURL(url) {
  const options = new URL(url);
  if (options?.protocol?.includes("magnet")) return Promise.resolve(url);

  return new Promise((resolve, reject) => {
    http.get(options, res => {
      if (res.statusCode !== 301 && res.statusCode !== 302)
        reject(new InvalidMagnetUrlError());
      if (!res?.headers?.location?.includes("magnet"))
        reject(new InvalidMagnetUrlError());

      return resolve(res.headers.location);
    });
  });
}

function removeNewLineListItem(list) {
  return list.map(el => el.replace("\n", "")).filter(el => el.length !== 0);
}

function decodeBufferListToString(bufferList) {
  let data = bufferList.map(bufferElement => bufferElement.toString());
  if (data.length === 0) return null;

  data = removeNewLineListItem(data);
  return data.join("");
}

function addMagnetScript(magnet, callback) {
  const data = [];
  let error = null;
  const args = ["add", magnet];

  const addMagnet = spawn("delugeclient", args);

  addMagnet.stdout.on("data", bufferedData => data.push(bufferedData));
  addMagnet.stderr.on("data", bufferedError => {
    error = bufferedError.toString();
  });

  addMagnet.on("exit", () => callback(error, decodeBufferListToString(data)));
  addMagnet.on("error", error => {
    callback(error);
  });
}

function handleAddMagnetScriptError(error) {
  if (error?.code === "ENOENT") return new AddMagnetPackageNotFoundError();

  return new UnexpectedScriptError("delugeClient", error);
}

function searchScript(searchterm, callback) {
  const data = [];
  let error = null;
  const args = [searchterm, "-s", "jackett", "--print"];

  const torrentSearch = spawn("torrentsearch", args);

  torrentSearch.stdout.on("data", bufferedData => data.push(bufferedData));
  torrentSearch.stderr.on("data", bufferedError => {
    error = bufferedError.toString();
  });

  torrentSearch.on("exit", () =>
    callback(error, decodeBufferListToString(data))
  );
  torrentSearch.on("error", error => callback(error));
}

function handleSearchScriptError(error) {
  if (error?.code === "ENOENT") return new SearchPackageNotFoundError();

  return new UnexpectedScriptError("torrentSearch", error);
}

export async function SearchPiratebay(_query) {
  let query = String(_query);

  if (query?.includes("+")) {
    query = query.replace("+", "%20");
  }

  const cacheKey = `pirate/${query}`;
  try {
    const hit = await cache.get(cacheKey);

    if (hit) {
      return Promise.resolve(hit);
    }
  } catch (_) {}

  return new Promise((resolve, reject) => {
    searchScript(query, (error, results) => {
      if (error || !results) return reject(handleSearchScriptError(error));

      const jsonData = JSON.parse(results, null, "\t");
      cache.set(cacheKey, jsonData);
      return resolve(jsonData);
    });
  });
}

export async function AddMagnet(magnetUrl, name, tmdbId) {
  const magnet = await getMagnetFromURL(magnetUrl);
  const insertRequestedMagnetQuery =
    "INSERT INTO requested_torrent(magnet, torrent_name, tmdb_id) VALUES (?,?,?)";

  return new Promise((resolve, reject) => {
    addMagnetScript(magnet, (error, result) => {
      if (error || !result) return reject(handleAddMagnetScriptError(error));

      const magnetHash = result; // TODO save to database
      const database = establishedDatabase;
      return database
        .run(insertRequestedMagnetQuery, [magnet, name, tmdbId])
        .catch(error => reject(error))
        .then(() =>
          resolve({
            success: true,
            message: "Successfully added magnet",
            hash: magnetHash
          })
        );
    });
  });
}
