const configuration = require('src/config/configuration').getInstance();
const Plex = require('src/plex/plex');
const plex = new Plex(configuration.get('plex', 'ip'));

/**
 * Controller: Search plex for movies, shows and episodes by query
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */

function watchDirectLink (req, res) {
   const { title, year } = req.query;

  plex.getDirectLinkByTitleAndYear(title, year)
    .then(plexDirectLink => {
      if (plexDirectLink == false)
        res.status(404).send({ success: true, link: null })
      else
        res.status(200).send({ success: true, link: plexDirectLink })
    })
    .catch(error => {
       res.status(500).send({ success: false, message: error.message });
    });
}

module.exports = watchDirectLink;
