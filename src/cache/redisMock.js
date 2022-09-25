const mockCache = {};

const redisMockClient = {
  get(key, callback) {
    // console.log(`redis-dummy get: ${key}`); // eslint-disable-line no-console
    const hit = mockCache[key] || null;
    return Promise.resolve(callback(null, hit));
  },
  set(key, json, callback) {
    // console.log(`redis-dummy set: ${key}`); // eslint-disable-line no-console
    mockCache[key] = JSON.stringify(json);
    return Promise.resolve(callback(null, "OK"));
  },
  expire(key, TTL) {
    console.log(`redis-dummy expire: ${key} with TTL ${TTL}`); // eslint-disable-line no-console
  }
};

export default redisMockClient;
