import Tautulli from "../../../tautulli/tautulli.js";
import Configuration from "../../../config/configuration.js";
import { MissingDaysParameterError } from "./errors.js";

const configuration = Configuration.getInstance();
const tautulliApiKey = configuration.get("tautulli", "apiKey");
const tautulliHost = configuration.get("tautulli", "host");
const tautulli = new Tautulli(tautulliApiKey, tautulliHost);

async function watchTimeStatsController(req, res) {
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

async function returnError(res, error) {
  console.log("error from controller:", error);
  return res.status(error?.statusCode || 500).send({
    message:
      error?.message ||
      "An unexpected error occured while fetching plays by day of week",
    errorResponse: error?.errorResponse,
    success: false
  });
}

async function getUserStatsOfType(req, res) {
  try {
    const { resource } = req.params;
    if (!tautulli.typeExists(resource))
      throw new Error("Missing or unkown user statistic type");

    const user = req.loggedInUser;
    const { days } = req.query;

    if (!days) throw new MissingDaysParameterError();

    return tautulli
      .getUserStatsOfResource(resource, req.plexUserId, days, req.query.y_axis)
      .then(data => {
        res.send({
          success: true,
          data
        });
      })
      .catch(error => returnError(res, error));
  } catch (error) {
    return returnError(res, error);
  }
}

async function userViewHistoryController(req, res) {
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

export default {
  watchTimeStatsController,
  userViewHistoryController,
  getUserStatsOfType
};
