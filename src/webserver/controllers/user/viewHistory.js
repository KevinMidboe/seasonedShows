import Tautulli from "../../../tautulli/tautulli.js";
import Configuration from "../../../config/configuration.js";

const configuration = Configuration.getInstance();
const apiKey = configuration.get("tautulli", "apiKey");
const ip = configuration.get("tautulli", "ip");
const port = configuration.get("tautulli", "port");
const tautulli = new Tautulli(apiKey, ip, port);

function handleError(error, res) {
  const { status, message } = error;

  if (status && message) {
    return res.status(status).send({ success: false, message });
  }

  return res.status(500).send({
    message: "An unexpected error occured while fetching view history"
  });
}

function watchTimeStatsController(req, res) {
  const user = req.loggedInUser;

  return tautulli
    .watchTimeStats(user.plexUserId)
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
  const days = req.query?.days;
  const yAxis = req.query?.y_axis;

  return tautulli
    .getPlaysByDayOfWeek(user.plexUserId, days, yAxis)
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
  const days = req.query?.days;
  const yAxis = req.query?.y_axis;

  if (days === undefined) {
    return res.status(422).send({
      success: false,
      message: "Missing parameter: days (number)"
    });
  }

  const allowedYAxisDataType = ["plays", "duration"];
  if (!allowedYAxisDataType.includes(yAxis)) {
    return res.status(422).send({
      success: false,
      message: `Y axis parameter must be one of values: [${allowedYAxisDataType}]`
    });
  }

  return tautulli
    .getPlaysByDays(user.plexUserId, days, yAxis)
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
    .viewHistory(user.plexUserId)
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

export default {
  watchTimeStatsController,
  getPlaysByDayOfWeekController,
  getPlaysByDaysController,
  userViewHistoryController
};
