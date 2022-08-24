import assert from "assert";
// import convertTmdbToMovie = require('src/tmdb/convertTmdbToMovie');
import { Movie } from "../../../src/tmdb/types.js";
import readFixtureContents from "../../helpers/importFixture.js";

const bladeRunnerQuerySuccess = readFixtureContents(
  "blade_runner_2049-info-success-response.json"
);

let bladeRunnerTmdbMovie;

describe("Convert tmdb movieInfo to movie", () => {
  beforeEach(() => {
    [bladeRunnerTmdbMovie] = bladeRunnerQuerySuccess;
  });

  it("should translate the tmdb release date to movie year", () => {
    const bladeRunner = Movie.convertFromTmdbResponse(bladeRunnerTmdbMovie);
    assert.strictEqual(bladeRunner.year, 2017);
  });

  it("should translate the tmdb release date to instance of Date", () => {
    const bladeRunner = Movie.convertFromTmdbResponse(bladeRunnerTmdbMovie);
    assert(bladeRunner.releaseDate instanceof Date);
  });

  it("should translate the tmdb title to title", () => {
    const bladeRunner = Movie.convertFromTmdbResponse(bladeRunnerTmdbMovie);
    assert.equal(bladeRunner.title, "Blade Runner 2049");
  });

  it("should translate the tmdb vote_average to rating", () => {
    const bladeRunner = Movie.convertFromTmdbResponse(bladeRunnerTmdbMovie);
    assert.equal(bladeRunner.rating, 7.3);
  });
});
