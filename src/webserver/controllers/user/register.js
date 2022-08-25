import User from "../../../user/user.js";
import Token from "../../../user/token.js";
import UserSecurity from "../../../user/userSecurity.js";
import Configuration from "../../../config/configuration.js";

const configuration = Configuration.getInstance();
const secret = configuration.get("authentication", "secret");
const userSecurity = new UserSecurity();

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: false,
  secure: isProduction,
  maxAge: 90 * 24 * 3600000, // 90 days
  sameSite: isProduction ? "Strict" : "Lax"
};

/**
 * Controller: Register a new user
 * @param {Request} req http request variable
 * @param {Response} res
 * @returns {Callback}
 */
function registerController(req, res) {
  const user = new User(req.body.username, req.body.email);
  const { password } = req.body;

  userSecurity
    .createNewUser(user, password)
    .then(() => {
      const token = new Token(user, false).toString(secret);

      return res
        .cookie("authorization", token, cookieOptions)
        .status(200)
        .send({
          success: true,
          message: "Welcome to Seasoned!"
        });
    })
    .catch(error => {
      res.status(401).send({ success: false, message: error.message });
    });
}

export default registerController;
