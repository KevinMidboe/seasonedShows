const assert = require('assert');
const createCacheEntry = require('test/helpers/createCacheEntry');
const resetDatabase = require('test/helpers/resetDatabase');
const request = require('supertest-as-promised');
const app = require('src/webserver/app');
const popularMoviesSuccess = require('test/fixtures/popular-movies-success-response.json');

describe('As a user I want to get popular movies', () => {
  before(() => resetDatabase());
  before(() => createCacheEntry('p:movie::1', popularMoviesSuccess));

  it('should return 200 with the information', () =>
    request(app)
    .get('/api/v1/tmdb/list/popular')
    .expect(200)
    .then(response => assert.equal(response.body.results.length, 20))
  );
});