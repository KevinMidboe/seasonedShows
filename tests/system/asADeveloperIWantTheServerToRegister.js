const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../../src/webserver/server");
const resetDatabase = require("../helpers/resetDatabase");

chai.use(chaiHttp);

describe("As a user I want to register", () => {
  beforeEach(() => resetDatabase());

  it("should return 200 and a message indicating success", done => {
    chai
      .request(server)
      .post("/api/v1/user")
      .send({ username: "test", email: "test@gmail.com", password: "password" })
      .end((error, response) => {
        assert.equal(response?.status, 200);
        assert.equal(response?.body?.message, "Welcome to Seasoned!");
        done();
      });
  });
});
