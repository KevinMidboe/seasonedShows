const { promisify } = require("util");
const configuration = require("../config/configuration").getInstance();

let client;

try {
  const redis = require("redis");
  console.log("Trying to connect with redis..");
  const host = configuration.get("redis", "host");
  const port = configuration.get("redis", "port");

  console.log(`redis://${host}:${port}`);
  client = redis.createClient({
    url: `redis://${host}:${port}`
  });

  client.on("connect", () => console.log("Redis connection established!"));

  client.on("error", function (err) {
    client.quit();
    console.error("Unable to connect to redis, setting up redis-mock.");

    client = {
      get() {
        console.log("redis-dummy get", arguments[0]);
        return Promise.resolve();
      },
      set() {
        console.log("redis-dummy set", arguments[0]);
        return Promise.resolve();
      }
    };
  });
} catch (e) {}

function set(key, value, TTL = 10800) {
  if (value == null || key == null) return null;

  const json = JSON.stringify(value);
  client.set(key, json, (error, reply) => {
    if (reply == "OK") {
      // successfully set value with key, now set TTL for key
      client.expire(key, TTL, e => {
        if (e)
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

function get() {
  return new Promise((resolve, reject) => {
    client.get(key, (error, reply) => {
      if (reply == null) {
        return reject();
      }

      resolve(JSON.parse(reply));
    });
  });
}

module.exports = {
  get,
  set
};
