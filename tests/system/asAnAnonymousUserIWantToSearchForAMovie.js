const request = require("supertest-as-promised");
const app = require("../../src/webserver/app");
const resetDatabase = require("../helpers/resetDatabase");
const createCacheEntry = require("../helpers/createCacheEntry");
const interstellarQuerySuccess = require("../fixtures/interstellar-query-movie-success-response.json");

describe('As an anonymous user I want to search for a movie', () => {
  before(() => resetDatabase());
  before(() => createCacheEntry('mos:1:interstellar', interstellarQuerySuccess));

  it('should return 200 with the search results even if user is not logged in', () =>
    request(app)
    .get('/api/v2/search/movie?query=interstellar&page=1')
    .expect(200)
  );
});
