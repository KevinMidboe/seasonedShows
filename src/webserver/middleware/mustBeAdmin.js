const establishedDatabase = require("../../database/database");

// eslint-disable-next-line consistent-return
const mustBeAdmin = (req, res, next) => {
  const database = establishedDatabase;

  if (!req.loggedInUser) {
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
      if (isAdmin.admin === 0) {
        return res.status(401).send({
          success: false,
          message: "You must be logged in as a admin."
        });
      }

      return next();
    });
};

module.exports = mustBeAdmin;
