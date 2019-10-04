const configuration = require('src/config/configuration').getInstance();
const Cache = require('src/tmdb/cache');
const TMDB = require('src/tmdb/tmdb');
const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));

// there should be a translate function from query params to 
// tmdb list that is valid. Should it be a helper function or does it 
// belong in tmdb. 
// + could also have default value that are sent to the client.
//   * have the same class create a getListNames() and a fetchList()
// * dicover list might be overkill_https://tinyurl.com/y7f8ragw
// + trending! https://tinyurl.com/ydywrqox 
//   by all, mediatype, or person. Can also define time periode to 
//   get more trending view of what people are checking out.
// + newly created (tv/latest).
// + movie/latest
//


const respondWithErrorMessage = (res, error) => {
  const status = error.status || 500
  const message = error.message || 'Unhandled error occured'
  const success = error.success || false

  // console.log('Unknown error:', error)
  return res.status(status).send({ success: success, error: message})
}

function fetchTmdbMovieList(req, res, listName, tmdbListFunction) {
  const { page } = req.query;

  return tmdb.movieList(listName, page)
    .then(nowPlayingMovieList => res.send(nowPlayingMovieList))
    .catch(error => respondWithErrorMessage(res, error))
}

function fetchTmdbShowList(req, res, listName, tmdbListFunction) {
  const { page } = req.query;

  return tmdb.showList(listName, page)
    .then(nowPlayingMovieList => res.send(nowPlayingMovieList))
    .catch(error => respondWithErrorMessage(res, error))
}

const nowPlayingMovies = (req, res) => fetchTmdbMovieList(req, res, 'miscNowPlayingMovies')
const popularMovies = (req, res) => fetchTmdbMovieList(req, res, 'miscPopularMovies')
const topRatedMovies = (req, res) => fetchTmdbMovieList(req, res, 'miscTopRatedMovies')
const upcomingMovies = (req, res) => fetchTmdbMovieList(req, res, 'miscUpcomingMovies')
const nowPlayingShows = (req, res) => fetchTmdbShowList(req, res, 'tvOnTheAir')
const popularShows = (req, res) => fetchTmdbShowList(req, res, 'miscPopularTvs')
const topRatedShows = (req, res) => fetchTmdbShowList(req, res, 'miscTopRatedTvs')

module.exports = {
  nowPlayingMovies,
  popularMovies,
  topRatedMovies,
  upcomingMovies,
  nowPlayingShows,
  popularShows,
  topRatedShows
}
