import express from "express";
import Raven from "raven";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import Configuration from "../config/configuration.js";
const configuration = Configuration.getInstance();

import reqTokenToUser from "./middleware/reqTokenToUser.js";
import mustBeAuthenticated from "./middleware/mustBeAuthenticated.js";
import mustBeAdmin from "./middleware/mustBeAdmin.js";
import mustHaveAccountLinkedToPlex from "./middleware/mustHaveAccountLinkedToPlex.js";

import tautulli from "./controllers/user/viewHistory.js";
import {
  getSettingsController,
  updateSettingsController
} from "./controllers/user/settings.js";
import AuthenticatePlexAccountController from "./controllers/user/authenticatePlexAccount.js";

import UserRegisterController from "./controllers/user/register.js";
import UserLoginController from "./controllers/user/login.js";
import UserLogoutController from "./controllers/user/logout.js";
import UserSearchHistoryController from "./controllers/user/searchHistory.js";
import UserRequestsController from "./controllers/user/requests.js";

import SearchMultiController from "./controllers/search/multiSearch.js";
import SearchMovieController from "./controllers/search/movieSearch.js";
import SearchShowController from "./controllers/search/showSearch.js";
import SearchPersonController from "./controllers/search/personSearch.js";

import listController from "./controllers/list/listController.js";

import MovieCreditsController from "./controllers/movie/credits.js";
import MovieReleaseDatesController from "./controllers/movie/releaseDates.js";
import MovieInfoController from "./controllers/movie/info.js";

import ShowCreditsController from "./controllers/show/credits.js";
import ShowInfoController from "./controllers/show/info.js";

import PersonCreditsController from "./controllers/person/credits.js";
import PersonInfoController from "./controllers/person/info.js";

import SeasonedAllController from "./controllers/seasoned/readStrays.js";
import SeasonedInfoController from "./controllers/seasoned/strayById.js";
import SeasonedVerifyController from "./controllers/seasoned/verifyStray.js";

import PlexSearchController from "./controllers/plex/search.js";
import PlexFetchRequestedController from "./controllers/plex/fetchRequested.js";
import PlexRequestsInfo from "./controllers/plex/updateRequested.js";
import PlexWatchLinkController from "./controllers/plex/watchDirectLink.js";
import PlexHookController from "./controllers/plex/hookDump.js";
import PlexSubmitRequestController from "./controllers/plex/submitRequest.js";
import PlexRequestInfo from "./controllers/plex/readRequest.js";
import PlexSearchRequestController from "./controllers/plex/searchRequest.js";
import PlexPlayingController from "./controllers/plex/plexPlaying.js";
import PlexSearchMediaController from "./controllers/plex/searchMedia.js";
import PlexUpdateRequestedController from "./controllers/plex/updateRequested.js";

import RequestFetchAllController from "./controllers/request/fetchAllRequests.js";
import RequestInfoController from "./controllers/request/getRequest.js";
import RequestSubmitController from "./controllers/request/requestTmdbId.js";

import PirateSearchController from "./controllers/pirate/searchTheBay.js";
import PirateAddController from "./controllers/pirate/addMagnet.js";

import GitDumpController from "./controllers/git/dumpHook.js";
import EmojiController from "./controllers/misc/emoji.js";

// TODO: Have our raven router check if there is a value, if not don't enable raven.
Raven.config(configuration.get("raven", "DSN")).install();

const app = express(); // define our app using express
app.use(Raven.requestHandler());
app.use(bodyParser.json());
app.use(cookieParser());

const router = express.Router();
// const allowedOrigins = configuration.get("webserver", "origins");

// TODO: All JSON handling in a single router
// router.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Check header and cookie for authentication and set req.loggedInUser */
router.use(reqTokenToUser);

// TODO: Should have a separate middleware/router for handling headers.
router.use((req, res, next) => {
  // TODO add logging of all incoming
  // const origin = req.headers.origin;
  // if (allowedOrigins.indexOf(origin) > -1) {
  //   res.setHeader("Access-Control-Allow-Origin", origin);
  // }

  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, loggedinuser, set-cookie"
  );

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, OPTIONS");

  next();
});

router.get("/", (req, res) => {
  res.send("welcome to seasoned api");
});

// app.use(Raven.errorHandler());
// app.use((err, req, res) => {
//   res.statusCode = 500;
//   res.end(`${res.sentry}\n`);
// });

/**
 * User
 */
router.post("/v1/user", UserRegisterController);
router.post("/v1/user/login", UserLoginController);
router.post("/v1/user/logout", UserLogoutController);

router.get("/v1/user/settings", mustBeAuthenticated, getSettingsController);
router.put("/v1/user/settings", mustBeAuthenticated, updateSettingsController);
router.get(
  "/v1/user/search_history",
  mustBeAuthenticated,
  UserSearchHistoryController
);
router.get("/v1/user/requests", mustBeAuthenticated, UserRequestsController);

router.post(
  "/v1/user/link_plex",
  mustBeAuthenticated,
  AuthenticatePlexAccountController.link
);
router.post(
  "/v1/user/unlink_plex",
  mustBeAuthenticated,
  AuthenticatePlexAccountController.unlink
);

router.get(
  "/v1/user/view_history",
  mustHaveAccountLinkedToPlex,
  tautulli.userViewHistoryController
);
router.get(
  "/v1/user/watch_time",
  mustHaveAccountLinkedToPlex,
  tautulli.watchTimeStatsController
);
router.get(
  "/v1/user/plays_by_day",
  mustHaveAccountLinkedToPlex,
  tautulli.getPlaysByDaysController
);
router.get(
  "/v1/user/plays_by_dayofweek",
  mustHaveAccountLinkedToPlex,
  tautulli.getPlaysByDayOfWeekController
);

/**
 * Seasoned
 */
router.get("/v1/seasoned/all", SeasonedAllController);
router.get("/v1/seasoned/:strayId", SeasonedInfoController);
router.post("/v1/seasoned/verify/:strayId", SeasonedVerifyController);

router.get("/v2/search/", SearchMultiController);
router.get("/v2/search/movie", SearchMovieController);
router.get("/v2/search/show", SearchShowController);
router.get("/v2/search/person", SearchPersonController);

router.get("/v2/movie/now_playing", listController.nowPlayingMovies);
router.get("/v2/movie/popular", listController.popularMovies);
router.get("/v2/movie/top_rated", listController.topRatedMovies);
router.get("/v2/movie/upcoming", listController.upcomingMovies);
router.get("/v2/movie/:id/credits", MovieCreditsController);
router.get("/v2/movie/:id/release_dates", MovieReleaseDatesController);
router.get("/v2/movie/:id", MovieInfoController);
router.get("/v2/show/now_playing", listController.nowPlayingShows);
router.get("/v2/show/popular", listController.popularShows);
router.get("/v2/show/top_rated", listController.topRatedShows);
router.get("/v2/show/:id/credits", ShowCreditsController);
router.get("/v2/show/:id", ShowInfoController);

router.get("/v2/person/:id/credits", PersonCreditsController);
router.get("/v2/person/:id", PersonInfoController);

/**
 * Plex
 */
router.get("/v2/plex/search", PlexSearchController);

/**
 * List
 */
router.get("/v1/plex/search", PlexSearchMediaController);
router.get("/v1/plex/playing", PlexPlayingController);
router.get("/v1/plex/request", PlexSearchRequestController);
router.get("/v1/plex/request/:mediaId", PlexRequestInfo);
router.post("/v1/plex/request/:mediaId", PlexSubmitRequestController);
router.post("/v1/plex/hook", PlexHookController);

router.get("/v1/plex/watch-link", mustBeAuthenticated, PlexWatchLinkController);

/**
 * Requests
 */

router.get("/v2/request", RequestFetchAllController);
router.get("/v2/request/:id", RequestInfoController);
router.post("/v2/request", RequestSubmitController);
router.get("/v1/plex/requests/all", PlexFetchRequestedController);
router.put(
  "/v1/plex/request/:requestId",
  mustBeAuthenticated,
  PlexUpdateRequestedController
);

/**
 * Pirate
 */
router.get("/v1/pirate/search", mustBeAdmin, PirateSearchController);
router.post("/v1/pirate/add", mustBeAdmin, PirateAddController);

/**
 * git
 */
router.post("/v1/git/dump", GitDumpController);

/**
 * misc
 */
router.get("/v1/emoji", EmojiController);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use("/api", router);

export default app;
