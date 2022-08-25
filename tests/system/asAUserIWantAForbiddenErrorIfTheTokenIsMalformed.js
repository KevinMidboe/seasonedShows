import assert from "assert";
import chai from "chai";
import chaiHttp from "chai-http";

import server from "../../src/webserver/server.js";
import resetDatabase from "../helpers/resetDatabase.js";

chai.use(chaiHttp);

describe("As a user I want a forbidden error if the token is malformed", () => {
  beforeEach(() => resetDatabase());

  it("should return 401", done => {
    chai
      .request(server)
      .get("/api/v1/user/settings")
      .set("Authorization", "maLfOrMed TOKEN")
      .end((error, response) => {
        assert.equal(response?.status, 401);
        done();
      });
  });
  // .then(response => {
  //   assert.equal(response.body.error, "You must be logged in.");
  // }));}
});
