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

function getTmdbMovieList(res, listname, page) {
  Promise.resolve()
  .then(() => tmdb.movieList(listname, page))
  .then((response) => res.send(response))
  .catch((error) => {
    res.status(500).send({ success: false, error: error.message });
  })
}

function getTmdbShowList(res, listname, page) {
  Promise.resolve()
  .then(() => tmdb.showList(listname, page))
  .then((response) => res.send(response))
  .catch((error) => {
    res.status(500).send({ success: false, error: error.message });
  })
}

exports.nowPlayingMovies = (req, res) => {
  const { page } = req.query;
  const listname = 'miscNowPlayingMovies'

  getTmdbMovieList(res, listname, page);
}

exports.popularMovies = (req, res) => {
  const { page } = req.query;
  const listname = 'miscPopularMovies'

  getTmdbMovieList(res, listname, page);
}

exports.topRatedMovies = (req, res) => {
  const { page } = req.query;
  const listname = 'miscTopRatedMovies'

  getTmdbMovieList(res, listname, page);
}

exports.upcomingMovies = (req, res) => {
  const { page } = req.query;
  const listname = 'miscUpcomingMovies'

  getTmdbMovieList(res, listname, page);
}

exports.nowPlayingShows = (req, res) => {
  const { page } = req.query;
  const listname = 'tvOnTheAir'

  getTmdbShowList(res, listname, page);
}

exports.popularShows = (req, res) => {
  const { page } = req.query;
  const listname = 'miscPopularTvs'

  getTmdbShowList(res, listname, page);
}

exports.topRatedShows = (req, res) => {
  const { page } = req.query;
  const listname = 'miscTopRatedTvs'

  getTmdbShowList(res, listname, page);
}
