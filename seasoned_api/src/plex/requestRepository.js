const assert = require('assert');
const PlexRepository = require('src/plex/plexRepository');
const plexRepository = new PlexRepository();
const configuration = require('src/config/configuration').getInstance();
const Cache = require('src/tmdb/cache');
const TMDB = require('src/tmdb/tmdb');
const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));
var Promise = require('bluebird');
var rp = require('request-promise');

const establishedDatabase = require('src/database/database');

const MailTemplate = require('src/plex/mailTemplate')

var pythonShell = require('python-shell');
const nodemailer = require('nodemailer');


class RequestRepository {

	constructor(cache, database) {
		this.database = database || establishedDatabase;
		this.queries = {
			'insertRequest': "INSERT INTO requests VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_DATE, 'requested', ?, ?)",
			'fetchRequstedItems': "SELECT * FROM requests",
			'updateRequestedById': "UPDATE requests SET status = ? WHERE id is ? AND type is ?",
			'checkIfIdRequested': "SELECT * FROM requests WHERE id IS ? AND type IS ?",
		}
	}

	searchRequest(text, page, type) {
		// STRIP METADATA THAT IS NOT ALLOWED

		// Do a search in the tmdb api and return the results of the object
		let getTmdbResults = function() {
			return tmdb.search(text, page, type)
				.then((tmdbSearch) => {
					return tmdbSearch.results;
				})
		}

		// Take inputs and verify them with a list. Now we are for every item in tmdb result
		// runnning through the entire plex loop. Many loops, but safe. 
		let checkIfMatchesPlexObjects = function(title, year, plexarray) {
			// Iterate all elements in plexarray
			console.log(plexArray)
			for (let plexItem of plexarray) {
				// If matches with our title and year return true
				if (plexItem.title === title && plexItem.year === year)
					return true;
			}
			// If no matches were found, return false
			return false;
		}

		return Promise.resolve()
		.then(() => plexRepository.searchMedia(text))
		// Get the list of plexItems matching the query passed.
		.then((plexItem) => {
			let tmdbSearchResult = getTmdbResults();

			// When we get the result from tmdbSearchResult we pass it along and iterate over each 
			// element, and updates the matchedInPlex status of a item. 
			return tmdbSearchResult.then((tmdbResult) => {
				for (var i = 0; i < tmdbResult.length; i++) {
					let foundMatchInPlex = checkIfMatchesPlexObjects(tmdbResult[i].title, tmdbResult[i].year, plexItem);
					tmdbResult[i].matchedInPlex = foundMatchInPlex;
				}
				return { 'results': tmdbResult, 'page': 1 };
			})
			// TODO log error
			.catch((error) => {
				console.log(error);
				throw new Error('Search query did not give any results.');
			})
		})
		.catch(() => {
			let tmdbSearchResult = getTmdbResults();

			// Catch if empty, then 404
			return tmdbSearchResult.then((tmdbResult) => {
				return {'results': tmdbResult, 'page': 1 };
			})
		})
	}

	lookup(identifier, type = 'movie') {
//		console.log('Lookup: ', identifier + ' : ' + type)
//		if (type === 'movie') { type = 'movieInfo'}
//			else if (type === 'tv') { type = 'tvInfo'}
//		return Promise.resolve()
//		.then(() => tmdb.lookup(identifier, type))
//		.then((tmdbMovie) => {
//			return Promise.resolve(plexRepository.searchMedia(tmdbMovie.title))
//			.then((plexMovies) => {
//				for (var i = 0; i < plexMovies.length; i++) {
//					if (tmdbMovie.title === plexMovies[i].title && tmdbMovie.year === plexMovies[i].year) {
//						tmdbMovie.matchedInPlex = true;
//						return tmdbMovie;
//					}
//				}
//			})
//			.catch((error) => {
//				return error;
//			});
//			return tmdbMovie;
//		});
	let tmdbType = undefined;
	if (type === 'movie') { tmdbType = 'movieInfo'}
			else if (type === 'tv') { tmdbType = 'tvInfo'}
		return Promise.resolve()
		.then(() => tmdb.lookup(identifier, tmdbType))
		.then((tmdbMovie) => {
			return Promise.resolve(plexRepository.searchMedia(tmdbMovie.title))
			.then((plexMovies) => {
				console.log('plexMovies lookup: ', plexMovies)
				for (var i = 0; i < plexMovies.length; i++) {
					if (tmdbMovie.title === plexMovies[i].title && tmdbMovie.year === plexMovies[i].year) {
						console.log('matched')
						tmdbMovie.matchedInPlex = true;
						return tmdbMovie;
					}
				}
			})
			// Add it here
			.catch((error) => {
				console.log('there was a error:', error)
				return tmdbMovie;
			})
			return tmdbMovie;
		})
		.catch((error) => {
			console.log(error)
		})
		.then((item) => {
			return this.checkID(item.id, item.type)
			.then((result) => {
				item.requested = result;
				return item
			})
		})
	}

	checkID(id, type) {
		return this.database.get(this.queries.checkIfIdRequested, [id, type])
		.then((result, error) => {
			if (error)	return false

			if (result)
				return true
			else
				return false
		})
	
	}

	/**
	* Send request for given media id.
	* @param {identifier, type} the id of the media object and type of media must be defined
	* @returns {Promise} If nothing has gone wrong.
	*/ 
	sendRequest(identifier, type, ip, user_agent, user) {
		tmdb.lookup(identifier, type).then(movie => {

			if (user === 'false')
				user = 'NULL';
			console.log(user)
			// Add request to database
			this.database.run(this.queries.insertRequest, [movie.id, movie.title, movie.year, movie.poster_path, movie.background_path, user, ip, user_agent, movie.type])


			// create reusable transporter object using the default SMTP transport
			let transporter = nodemailer.createTransport({
				service: 'gmail',
			    auth: {
			        user: configuration.get('mail', 'user_pi'),
			        pass: configuration.get('mail', 'password_pi')
			    }
			    // host: configuration.get('mail', 'host'),
			    // port: 26,
			    // ignoreTLS: true,
			    // tls :{rejectUnauthorized: false},
			    // secure: false, // secure:true for port 465, secure:false for port 587
			});

			const mailTemplate = new MailTemplate(movie)

			// setup email data with unicode symbols
			let mailOptions = {
				// TODO get the mail adr from global location (easy to add)
			    from: 'MovieRequester <pi.midboe@gmail.com>', // sender address
			    to: 'kevin.midboe@gmail.com', // list of receivers
			    subject: 'Download request', // Subject line
			    text: mailTemplate.toText(),
			    html: mailTemplate.toHTML()
			};

			// send mail with defined transport object
			transporter.sendMail(mailOptions, (error, info) => {
			    if (error) {
			        return console.log(error);
			    }
			    console.log('Message %s sent: %s', info.messageId, info.response);
			});

		})

		// TODO add better response when done.
		return Promise.resolve();
		
	}

	fetchRequested() {
		return this.database.all(this.queries.fetchRequstedItems);
	}

	updateRequestedById(id, type, status) {
		return this.database.run(this.queries.updateRequestedById, [status, id, type]);
	}

}

module.exports = RequestRepository;
