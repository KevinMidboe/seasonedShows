
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser'); 


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = 31459;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
	res.setHeader('Access-Control-Allow-Origin', 'https://kevinmidboe.com');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});


router.get('/v1/seasoned/all', require('./controllers/seasoned/readStrays.js'));
router.get('/v1/seasoned/:strayId', require('./controllers/seasoned/strayById.js'));
router.post('/v1/seasoned/verify/:strayId', require('./controllers/seasoned/verifyStray.js'));

// router.get('/v1/plex/search', require('./controllers/plex/searchMedia.js'));
// router.post('/v1/plex/request/:mediaId', require('./controllers/plex/request.js'));


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

module.exports = app;
