import assert from "assert";
import chai from "chai";
import chaiHttp from "chai-http";

import server from "../../src/webserver/server.js";
import createUser from "../helpers/createUser.js";
import resetDatabase from "../helpers/resetDatabase.js";

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
