import redis from "redis";
import Configuration from "../config/configuration.js";

const configuration = Configuration.getInstance();
let client;
const mockCache = {};

try {
  console.log("Trying to connect with redis.."); // eslint-disable-line no-console
  const host = configuration.get("redis", "host");
  const port = configuration.get("redis", "port");

  client = redis.createClient({
    url: `redis://${host}:${port}`
  });

  client.on("connect", () => console.log("Redis connection established!")); // eslint-disable-line no-console

  client.on("error", () => {
    client.quit();
    console.error("Unable to connect to redis, setting up redis-mock."); // eslint-disable-line no-console

    client = {
      get(key, callback) {
        console.log(`redis-dummy get: ${key}`); // eslint-disable-line no-console
        const hit = mockCache[key];
        return Promise.resolve().then(callback(null, hit));
      },
      set(key, json, callback) {
        console.log(`redis-dummy set: ${key}`); // eslint-disable-line no-console
        mockCache[key] = JSON.stringify(json);
        return Promise.resolve().then(callback(null, "OK"));
      },
      expire(key, TTL) {
        console.log(`redis-dummy expire: ${key} with TTL ${TTL}`); // eslint-disable-line no-console
      }
    };
  });
} catch (e) {}

function set(key, value, TTL = 10800) {
  if (value == null || key == null) return null;

  const json = JSON.stringify(value);
  client.set(key, json, (error, reply) => {
    if (reply === "OK") {
      // successfully set value with key, now set TTL for key
      client.expire(key, TTL, "NX", e => {
        if (e)
          // eslint-disable-next-line no-console
          console.error(
            "Unexpected error while setting expiration for key:",
            key,
            ". Error:",
            error
          );
      });
    }
  });

  return value;
}

function get(key) {
  return new Promise((resolve, reject) => {
    client.get(key, (error, reply) => {
      if (reply === null) {
        return reject();
      }

      return resolve(JSON.parse(reply));
    });
  });
}

export default {
  set,
  get
};
