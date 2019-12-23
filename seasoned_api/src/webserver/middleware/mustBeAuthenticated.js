const mustBeAuthenticated = (req, res, next) => {
   if (req.loggedInUser === undefined) {
      return res.status(401).send({
         success: false,
         message: 'You must be logged in.',
      });
   }
   return next();
};

module.exports = mustBeAuthenticated;
