const configuration = require('src/config/configuration').getInstance();
const TMDB = require('src/tmdb/tmdb');
const tmdb = new TMDB(configuration.get('tmdb', 'apiKey'));

/**
 * Controller: Retrieve information for a person 
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */

function personInfoController(req, res) {
  const personId = req.params.id;


  tmdb.personInfo(personId)
  .then(person => res.send(person.createJsonResponse()))
  .catch(error => {
    res.status(404).send({ success: false, message: error.message });
  });
}

module.exports = personInfoController;
