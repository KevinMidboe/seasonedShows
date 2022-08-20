const assert = require("assert");
const request = require("supertest-as-promised");
const app = require("../../src/webserver/app");
const createUser = require("../helpers/createUser");
const resetDatabase = require("../helpers/resetDatabase");

describe('As a user I want error when registering existing username', () => {
  before(() => {
    return resetDatabase()
    .then(() => createUser('test_user', 'password'))
  })

  it('should return 401 with error message when same username is given', () =>
    request(app)
    .post('/api/v1/user')
    .send({ username: 'test_user', password: 'password' })
    .expect(401)
    .then(response => assert.equal(response.text, '{"success":false,"message":"That username is already registered"}'))
  );
});
