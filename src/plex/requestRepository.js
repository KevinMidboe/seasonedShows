const assert = require('assert');
const PlexRepository = require('src/plex/plexRepository');
const plexRepository = new PlexRepository();
const convertPlexToMovie = require('src/plex/convertPlexToMovie');
const configuration = require('src/config/configuration').getInstance();
const TMDB = require('src/tmdb/tmdb');
const tmdb = new TMDB(configuration.get('tmdb', 'apiKey'));
var Promise = require('bluebird');
var rp = require('request-promise');

const MailTemplate = require('src/plex/mailTemplate')

var pythonShell = require('python-shell');
const nodemailer = require('nodemailer');


class RequestRepository {

	searchRequest(query, page, type) {
		return Promise.resolve()
		.then(() => tmdb.search(query, page, type))
		.then((tmdbMovies) => {
			return Promise.resolve()
			.then(() => plexRepository.searchMedia(query))
			.then((plexMedia) => {
				return Promise.each(tmdbMovies, function(tmdbMovie) {
					return Promise.each(plexMedia, function(plexMovie) {
						if (tmdbMovie.title == plexMovie.title && tmdbMovie.year == plexMovie.year) {
							tmdbMovie.matchedInPlex = true;
							console.log(tmdbMovie.title + ' : ' + tmdbMovie.year);
						}
						return tmdbMovie;
					})
				})
			})
		})
		.catch((error) => {
			return error;
		});
	}

	lookup(identifier, type = 'movie') {
		if (type === 'movie') { type = 'movieInfo'}
			else if (type === 'tv') { type = 'tvInfo'}
		return Promise.resolve()
		.then(() => tmdb.lookup(identifier, type))
		.then((tmdbMovie) => {
			return Promise.resolve(plexRepository.searchMedia(tmdbMovie.title))
			.then((plexMovies) => {
				for (var i = 0; i < plexMovies.length; i++) {
					if (tmdbMovie.title === plexMovies[i].title && tmdbMovie.year === plexMovies[i].year) {
						tmdbMovie.matchedInPlex = true;
						return tmdbMovie;
					}
				}
			})
			.catch((error) => {
				return error;
			});
			return tmdbMovie;
		});
	}

	sendRequest(identifier) {
		// TODO try a cache hit on the movie item

		tmdb.lookup(identifier).then(movie => {
			console.log(movie.title)


			// create reusable transporter object using the default SMTP transport
			let transporter = nodemailer.createTransport({
			    host: configuration.get('mail', 'host'),
			    port: 26,
			    ignoreTLS: true,
			    tls :{rejectUnauthorized: false},
			    secure: false, // secure:true for port 465, secure:false for port 587
			    auth: {
			        user: configuration.get('mail', 'user'),
			        pass: configuration.get('mail', 'password')
			    }
			});

			const mailTemplate = new MailTemplate(movie)

			// setup email data with unicode symbols
			let mailOptions = {
				// TODO get the mail adr from global location (easy to add)
			    from: 'MovieRequester <support@kevinmidboe.com>', // sender address
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

			// var options = {
			// args: [movie.title, movie.year, movie.poster]
			// }

			// pythonShell.run('sendRequest.py', options, function (err, results) {
			// 	if (err) throw err;
			// 	// TODO Add error handling!! RequestRepository.ERROR
			// 	// results is an array consisting of messages collected during execution

			// 	console.log('results: %j', results)
			// })
		})

		return Promise.resolve();
		
	}

}

module.exports = RequestRepository;