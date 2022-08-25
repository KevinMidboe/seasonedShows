import assert from "assert";
import chai from "chai";
import chaiHttp from "chai-http";

import server from "../../src/webserver/server.js";
import resetDatabase from "../helpers/resetDatabase.js";

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
