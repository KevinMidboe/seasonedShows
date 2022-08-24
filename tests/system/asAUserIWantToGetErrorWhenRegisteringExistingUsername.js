import assert from "assert";
import chai from "chai";
import chaiHttp from "chai-http";

import server from "../../src/webserver/server.js";
import createUser from "../helpers/createUser.js";
import resetDatabase from "../helpers/resetDatabase.js";

chai.use(chaiHttp);

describe("As a user I want error when registering existing username", () => {
  beforeEach(() => resetDatabase());
  beforeEach(() => createUser("test_user", "password"));

  it("should return 401 with error message when same username is given", done => {
    chai
      .request(server)
      .post("/api/v1/user")
      .send({ username: "test_user", password: "password" })
      .end((error, response) => {
        // console.log(response);
        assert.equal(response?.status, 401);
        assert.equal(
          response?.text,
          '{"success":false,"message":"That username is already registered"}'
        );
        done();
      });
  });
});
