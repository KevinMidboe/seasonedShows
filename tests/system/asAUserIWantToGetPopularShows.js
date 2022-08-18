const assert = require('assert');
const createCacheEntry = require('test/helpers/createCacheEntry');
const resetDatabase = require('test/helpers/resetDatabase');
const request = require('supertest-as-promised');
const app = require('src/webserver/app');
const popularShowsSuccess = require('test/fixtures/popular-show-success-response.json');

describe('As a user I want to get popular shows', () => {
  before(() => resetDatabase());
  before(() => createCacheEntry('pt:1', popularShowsSuccess));

  it('should return 200 with the information', () =>
    request(app)
    .get('/api/v2/show/popular')
    .expect(200)
    .then(response => assert.equal(response.body.results.length, 20))
  );
});
