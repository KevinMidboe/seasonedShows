const express = require('express');
const Raven = require('raven');
const bodyParser = require('body-parser');
const tokenToUser = require('./middleware/tokenToUser');
const mustBeAuthenticated = require('./middleware/mustBeAuthenticated');
const mustBeAdmin = require('./middleware/mustBeAdmin');
const configuration = require('src/config/configuration').getInstance();

// TODO: Have our raven router check if there is a value, if not don't enable raven.
Raven.config(configuration.get('raven', 'DSN')).install();

const app = express(); // define our app using express
app.use(Raven.requestHandler());
// this will let us get the data from a POST
// configure app to use bodyParser()
app.use(bodyParser.json());
// router.use(bodyParser.urlencoded({ extended: true }));


/* Decode the Authorization header if provided */
// router.use(tokenToUser);

const router = express.Router();
const allowedOrigins = ['https://kevinmidboe.com', 'http://localhost:8080'];

// TODO: All JSON handling in a single router
// router.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// This is probably a correct middleware/router setup
/* Translate the user token to a user name */
router.use(tokenToUser);

// TODO: Should have a separate middleware/router for handling headers.
router.use((req, res, next) => {
   // TODO add logging of all incoming
   console.log('Request: ', req.originalUrl);
   const origin = req.headers.origin;
   if (allowedOrigins.indexOf(origin) > -1) {
      console.log('allowed');
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
router.get('/v1/user/history', mustBeAuthenticated, require('./controllers/user/history.js'));
router.get('/v1/user/requests', mustBeAuthenticated, require('./controllers/user/requests.js'));

/**
 * Seasoned
 */
router.get('/v1/seasoned/all', require('./controllers/seasoned/readStrays.js'));
router.get('/v1/seasoned/:strayId', require('./controllers/seasoned/strayById.js'));
router.post('/v1/seasoned/verify/:strayId', require('./controllers/seasoned/verifyStray.js'));

/**
 * Plex
 */
router.get('/v1/plex/search', require('./controllers/plex/searchMedia.js'));
router.get('/v1/plex/playing', require('./controllers/plex/plexPlaying.js'));
router.get('/v1/plex/request', require('./controllers/plex/searchRequest.js'));
router.get('/v1/plex/request/:mediaId', require('./controllers/plex/readRequest.js'));
router.post('/v1/plex/request/:mediaId', require('./controllers/plex/submitRequest.js'));
router.get('/v1/plex/hook', require('./controllers/plex/hookDump.js'));

/**
 * Requests
 */
router.get('/v1/plex/requests/all', require('./controllers/plex/fetchRequested.js'));
router.put('/v1/plex/request/:requestId', mustBeAuthenticated, require('./controllers/plex/updateRequested.js'));

/**
 * Pirate
 */
router.get('/v1/pirate/search', mustBeAuthenticated, require('./controllers/pirate/searchTheBay.js'));
router.post('/v1/pirate/add', mustBeAuthenticated, require('./controllers/pirate/addMagnet.js'));

/**
 * TMDB
 */
router.get('/v1/tmdb/search', require('./controllers/tmdb/searchMedia.js'));
router.get('/v1/tmdb/list/:listname', require('./controllers/tmdb/listSearch.js'));
router.get('/v1/tmdb/:mediaId', require('./controllers/tmdb/readMedia.js'));

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
