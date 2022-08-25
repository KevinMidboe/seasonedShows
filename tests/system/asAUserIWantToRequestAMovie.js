import assert from "assert";
import chai from "chai";
import chaiHttp from "chai-http";

import server from "../../src/webserver/server.js";
import createUser from "../helpers/createUser.js";
import createToken from "../helpers/createToken.js";
import resetDatabase from "../helpers/resetDatabase.js";
import createCacheEntry from "../helpers/createCacheEntry.js";
import readFixtureContents from "../helpers/importFixture.js";

chai.use(chaiHttp);

const infoMovieSuccess = readFixtureContents(
  "blade_runner_2049-info-success-response.json"
);

describe("As a user I want to request a movie", () => {
  beforeEach(() => resetDatabase());
  beforeEach(() => createUser("test_user", "test@gmail.com", "password"));
  beforeEach(() => createCacheEntry("mi:335984:false", infoMovieSuccess));

  it("should return 200 when item is requested", () => {
    chai
      .request(server)
      .post("/api/v2/request")
      .set("authorization", createToken("test_user", "secret"))
      .send({ id: 335984, type: "movie" })
      .end((error, response) => {
        assert.equal(response?.status, 200);
      });
  });
});
