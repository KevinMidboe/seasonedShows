// eslint-disable-next-line consistent-return
const mustBeAuthenticated = (req, res, next) => {
  if (!req.loggedInUser) {
    return res.status(401).send({
      success: false,
      message: "You must be logged in."
    });
  }

  next();
};

export default mustBeAuthenticated;
