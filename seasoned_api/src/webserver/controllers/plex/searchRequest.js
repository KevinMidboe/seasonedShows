const SearchHistory = require('src/searchHistory/searchHistory');
const Cache = require('src/tmdb/cache');
const RequestRepository = require('src/plex/requestRepository.js');

const cache = new Cache();
const requestRepository = new RequestRepository(cache);
const searchHistory = new SearchHistory();


function searchRequestController(req, res) {
   const user = req.loggedInUser;
   const { query, page, type } = req.query;
   const username = user === undefined ? undefined : user.username;

   Promise.resolve()
      .then(() => searchHistory.create(username, query))
      .then(() => requestRepository.search(query, page, type))
      .then((searchResult) => {
         res.send(searchResult);
      })
      .catch((error) => {
         res.status(500).send({ success: false, error: error });
      });
}

module.exports = searchRequestController;
