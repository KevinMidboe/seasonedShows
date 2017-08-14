
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser'); 

// this will let us get the data from a POST
// configure app to use bodyParser()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


var port = 31459;        // set our port
var router = express.Router();
var allowedOrigins = ['https://kevinmidboe.com', 'http://localhost:8080']


router.use(function(req, res, next) {
    console.log('Something is happening.');
    var origin = req.headers.origin;
    if (allowedOrigins.indexOf(origin) > -1) {
		res.setHeader('Access-Control-Allow-Origin', origin);
	}
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to this api!' });
});


router.get('/v1/seasoned/all', require('./controllers/seasoned/readStrays.js'));
router.get('/v1/seasoned/:strayId', require('./controllers/seasoned/strayById.js'));
router.post('/v1/seasoned/verify/:strayId', require('./controllers/seasoned/verifyStray.js'));

router.get('/v1/plex/search', require('./controllers/plex/searchMedia.js'));
router.get('/v1/plex/playing', require('./controllers/plex/plexPlaying.js'));
router.get('/v1/plex/request', require('./controllers/plex/searchRequest.js'));
router.get('/v1/plex/request/:mediaId', require('./controllers/plex/readRequest.js'));
router.post('/v1/plex/request/:mediaId', require('./controllers/plex/submitRequest.js'));
router.get('/v1/plex/hook', require('./controllers/plex/hookDump.js'));

router.get('/v1/tmdb/search', require('./controllers/tmdb/searchMedia.js'));
router.get('/v1/tmdb/:mediaId', require('./controllers/tmdb/readMedia.js'));

router.post('/v1/git/dump', require('./controllers/git/dumpHook.js'));


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

module.exports = app;
