const configuration = require("../../../config/configuration").getInstance();
const Tautulli = require("../../../tautulli/tautulli");

const apiKey = configuration.get("tautulli", "apiKey");
const ip = configuration.get("tautulli", "ip");
const port = configuration.get("tautulli", "port");
const tautulli = new Tautulli(apiKey, ip, port);

function handleError(error, res) {
  const { status, message } = error;

  if (status && message) {
    return res.status(status).send({ success: false, message });
  }
  console.log("caught view history controller error", error);
  return res.status(500).send({
    message: "An unexpected error occured while fetching view history"
  });
}

function watchTimeStatsController(req, res) {
  const user = req.loggedInUser;

  return tautulli
    .watchTimeStats(user.plex_userid)
    .then(data => {
      return res.send({
        success: true,
        data: data.response.data,
        message: "watch time successfully fetched from tautulli"
      });
    })
    .catch(error => handleError(error, res));
}

function getPlaysByDayOfWeekController(req, res) {
  const user = req.loggedInUser;
  const { days, y_axis } = req.query;

  return tautulli
    .getPlaysByDayOfWeek(user.plex_userid, days, y_axis)
    .then(data =>
      res.send({
        success: true,
        data: data.response.data,
        message: "play by day of week successfully fetched from tautulli"
      })
    )
    .catch(error => handleError(error, res));
}

function getPlaysByDaysController(req, res) {
  const user = req.loggedInUser;
  const { days, y_axis } = req.query;

  if (days === undefined) {
    return res.status(422).send({
      success: false,
      message: "Missing parameter: days (number)"
    });
  }

  const allowedYAxisDataType = ["plays", "duration"];
  if (!allowedYAxisDataType.includes(y_axis)) {
    return res.status(422).send({
      success: false,
      message: `Y axis parameter must be one of values: [${allowedYAxisDataType}]`
    });
  }

  return tautulli
    .getPlaysByDays(user.plex_userid, days, y_axis)
    .then(data =>
      res.send({
        success: true,
        data: data.response.data
      })
    )
    .catch(error => handleError(error, res));
}

function userViewHistoryController(req, res) {
  const user = req.loggedInUser;

  // TODO here we should check if we can init tau
  // and then return 501 Not implemented

  return tautulli
    .viewHistory(user.plex_userid)
    .then(data => {
      return res.send({
        success: true,
        data: data.response.data.data,
        message: "view history successfully fetched from tautulli"
      });
    })
    .catch(error => handleError(error, res));

  // const username = user.username;
}

module.exports = {
  watchTimeStatsController,
  getPlaysByDaysController,
  getPlaysByDayOfWeekController,
  userViewHistoryController
};
