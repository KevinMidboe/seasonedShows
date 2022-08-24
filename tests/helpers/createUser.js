import User from "../../src/user/user.js";
import UserSecurity from "../../src/user/userSecurity.js";

export default function createUser(username, password) {
  const userSecurity = new UserSecurity();
  const user = new User(username);

  return userSecurity.createNewUser(user, password);
}
