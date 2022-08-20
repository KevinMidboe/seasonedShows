const request = require("supertest-as-promised");
const app = require("../../src/webserver/app");
const createUser = require("../helpers/createUser");
const createToken = require("../helpers/createToken");
const resetDatabase = require("../helpers/resetDatabase");
const createCacheEntry = require("../helpers/createCacheEntry");
const infoMovieSuccess = require("../fixtures/blade_runner_2049-info-success-response.json");

describe('As a user I want to request a movie', () => {
  before(async () => {
    await resetDatabase()
    await createUser('test_user', 'test@gmail.com', 'password')
   })
  before(() => createCacheEntry('mi:335984:false', infoMovieSuccess));

  it('should return 200 when item is requested', () =>
    request(app)
    .post('/api/v2/request')
    .set('authorization', createToken('test_user', 'secret'))
    .send({ id: 335984, type: 'movie' })
    .expect(200)
  );
});
