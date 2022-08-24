import assert from "assert";
import chai from "chai";
import chaiHttp from "chai-http";

import server from "../../src/webserver/server.js";
import resetDatabase from "../helpers/resetDatabase.js";
import createCacheEntry from "../helpers/createCacheEntry.js";
const interstellarQuerySuccess = await import(
  "../fixtures/interstellar-query-movie-success-response.json",
  {
    assert: { type: "json" }
  }
);

chai.use(chaiHttp);

describe("As an anonymous user I want to search for a movie", () => {
  beforeEach(() => resetDatabase());
  beforeEach(() =>
    createCacheEntry(
      "tmdb/mos:1:interstellar:false",
      interstellarQuerySuccess.default
    )
  );

  it("should return 200 with the search results even if user is not logged in", done => {
    chai
      .request(server)
      .get("/api/v2/search/movie?query=interstellar&page=1")
      .end((error, response) => {
        // console.log(response);

        assert.equal(response?.status, 200);
        done();
      });
  });
});
