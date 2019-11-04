const configuration = require('src/config/configuration').getInstance();
const Plex = require('src/plex/plex');
const plex = new Plex(configuration.get('plex', 'ip'));

/**
 * Controller: Search plex for movies, shows and episodes by query
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function searchPlexController(req, res) {
   const { query, type } = req.query;
   plex.search(query, type)
      .then(movies => {
         if (movies.length > 0) {
            res.send(movies);
         } else {
            res.status(404).send({ success: false, message: 'Search query did not give any results from plex.'})
         }
      }).catch(error => {
         res.status(500).send({ success: false, message: error.message });
      });
}

module.exports = searchPlexController;
