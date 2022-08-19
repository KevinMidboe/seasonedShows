const configuration = require("../config/configuration").getInstance();

let client;

try {
  const redis = require("redis"); // eslint-disable-line global-require
  console.log("Trying to connect with redis.."); // eslint-disable-line no-console
  const host = configuration.get("redis", "host");
  const port = configuration.get("redis", "port");

  console.log(`redis://${host}:${port}`); // eslint-disable-line no-console
  client = redis.createClient({
    url: `redis://${host}:${port}`
  });

  client.on("connect", () => console.log("Redis connection established!")); // eslint-disable-line no-console

  client.on("error", () => {
    client.quit();
    console.error("Unable to connect to redis, setting up redis-mock."); // eslint-disable-line no-console

    client = {
      get(command) {
        console.log(`redis-dummy get: ${command}`); // eslint-disable-line no-console
        return Promise.resolve();
      },
      set(command) {
        console.log(`redis-dummy set: ${command}`); // eslint-disable-line no-console
        return Promise.resolve();
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
      client.expire(key, TTL, e => {
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

module.exports = {
  get,
  set
};
