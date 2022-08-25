const configuration = require("../../../config/configuration").getInstance();
const Tautulli = require("../../../tautulli/tautulli");

const apiKey = configuration.get("tautulli", "apiKey");
const ip = configuration.get("tautulli", "ip");
const port = configuration.get("tautulli", "port");
const tautulli = new Tautulli(apiKey, ip, port);

class MissingDaysParameterError extends Error {
  constructor() {
    const message = "Missing parameter: days (number)";
    super(message);

    this.statusCode = 422;
  }
}

class MissingYAxisParameterError extends Error {
  constructor(message = "Missing parameter: y_axis") {
    super(message);

    this.statusCode = 422;
  }
}

function requiredPlaysByDayParams(req) {
  const days = req.query?.days;
  const yAxis = req.query?.y_axis;
  let error;

  if (days === undefined) {
    error = new MissingDaysParameterError();
  }

  const allowedYAxisDataType = ["plays", "duration"];
  if (!allowedYAxisDataType.includes(yAxis)) {
    error = new MissingYAxisParameterError(
      `Y axis parameter must be one of values: [${allowedYAxisDataType}]`
    );
  }

  return error ? Promise.reject(error) : Promise.resolve();
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
    .catch(error => {
      res.status(error?.statusCode || 500).send({
        message:
          error?.message ||
          "An unexpected error occured while fetching watch time",
        errorResponse: error?.errorResponse,
        success: false
      });
    });
}

function getPlaysByDayOfWeekController(req, res) {
  const user = req.loggedInUser;
  const days = req.query?.days;
  const yAxis = req.query?.y_axis;

  return requiredPlaysByDayParams(req)
    .then(() => tautulli.getPlaysByDayOfWeek(user.plexUserId, days, yAxis))
    .then(data =>
      res.send({
        success: true,
        data: data.response.data,
        message: "play by day of week successfully fetched from tautulli"
      })
    )
    .catch(error => {
      res.status(error?.statusCode || 500).send({
        message:
          error?.message ||
          "An unexpected error occured while fetching plays by day of week",
        errorResponse: error?.errorResponse,
        success: false
      });
    });
}

function getPlaysByDaysController(req, res) {
  const user = req.loggedInUser;
  const days = req.query?.days;
  const yAxis = req.query?.y_axis;

  return requiredPlaysByDayParams(req, res)
    .then(() => tautulli.getPlaysByDays(user.plexUserId, days, yAxis))
    .then(data =>
      res.send({
        success: true,
        data: data.response.data
      })
    )
    .catch(error => {
      res.status(error?.statusCode || 500).send({
        message:
          error?.message ||
          "An unexpected error occured while fetching plays by days",
        errorResponse: error?.errorResponse,
        success: false
      });
    });
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
    .catch(error => {
      res.status(error?.statusCode || 500).send({
        message:
          error?.message ||
          "An unexpected error occured while fetching view history",
        errorResponse: error?.errorResponse,
        success: false
      });
    });

  // const username = user.username;
}

module.exports = {
  watchTimeStatsController,
  getPlaysByDaysController,
  getPlaysByDayOfWeekController,
  userViewHistoryController
};
