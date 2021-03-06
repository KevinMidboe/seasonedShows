const express = require('express');
const Raven = require('raven');
const bodyParser = require('body-parser');
const tokenToUser = require('./middleware/tokenToUser');
const mustBeAuthenticated = require('./middleware/mustBeAuthenticated');
const mustBeAdmin = require('./middleware/mustBeAdmin');
const mustHaveAccountLinkedToPlex = require('./middleware/mustHaveAccountLinkedToPlex');
const configuration = require('src/config/configuration').getInstance();

const listController = require('./controllers/list/listController');
const tautulli = require('./controllers/user/viewHistory.js');
const SettingsController = require('./controllers/user/settings');
const AuthenticatePlexAccountController = require('./controllers/user/authenticatePlexAccount');

// TODO: Have our raven router check if there is a value, if not don't enable raven.
Raven.config(configuration.get('raven', 'DSN')).install();

const app = express(); // define our app using express
app.use(Raven.requestHandler());
app.use(bodyParser.json());

const router = express.Router();
const allowedOrigins = configuration.get('webserver', 'origins');

// TODO: All JSON handling in a single router
// router.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Decode the Authorization header if provided */
router.use(tokenToUser);

// TODO: Should have a separate middleware/router for handling headers.
router.use((req, res, next) => {
   // TODO add logging of all incoming
  const origin = req.headers.origin;
   if (allowedOrigins.indexOf(origin) > -1) {
       res.setHeader('Access-Control-Allow-Origin', origin);
   }
   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, loggedinuser');
   res.header('Access-Control-Allow-Methods', 'POST, GET, PUT');

   next();
});

router.get('/', function mainHandler(req, res) {
   throw new Error('Broke!');
});

app.use(Raven.errorHandler());
app.use(function onError(err, req, res, next) {
   res.statusCode = 500;
   res.end(res.sentry + '\n');
});

/**
 * User
 */
router.post('/v1/user', require('./controllers/user/register.js'));
router.post('/v1/user/login', require('./controllers/user/login.js'));
router.get('/v1/user/settings', mustBeAuthenticated, SettingsController.getSettingsController);
router.put('/v1/user/settings', mustBeAuthenticated, SettingsController.updateSettingsController);
router.get('/v1/user/search_history', mustBeAuthenticated, require('./controllers/user/searchHistory.js'));
router.get('/v1/user/requests', mustBeAuthenticated, require('./controllers/user/requests.js'));
router.post('/v1/user/link_plex', mustBeAuthenticated, AuthenticatePlexAccountController.link);
router.post('/v1/user/unlink_plex', mustBeAuthenticated, AuthenticatePlexAccountController.unlink);

router.get('/v1/user/view_history', mustHaveAccountLinkedToPlex, tautulli.userViewHistoryController);
router.get('/v1/user/watch_time', mustHaveAccountLinkedToPlex, tautulli.watchTimeStatsController);
router.get('/v1/user/plays_by_day', mustHaveAccountLinkedToPlex, tautulli.getPlaysByDaysController);
router.get('/v1/user/plays_by_dayofweek', mustHaveAccountLinkedToPlex, tautulli.getPlaysByDayOfWeekController);

/**
 * Seasoned
 */
router.get('/v1/seasoned/all', require('./controllers/seasoned/readStrays.js'));
router.get('/v1/seasoned/:strayId', require('./controllers/seasoned/strayById.js'));
router.post('/v1/seasoned/verify/:strayId', require('./controllers/seasoned/verifyStray.js'));

router.get('/v2/search/', require('./controllers/search/multiSearch.js'));
router.get('/v2/search/movie', require('./controllers/search/movieSearch.js'));
router.get('/v2/search/show', require('./controllers/search/showSearch.js'));
router.get('/v2/search/person', require('./controllers/search/personSearch.js'));

router.get('/v2/movie/now_playing', listController.nowPlayingMovies);
router.get('/v2/movie/popular', listController.popularMovies);
router.get('/v2/movie/top_rated', listController.topRatedMovies);
router.get('/v2/movie/upcoming', listController.upcomingMovies);

router.get('/v2/show/now_playing', listController.nowPlayingShows);
router.get('/v2/show/popular', listController.popularShows);
router.get('/v2/show/top_rated', listController.topRatedShows);

router.get('/v2/movie/:id/credits', require('./controllers/movie/credits.js'));
router.get('/v2/movie/:id/release_dates', require('./controllers/movie/releaseDates.js'));
router.get('/v2/show/:id/credits', require('./controllers/show/credits.js'));

router.get('/v2/movie/:id', require('./controllers/movie/info.js'));
router.get('/v2/show/:id', require('./controllers/show/info.js'));
router.get('/v2/person/:id', require('./controllers/person/info.js'));

/**
 * Plex
 */
router.get('/v2/plex/search', require('./controllers/plex/search'));

/**
 * List
 */
router.get('/v1/plex/search', require('./controllers/plex/searchMedia.js'));
router.get('/v1/plex/playing', require('./controllers/plex/plexPlaying.js'));
router.get('/v1/plex/request', require('./controllers/plex/searchRequest.js'));
router.get('/v1/plex/request/:mediaId', require('./controllers/plex/readRequest.js'));
router.post('/v1/plex/request/:mediaId', require('./controllers/plex/submitRequest.js'));
router.post('/v1/plex/hook', require('./controllers/plex/hookDump.js'));

router.get('/v1/plex/watch-link', mustBeAuthenticated, require('./controllers/plex/watchDirectLink.js'));

/**
 * Requests
 */

router.get('/v2/request', require('./controllers/request/fetchAllRequests.js'));
router.get('/v2/request/:id', require('./controllers/request/getRequest.js'));
router.post('/v2/request', require('./controllers/request/requestTmdbId.js'));
router.get('/v1/plex/requests/all', require('./controllers/plex/fetchRequested.js'));
router.put('/v1/plex/request/:requestId', mustBeAuthenticated, require('./controllers/plex/updateRequested.js'));

/**
 * Pirate
 */
router.get('/v1/pirate/search', mustBeAuthenticated, require('./controllers/pirate/searchTheBay.js'));
router.post('/v1/pirate/add', mustBeAuthenticated, require('./controllers/pirate/addMagnet.js'));

/**
 * git
 */
router.post('/v1/git/dump', require('./controllers/git/dumpHook.js'));

/**
 * misc
 */
 router.get('/v1/emoji', require('./controllers/misc/emoji.js'));

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

module.exports = app;
