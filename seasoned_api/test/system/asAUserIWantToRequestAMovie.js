const resetDatabase = require('test/helpers/resetDatabase');
const app = require('src/webserver/app');
const request = require('supertest-as-promised');
const createUser = require('test/helpers/createUser');
const createToken = require('test/helpers/createToken');

describe('As a user I want to request a movie', () => {
  before(() => resetDatabase());
  before(() => createUser('test_user', 'test@gmail.com', 'password'));

  it('should return 200 when item is requested', () =>
    request(app)
    .post('/api/v1/plex/request/31749')
    .set('Authorization', createToken('test_user', 'secret'))
    .expect(200)
  );
});
