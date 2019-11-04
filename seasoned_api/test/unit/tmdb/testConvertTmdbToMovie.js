const assert = require('assert');
// const convertTmdbToMovie = require('src/tmdb/convertTmdbToMovie');
const { Movie } = require('src/tmdb/types');
const bladeRunnerQuerySuccess = require('test/fixtures/blade_runner_2049-info-success-response.json') 

describe('Convert tmdb movieInfo to movie', () => {
  beforeEach(() => [this.bladeRunnerTmdbMovie] = bladeRunnerQuerySuccess);

  it('should translate the tmdb release date to movie year', () => {
    const bladeRunner = Movie.convertFromTmdbResponse(this.bladeRunnerTmdbMovie);
    assert.strictEqual(bladeRunner.year, 2017);
  });

  it('should translate the tmdb release date to instance of Date', () => {
    const bladeRunner = Movie.convertFromTmdbResponse(this.bladeRunnerTmdbMovie);
    assert(bladeRunner.releaseDate instanceof Date);
  });

  it('should translate the tmdb title to title', () => {
    const bladeRunner = Movie.convertFromTmdbResponse(this.bladeRunnerTmdbMovie);
    assert.equal(bladeRunner.title, 'Blade Runner 2049');
  });

  it('should translate the tmdb vote_average to rating', () => {
    const bladeRunner = Movie.convertFromTmdbResponse(this.bladeRunnerTmdbMovie);
    assert.equal(bladeRunner.rating, 7.3);
  });

   
 
});
