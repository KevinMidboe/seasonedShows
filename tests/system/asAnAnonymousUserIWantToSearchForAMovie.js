const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../../src/webserver/server");
const resetDatabase = require("../helpers/resetDatabase");
const createCacheEntry = require("../helpers/createCacheEntry");
const interstellarQuerySuccess = require("../fixtures/interstellar-query-movie-success-response.json");

chai.use(chaiHttp);

describe("As an anonymous user I want to search for a movie", () => {
  beforeEach(() => resetDatabase());
  beforeEach(() =>
    createCacheEntry("tmdb/mos:1:interstellar:false", interstellarQuerySuccess)
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
