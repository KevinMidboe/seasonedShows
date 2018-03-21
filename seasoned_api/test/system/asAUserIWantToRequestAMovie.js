const resetDatabase = require('test/helpers/resetDatabase');
const createCacheEntry = require('test/helpers/createCacheEntry');
const app = require('src/webserver/app');
const request = require('supertest-as-promised');
const createUser = require('test/helpers/createUser');
const createToken = require('test/helpers/createToken');
const infoMovieSuccess = require('test/fixtures/arrival-info-success-response.json');

describe('As a user I want to request a movie', () => {
  before(() => {
   return resetDatabase()
   .then(() => createUser('test_user', 'test@gmail.com', 'password'));
   })
  before(() => createCacheEntry('i:movie:329865', infoMovieSuccess));

  it('should return 200 when item is requested', () =>
    request(app)
    .post('/api/v1/plex/request/329865')
    .set('Authorization', createToken('test_user', 'secret'))
    .expect(200)
  );
});
