const assert = require("assert");
const request = require("supertest-as-promised");
const app = require("../../src/webserver/app");
const resetDatabase = require("../helpers/resetDatabase");
const createCacheEntry = require("../helpers/createCacheEntry");
const popularMoviesSuccess = require("../fixtures/popular-movies-success-response.json");

describe("As a user I want to get popular movies", () => {
  beforeEach(() => resetDatabase());
  beforeEach(() =>
    createCacheEntry("tmdb/miscPopularMovies:1", popularMoviesSuccess)
  );

  it("should return 200 with the information", () =>
    request(app)
      .get("/api/v2/movie/popular")
      .expect(200)
      .then(response => {
        assert.equal(response.body?.results?.length, 20);
      }));
});
