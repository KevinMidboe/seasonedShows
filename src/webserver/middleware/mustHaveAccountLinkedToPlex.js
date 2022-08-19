const establishedDatabase = require("../../database/database");

const mustHaveAccountLinkedToPlex = (req, res, next) => {
  const database = establishedDatabase;
  const { loggedInUser } = req;

  if (loggedInUser === undefined) {
    return res.status(401).send({
      success: false,
      message: "You must have your account linked to a plex account."
    });
  }
  database
    .get(
      `SELECT plex_userid FROM settings WHERE user_name IS ?`,
      loggedInUser.username
    )
    .then(row => {
      const { plex_userid } = row;

      if (plex_userid === null || plex_userid === undefined) {
        return res.status(403).send({
          success: false,
          message:
            "No plex account user id found for your user. Please authenticate your plex account at /user/authenticate."
        });
      }
      req.loggedInUser.plex_userid = plex_userid;
      return next();
    });
};

module.exports = mustHaveAccountLinkedToPlex;
