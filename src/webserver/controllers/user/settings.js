import UserRepository from "../../../user/userRepository";

const userRepository = new UserRepository();
/**
 * Controller: Retrieves settings of a logged in user
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
export function getSettingsController(req, res) {
  const username = req.loggedInUser ? req.loggedInUser.username : null;

  userRepository
    .getSettings(username)
    .then(settings => {
      res.send({ success: true, settings });
    })
    .catch(error => {
      res.status(404).send({ success: false, message: error.message });
    });
}

export function updateSettingsController(req, res) {
  const username = req.loggedInUser ? req.loggedInUser.username : null;

  // const idempotencyKey = req.headers("Idempotency-Key"); // TODO implement better transactions
  const emoji = req.body?.emoji;
  const darkMode = req.body?.dark_mode;

  userRepository
    .updateSettings(username, darkMode, emoji)
    .then(settings => {
      res.send({ success: true, settings });
    })
    .catch(error => {
      res.status(404).send({ success: false, message: error.message });
    });
}
