const PlexRepository = require('src/plex/plexRepository');
const Cache = require('src/tmdb/cache');
const configuration = require('src/config/configuration').getInstance();
const TMDB = require('src/tmdb/tmdb');
const establishedDatabase = require('src/database/database');

const plexRepository = new PlexRepository();
const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));

const MailTemplate = require('src/plex/mailTemplate');
const nodemailer = require('nodemailer');


class RequestRepository {
   constructor(cache, database) {
      this.database = database || establishedDatabase;
      this.queries = {
         insertRequest: "INSERT INTO requests VALUES (?, ?, ?, ?, ?, ?, ?, DEFAULT, DEFAULT, ?, ?)",
         fetchRequestedItems: 'SELECT * FROM requests ORDER BY date DESC',
         fetchRequestedItemsByStatus: 'SELECT * FROM requests WHERE status IS ? AND type LIKE ?',
         updateRequestedById: 'UPDATE requests SET status = ? WHERE id is ? AND type is ?',
         checkIfIdRequested: 'SELECT * FROM requests WHERE id IS ? AND type IS ?',
         userRequests: 'SELECT * FROM requests WHERE requested_by IS ?'
      };
      this.cacheTags = {
         search: 'se',
         lookup: 'i',
      };
   }

   search(query, type, page) {
      return Promise.resolve()
         .then(() => tmdb.search(query, type, page))
         .then(result => result)
         .catch(error => `error in the house${error}`);
   }

   lookup(identifier, type = 'movie') {
      return Promise.resolve()
         .then(() => tmdb.lookup(identifier, type))
         .then(tmdbMovie => this.checkID(tmdbMovie))
         .then(tmdbMovie => plexRepository.inPlex(tmdbMovie))
         .catch((error) => {
            throw new Error(error);
         });
   }

   checkID(tmdbMovie) {
      return Promise.resolve()
         .then(() => this.database.get(this.queries.checkIfIdRequested, [tmdbMovie.id, tmdbMovie.type]))
         .then((result, error) => {
            if (error) { throw new Error(error); }
            let already_requested = false;
            if (result) { already_requested = true; }

            tmdbMovie.requested = already_requested;
            return tmdbMovie;
         });
   }

   /**
   * Send request for given media id.
   * @param {identifier, type} the id of the media object and type of media must be defined
   * @returns {Promise} If nothing has gone wrong.
   */
   sendRequest(identifier, type, ip, user_agent, user) {
      tmdb.lookup(identifier, type).then((movie) => {
         if (user === 'false') { user = 'NULL'; }
         // Add request to database
         this.database.run(this.queries.insertRequest, [movie.id, movie.title, movie.year, movie.poster_path, movie.background_path, user.username, ip, user_agent, movie.type]);
      });
   }

   fetchRequested(status, type = '%') {
   	return Promise.resolve()
   	.then(() => {
	      if (status === 'requested' || status === 'downloading' || status === 'downloaded')
	         return this.database.all(this.queries.fetchRequestedItemsByStatus, [status, type]);
	      else
	         return this.database.all(this.queries.fetchRequestedItems);
   	})
   }

   userRequests(user) {
   	return Promise.resolve()
         .then(() => this.database.all(this.queries.userRequests, user.username))
         .catch((error) => {
            if (String(error).includes('no such column')) { throw new Error('Username not found'); }
            else { throw new Error('Unable to fetch your requests')}
         })
         .then((result) => { return result })
   }

   updateRequestedById(id, type, status) {
      return this.database.run(this.queries.updateRequestedById, [status, id, type]);
   }
}

module.exports = RequestRepository;
