import TMDB from "../../../tmdb/tmdb";
import Configuration from "../../../config/configuration";

const configuration = Configuration.getInstance();
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));

/**
 * Controller: Retrieve information for a person
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */

async function personInfoController(req, res) {
  const personId = req.params.id;
  let { credits } = req.query;

  credits = credits?.toLowerCase() === "true";

  const tmdbQueue = [tmdb.personInfo(personId)];
  if (credits) tmdbQueue.push(tmdb.personCredits(personId));

  try {
    const [Person, Credits] = await Promise.all(tmdbQueue);

    const person = Person.createJsonResponse();
    if (credits) person.credits = Credits.createJsonResponse();

    return res.send(person);
  } catch (error) {
    return res.status(error?.statusCode || 500).send({
      success: false,
      message:
        error?.message ||
        `An unexpected error occured while requesting info for person with id: ${personId}`
    });
  }
}

export default personInfoController;
