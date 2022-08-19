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
      const plexUserId = row?.plex_userid;

      if (plexUserId === null || plexUserId === undefined) {
        return res.status(403).send({
          success: false,
          message:
            "No plex account user id found for your user. Please authenticate your plex account at /user/authenticate."
        });
      }
      req.loggedInUser.plexUserId = plexUserId;
      return next();
    });
};

module.exports = mustHaveAccountLinkedToPlex;
