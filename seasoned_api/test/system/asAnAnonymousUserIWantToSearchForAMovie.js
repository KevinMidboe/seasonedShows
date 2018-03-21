const createCacheEntry = require('test/helpers/createCacheEntry');
const resetDatabase = require('test/helpers/resetDatabase');
const request = require('supertest-as-promised');
const app = require('src/webserver/app');
const interstellarQuerySuccess = require('test/fixtures/interstellar-query-success-response.json');

describe('As an anonymous user I want to search for a movie', () => {
  before(() => resetDatabase());
  before(() => createCacheEntry('se:1:multi:interstellar', interstellarQuerySuccess));

  it('should return 200 with the search results even if user is not logged in', () =>
    request(app)
    .get('/api/v1/tmdb/search?query=interstellar&page=1')
    .expect(200)
  );
});
