const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../../src/webserver/server");
const resetDatabase = require("../helpers/resetDatabase");
const createCacheEntry = require("../helpers/createCacheEntry");
const popularMoviesSuccess = require("../fixtures/popular-movies-success-response.json");

chai.use(chaiHttp);

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
