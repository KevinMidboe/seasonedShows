const configuration = require("../../../config/configuration").getInstance();
const TMDB = require("../../../tmdb/tmdb");
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));

function handleError(error, res) {
  const { status, message } = error;

  if (status && message) {
    res.status(status).send({ success: false, message });
  } else {
    console.log("caught personinfo controller error", error);
    res.status(500).send({
      message: "An unexpected error occured while requesting person info."
    });
  }
}

/**
 * Controller: Retrieve information for a person
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */

async function personInfoController(req, res) {
  const personId = req.params.id;
  let { credits } = req.query;
  arguments;

  credits && credits.toLowerCase() === "true"
    ? (credits = true)
    : (credits = false);

  let tmdbQueue = [tmdb.personInfo(personId)];
  if (credits) tmdbQueue.push(tmdb.personCredits(personId));

  try {
    const [Person, Credits] = await Promise.all(tmdbQueue);

    const person = Person.createJsonResponse();
    if (credits) person.credits = Credits.createJsonResponse();

    return res.send(person);
  } catch (error) {
    handleError(error, res);
  }
}

module.exports = personInfoController;
