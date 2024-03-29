import SearchHistory from "../../../searchHistory/searchHistory.js";
import Cache from "../../../tmdb/cache.js";
import RequestRepository from "../../../plex/requestRepository.js";

const cache = new Cache();
const requestRepository = new RequestRepository(cache);
const searchHistory = new SearchHistory();

function searchRequestController(req, res) {
  const { query, page, type } = req.query;
  const username = req.loggedInUser ? req.loggedInUser.username : null;

  searchHistory
    .create(username, query)
    .then(() => requestRepository.search(query, page, type))
    .then(searchResult => {
      res.send(searchResult);
    })
    .catch(error => {
      res.status(500).send({ success: false, message: error.message });
    });
}

export default searchRequestController;
