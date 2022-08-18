const User = require("../../../user/user");
const Token = require("../../../user/token");
const UserSecurity = require("../../../user/userSecurity");
const UserRepository = require("../../../user/userRepository");
const configuration = require("../../../config/configuration").getInstance();

const secret = configuration.get("authentication", "secret");
const userSecurity = new UserSecurity();
const userRepository = new UserRepository();

// TODO look to move some of the token generation out of the reach of the final "catch-all"
// catch including the, maybe sensitive, error message.

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: false,
  secure: isProduction,
  maxAge: 90 * 24 * 3600000, // 90 days
  sameSite: isProduction ? "Strict" : "Lax"
};

/**
 * Controller: Log in a user provided correct credentials.
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
async function loginController(req, res) {
  const user = new User(req.body.username);
  const password = req.body.password;

  try {
    const [loggedIn, isAdmin, settings] = await Promise.all([
      userSecurity.login(user, password),
      userRepository.checkAdmin(user),
      userRepository.getSettings(user.username)
    ]);

    if (!loggedIn) {
      return res.status(503).send({
        success: false,
        message: "Unexpected error! Unable to create user."
      });
    }

    const token = new Token(
      user,
      isAdmin === 1 ? true : false,
      settings
    ).toString(secret);

    return res.cookie("authorization", token, cookieOptions).status(200).send({
      success: true,
      message: "Welcome to request.movie!"
    });
  } catch (error) {
    return res.status(401).send({ success: false, message: error.message });
  }
}

module.exports = loginController;
