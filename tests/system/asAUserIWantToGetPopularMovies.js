import assert from "assert";
import chai from "chai";
import chaiHttp from "chai-http";

import server from "../../src/webserver/server.js";
import resetDatabase from "../helpers/resetDatabase.js";
import createCacheEntry from "../helpers/createCacheEntry.js";
const popularMoviesSuccess = await import(
  "../fixtures/popular-movies-success-response.json",
  {
    assert: { type: "json" }
  }
);

chai.use(chaiHttp);

describe("As a user I want to get popular movies", () => {
  beforeEach(() => resetDatabase());
  beforeEach(() => createCacheEntry("tmdb/pm:1", popularMoviesSuccess.default));

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
