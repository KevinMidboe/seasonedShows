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

	search(query, type, page) {
		return Promise.resolve()
		.then(() => tmdb.search(query, type, page))
		// .then((tmdbResult) => plexRepository.multipleInPlex(tmdbResult))
		.then((result) => {
			return result
		})
		.catch((error) => {return 'error in the house' + error})
	}

	lookup(identifier, type = 'movie') {
		return Promise.resolve()
		.then(() => tmdb.lookup(identifier, type))
		.then((tmdbMovie) => this.checkID(tmdbMovie))
		.then((tmdbMovie) => plexRepository.inPlex(tmdbMovie))
		.catch((error) => {
			console.log(error)
		})
	}

	checkID(tmdbMovie) {
		return Promise.resolve()
		.then(() => this.database.get(this.queries.checkIfIdRequested, [tmdbMovie.id, tmdbMovie.type]))
		.then((result, error) => {
			let already_requested = false;
			if (result)
				already_requested = true

			tmdbMovie.requested = already_requested;
			return tmdbMovie;
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
