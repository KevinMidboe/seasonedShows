const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../../src/webserver/server");
const createUser = require("../helpers/createUser");
const resetDatabase = require("../helpers/resetDatabase");

chai.use(chaiHttp);

describe("As a user I want to log in", () => {
  beforeEach(() => resetDatabase());
  beforeEach(() => createUser("test_user", "password"));

  it("should return 200 with a token if correct credentials are given", done => {
    chai
      .request(server)
      .post("/api/v1/user/login")
      .send({ username: "test_user", password: "password" })
      .end((error, response) => {
        // console.log(response);

        assert.equal(response?.status, 200);
        done();
      });
  });

  it("should return 401 if incorrect credentials are given", done => {
    chai
      .request(server)
      .post("/api/v1/user/login")
      .send({ username: "test_user", password: "anti-password" })
      .end((error, response) => {
        // console.log(response);

        assert.equal(response?.status, 401);
        done();
      });
  });
});
