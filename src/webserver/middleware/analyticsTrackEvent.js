import Analytics from "../../analytics/index.js";
import establishedDatabase from "../../database/database.js";

const trackRequest = (req, _, next) => {
  const database = establishedDatabase;
  const analytics = new Analytics(database);

  const user = req.loggedInUser;

  analytics.trackEvent("Item requested", user?.username);

  next();
};

const trackLogin = (req, _, next) => {
  const database = establishedDatabase;
  const analytics = new Analytics(database);

  const user = req.loggedInUser;
  analytics.trackEvent("Login", user?.username);

  next();
};

const trackMagnet = (req, _, next) => {
  const database = establishedDatabase;
  const analytics = new Analytics(database);

  const user = req.loggedInUser;
  analytics.trackEvent("Magnet", user?.username);

  next();
};

export default { trackRequest, trackLogin, trackMagnet };
