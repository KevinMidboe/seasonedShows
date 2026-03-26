import TMDB from "../../../tmdb/tmdb.js";
import Configuration from "../../../config/configuration.js";

const configuration = Configuration.getInstance();
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));

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
function handleError(listname, error, res) {
  return res.status(error?.statusCode || 500).send({
    success: false,
    message:
      error?.message ||
      `An unexpected error occured while requesting list with id: ${listname}`
  });
}

function fetchTmdbList(req, res, listname, type) {
  const { page } = req.query;

  return tmdb
    .list(listname, type, page)
    .then(listResponse => res.send(listResponse))
    .catch(error => handleError(listname, error, res));
}

const nowPlayingMovies = (req, res) =>
  fetchTmdbList(req, res, "now_playing", "movie");
const popularMovies = (req, res) => fetchTmdbList(req, res, "popular", "movie");
const topRatedMovies = (req, res) =>
  fetchTmdbList(req, res, "top_rated", "movie");
const upcomingMovies = (req, res) =>
  fetchTmdbList(req, res, "upcoming", "movie");
const nowPlayingShows = (req, res) =>
  fetchTmdbList(req, res, "on_the_air", "show");
const popularShows = (req, res) => fetchTmdbList(req, res, "popular", "show");
const topRatedShows = (req, res) =>
  fetchTmdbList(req, res, "top_rated", "show");

export default {
  nowPlayingMovies,
  popularMovies,
  topRatedMovies,
  upcomingMovies,
  nowPlayingShows,
  popularShows,
  topRatedShows
};
