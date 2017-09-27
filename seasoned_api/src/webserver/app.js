
var express= require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser'); 
const tokenToUser = require('./middleware/tokenToUser');
const mustBeAuthenticated = require('./middleware/mustBeAuthenticated');

// this will let us get the data from a POST
// configure app to use bodyParser()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/* Decode the Authorization header if provided */
app.use(tokenToUser);

var port = 31459;        // set our port
var router = express.Router();
var allowedOrigins = ['https://kevinmidboe.com', 'http://localhost:8080']


router.use(function(req, res, next) {
	// TODO add logging of all incoming
    console.log('Request: ', req.originalUrl);
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
		res.setHeader('Access-Control-Allow-Origin', origin);
	}
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to this api!' });
});

/**
 * User
 */
app.post('/api/v1/user', require('./controllers/user/register.js'));
app.post('/api/v1/user/login', require('./controllers/user/login.js'));
app.get('/api/v1/user/history', mustBeAuthenticated, require('./controllers/user/history.js'));

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

router.get('/v1/plex/requests/all', mustBeAuthenticated, require('./controllers/plex/fetchRequested.js'));

/**
 * TMDB
 */
router.get('/v1/tmdb/search', require('./controllers/tmdb/searchMedia.js'));
router.get('/v1/tmdb/discover', require('./controllers/tmdb/discoverMedia.js'));
router.get('/v1/tmdb/popular', require('./controllers/tmdb/popularMedia.js'));
router.get('/v1/tmdb/nowplaying', require('./controllers/tmdb/nowPlayingMedia.js'));
router.get('/v1/tmdb/upcoming', require('./controllers/tmdb/getUpcoming.js'));

router.get('/v1/tmdb/similar/:mediaId', require('./controllers/tmdb/searchSimilar.js'));
router.get('/v1/tmdb/:mediaId', require('./controllers/tmdb/readMedia.js'));

/**
 * git
 */
router.post('/v1/git/dump', require('./controllers/git/dumpHook.js'));


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

module.exports = app;
