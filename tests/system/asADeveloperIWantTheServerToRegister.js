const assert = require("assert");
const request = require("supertest-as-promised");
const app = require("../../src/webserver/app");
const resetDatabase = require("../helpers/resetDatabase");

describe('As a user I want to register', () => {
  before(() => resetDatabase());

  it('should return 200 and a message indicating success', () =>
    request(app)
    .post('/api/v1/user')
    .send({ username: 'test', email: 'test@gmail.com', password: 'password' })
    .expect(200)
    .then(response => assert.equal(response.body.message, 'Welcome to Seasoned!'))
  );
});
