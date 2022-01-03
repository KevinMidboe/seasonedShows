const SearchHistory = require("src/searchHistory/searchHistory");

const searchHistory = new SearchHistory();

/**
 * Controller: Retrieves search history of a logged in user
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function historyController(req, res) {
  const username = req.loggedInUser ? req.loggedInUser.username : null;

  searchHistory
    .read(username)
    .then(searchQueries => {
      res.send({ success: true, searchQueries });
    })
    .catch(error => {
      res.status(404).send({ success: false, message: error.message });
    });
}

module.exports = historyController;
