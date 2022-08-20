const request = require("supertest-as-promised");
const app = require("../../src/webserver/app");
const createUser = require("../helpers/createUser");
const resetDatabase = require("../helpers/resetDatabase");
// const assert = require("assert");

describe('As a user I want to log in', () => {
  before(() => {
    return resetDatabase()
    .then(() => createUser('test_user', 'password'))
  })

  it('should return 200 with a token if correct credentials are given', () =>
    request(app)
    .post('/api/v1/user/login')
    .send({ username: 'test_user', password: 'password' })
    .expect(200)
    .then(response => assert.equal(typeof response.body.token, 'string'))
  );

  it('should return 401 if incorrect credentials are given', () =>
    request(app)
    .post('/api/v1/user/login')
    .send({ username: 'test_user', password: 'anti-password' })
    .expect(401)
  );
});
