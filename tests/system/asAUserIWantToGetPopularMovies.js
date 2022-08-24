import assert from "assert";
import chai from "chai";
import chaiHttp from "chai-http";

import server from "../../src/webserver/server.js";
import resetDatabase from "../helpers/resetDatabase.js";
import createCacheEntry from "../helpers/createCacheEntry.js";
import readFixtureContents from "../helpers/importFixture.js";

chai.use(chaiHttp);

const popularMoviesSuccess = readFixtureContents(
  "popular-movies-success-response.json"
);

describe("As a user I want to get popular movies", () => {
  beforeEach(() => resetDatabase());
  beforeEach(() => createCacheEntry("tmdb/pm:1", popularMoviesSuccess));

  it("should return 200 with the information", done => {
    chai
      .request(server)
      .get("/api/v2/movie/popular")
      .end((error, response) => {
        // console.log(response);

        assert.equal(response?.status, 200);
        done();
      });
  });
});
