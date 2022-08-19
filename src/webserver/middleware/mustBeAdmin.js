const establishedDatabase = require("../../database/database");

const mustBeAdmin = (req, res, next) => {
  const database = establishedDatabase;

  if (req.loggedInUser === undefined) {
    return res.status(401).send({
      success: false,
      message: "You must be logged in."
    });
  }
  database
    .get(
      `SELECT admin FROM user WHERE user_name IS ?`,
      req.loggedInUser.username
    )
    .then(isAdmin => {
      console.log(isAdmin, req.loggedInUser);
      if (isAdmin.admin == 0) {
        return res.status(401).send({
          success: false,
          message: "You must be logged in as a admin."
        });
      }
    });

  return next();
};

module.exports = mustBeAdmin;
