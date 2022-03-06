/**
 * Controller: Log out a user (destroy authorization token)
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
async function logoutController(req, res) {
  res.clearCookie("authorization");

  return res.status(200).send({
    success: true,
    message: "Logged out, see you later!"
  });
}

module.exports = logoutController;
