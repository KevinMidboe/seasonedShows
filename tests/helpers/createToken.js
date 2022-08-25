import User from "../../src/user/user.js";
import Token from "../../src/user/token.js";

export default function createToken(username, secret) {
  const user = new User(username);
  const token = new Token(user);
  return token.toString(secret);
}
