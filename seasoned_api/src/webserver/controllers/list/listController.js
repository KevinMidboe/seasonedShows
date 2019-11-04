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
function handleError(error, res) {
  const { status, message } = error;

  if (status && message) {
    res.status(status).send({ success: false, message })
  } else {
    console.log('caught list controller error', error)
    res.status(500).send({ message: 'An unexpected error occured while requesting list'})
  }
}

function handleListResponse(response, res) {
  return res.send(response)
    .catch(error => handleError(error, res))
}

function fetchTmdbList(req, res, listname, type) {
  const { page } = req.query;

  if (type === 'movie') {
    return tmdb.movieList(listname, page)
      .then(listResponse => res.send(listResponse))
      .catch(error => handleError(error, res))
  } else if (type === 'show') {
    return tmdb.showList(listname, page)
      .then(listResponse => res.send(listResponse))
      .catch(error => handleError(error, res))
  }

  handleError({
    status: 400,
    message: `'${type}' is not a valid list type.`
  }, res)
}

const nowPlayingMovies = (req, res) => fetchTmdbList(req, res, 'miscNowPlayingMovies', 'movie')
const popularMovies = (req, res) => fetchTmdbList(req, res, 'miscPopularMovies', 'movie')
const topRatedMovies = (req, res) => fetchTmdbList(req, res, 'miscTopRatedMovies', 'movie')
const upcomingMovies = (req, res) => fetchTmdbList(req, res, 'miscUpcomingMovies', 'movie')
const nowPlayingShows = (req, res) => fetchTmdbList(req, res, 'tvOnTheAir', 'show')
const popularShows = (req, res) => fetchTmdbList(req, res, 'miscPopularTvs', 'show')
const topRatedShows = (req, res) => fetchTmdbList(req, res, 'miscTopRatedTvs', 'show')

module.exports = {
  nowPlayingMovies,
  popularMovies,
  topRatedMovies,
  upcomingMovies,
  nowPlayingShows,
  popularShows,
  topRatedShows
}
