const assert = require('assert');
const resetDatabase = require('test/helpers/resetDatabase');
const app = require('src/webserver/app');
const request = require('supertest-as-promised');

describe('As a user I want a forbidden error if the token is malformed', () => {
  before(() => resetDatabase());

  it('should return 401', () =>
    request(app)
    .get('/api/v1/pirate/search?query=test')
    .set('Authorization', 'maLfOrMed TOKEN')
    .expect(401)
    .then(response => assert.equal(response.body.error, 'You must be logged in.'))
  );
});
