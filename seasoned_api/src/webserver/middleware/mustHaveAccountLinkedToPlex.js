const establishedDatabase = require('src/database/database');

const mustHaveAccountLinkedToPlex = (req, res, next) => {
   let database = establishedDatabase;
   const loggedInUser = req.loggedInUser;

   if (loggedInUser === undefined) {
      return res.status(401).send({
         success: false,
         message: 'You must be logged in.',
      });
   } else {
      database.get(`SELECT plex_userid FROM user WHERE user_name IS ?`, loggedInUser.username)
      .then(row => {
         const plex_userid = row.plex_userid;

         if (plex_userid === null || plex_userid === undefined) {
            return res.status(403).send({
               success: false,
               message: 'No plex account user id found for your user. Please authenticate your plex account at /user/authenticate.'
            })
         } else {
            req.loggedInUser.plex_userid = plex_userid;
            return next();
         }
      })
   }

};

module.exports = mustHaveAccountLinkedToPlex;
