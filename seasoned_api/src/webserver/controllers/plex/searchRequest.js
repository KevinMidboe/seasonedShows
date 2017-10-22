const SearchHistory = require('src/searchHistory/searchHistory');
const Cache = require('src/tmdb/cache');
const RequestRepository = require('src/plex/requestRepository.js');
const cache = new Cache();
const requestRepository = new RequestRepository(cache);
const searchHistory = new SearchHistory();


function searchRequestController(req, res) {
	const user = req.headers.loggedinuser;
	const { query, page, type } = req.query;
	console.log('searchReq: ' + query, page, type);

	Promise.resolve()
	.then(() => {
		if (user !== 'false') {
			searchHistory.create(user, query);
		}
	})
	.then(() => requestRepository.searchRequest(query, page, type))
	.then((searchResult) => {
		if (searchResult.results.length > 0) {
			res.send(searchResult);
		}
		else {
			res.status(404).send({success: false, error: 'Search query did not return any results.'})
		}
	})
	.catch((error) => {
		res.status(500).send({success: false, error: error.message });
	})
}

module.exports = searchRequestController;