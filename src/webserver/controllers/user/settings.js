const UserRepository = require("../../../user/userRepository");

const userRepository = new UserRepository();
/**
 * Controller: Retrieves settings of a logged in user
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
const getSettingsController = (req, res) => {
  const username = req.loggedInUser ? req.loggedInUser.username : null;

  userRepository
    .getSettings(username)
    .then(settings => {
      res.send({ success: true, settings });
    })
    .catch(error => {
      res.status(404).send({ success: false, message: error.message });
    });
};

const updateSettingsController = (req, res) => {
  const username = req.loggedInUser ? req.loggedInUser.username : null;

  const idempotencyKey = req.headers("Idempotency-Key"); // TODO implement better transactions
  const { dark_mode, emoji } = req.body;

  userRepository
    .updateSettings(username, dark_mode, emoji)
    .then(settings => {
      res.send({ success: true, settings });
    })
    .catch(error => {
      res.status(404).send({ success: false, message: error.message });
    });
};

module.exports = {
  getSettingsController,
  updateSettingsController
};
