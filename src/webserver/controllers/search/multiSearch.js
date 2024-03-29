import TMDB from "../../../tmdb/tmdb.js";
import SearchHistory from "../../../searchHistory/searchHistory.js";
import Configuration from "../../../config/configuration.js";

const configuration = Configuration.getInstance();
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));
const searchHistory = new SearchHistory();

/**
 * Controller: Search for multi (movies, shows and people by query and pagey
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function multiSearchController(req, res) {
  const { query, page, adult } = req.query;
  const username = req.loggedInUser ? req.loggedInUser.username : null;
  const includeAdult = adult === "true";

  if (username) {
    searchHistory.create(username, query);
  }

  return tmdb
    .multiSearch(query, page, includeAdult)
    .then(multiSearchResults => res.send(multiSearchResults))
    .catch(error => {
      return res.status(error?.statusCode || 500).send({
        success: false,
        message:
          error?.message ||
          `An unexpected error occured while searching with query: ${query}`
      });
    });
}

export default multiSearchController;
