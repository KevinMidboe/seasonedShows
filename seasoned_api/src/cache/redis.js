const redis = require("redis")
const client = redis.createClient()

class Cache {
  /**
   * Retrieve an unexpired cache entry by key.
   * @param {String} key of the cache entry
   * @returns {Promise}
   */
  get(key) {
    return new Promise((resolve, reject) => {
      client.get(key, (error, reply) => {
        if (reply == null) {
          return reject();
        }

        resolve(JSON.parse(reply));
      });
    });
  }

  /**
   * Insert cache entry with key and value.
   * @param {String} key of the cache entry
   * @param {String} value of the cache entry
   * @param {Number} timeToLive the number of seconds before entry expires
   * @returns {Object}
   */
  set(key, value, timeToLive = 10800) {
    if (value == null || key == null) return null;

    const json = JSON.stringify(value);
    client.set(key, json, (error, reply) => {
      if (reply == "OK") {
        // successfully set value with key, now set TTL for key
        client.expire(key, timeToLive, e => {
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
}

module.exports = Cache;
