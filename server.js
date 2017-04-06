// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose(); 


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 3147;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.get('/seasoned', function(req, res) {
	var db_path = 'shows.db';
	var db = new sqlite3.Database(db_path);
	var returnMsg;
	var id = req.param('id');

	function getEpisode(id, fn){
		db.serialize(function() {
			db.get("SELECT * FROM stray_eps WHERE id = '" + id + "'", function(err, row) {
				fn(row)
		})
	  });
	}

	getEpisode(id, function(episode){
	  res.json({episode}); // this is where you get the return value
	});
});
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
