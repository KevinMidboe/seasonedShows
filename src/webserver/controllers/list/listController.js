import TMDB from "../../../tmdb/tmdb";
import Configuration from "../../../config/configuration";

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

  if (type === "movie") {
    return tmdb
      .movieList(listname, page)
      .then(listResponse => res.send(listResponse))
      .catch(error => handleError(listname, error, res));
  }
  if (type === "show") {
    return tmdb
      .showList(listname, page)
      .then(listResponse => res.send(listResponse))
      .catch(error => handleError(listname, error, res));
  }

  return handleError(
    listname,
    {
      status: 400,
      message: `'${type}' is not a valid list type.`
    },
    res
  );
}

export const nowPlayingMovies = (req, res) =>
  fetchTmdbList(req, res, "miscNowPlayingMovies", "movie");
export const popularMovies = (req, res) =>
  fetchTmdbList(req, res, "miscPopularMovies", "movie");
export const topRatedMovies = (req, res) =>
  fetchTmdbList(req, res, "miscTopRatedMovies", "movie");
export const upcomingMovies = (req, res) =>
  fetchTmdbList(req, res, "miscUpcomingMovies", "movie");
export const nowPlayingShows = (req, res) =>
  fetchTmdbList(req, res, "tvOnTheAir", "show");
export const popularShows = (req, res) =>
  fetchTmdbList(req, res, "miscPopularTvs", "show");
export const topRatedShows = (req, res) =>
  fetchTmdbList(req, res, "miscTopRatedTvs", "show");
