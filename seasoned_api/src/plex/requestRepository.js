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
         insertRequest: "INSERT INTO requests VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_DATE, 'requested', ?, ?)",
         fetchRequestedItems: 'SELECT * FROM requests',
         fetchRequestedItemsByStatus: 'SELECT * FROM requests WHERE status is ?',
         updateRequestedById: 'UPDATE requests SET status = ? WHERE id is ? AND type is ?',
         checkIfIdRequested: 'SELECT * FROM requests WHERE id IS ? AND type IS ?',
      };
   }

   search(query, type, page) {
      return Promise.resolve()
         .then(() => tmdb.search(query, type, page))
      // .then((tmdbResult) => plexRepository.multipleInPlex(tmdbResult))
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
         this.database.run(this.queries.insertRequest, [movie.id, movie.title, movie.year, movie.poster_path, movie.background_path, user, ip, user_agent, movie.type]);


         // create reusable transporter object using the default SMTP transport
         const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
               user: configuration.get('mail', 'user_pi'),
               pass: configuration.get('mail', 'password_pi'),
            },
            // host: configuration.get('mail', 'host'),
            // port: 26,
            // ignoreTLS: true,
            // tls :{rejectUnauthorized: false},
            // secure: false, // secure:true for port 465, secure:false for port 587
         });

         const mailTemplate = new MailTemplate(movie);

         // setup email data with unicode symbols
         const mailOptions = {
            // TODO get the mail adr from global location (easy to add)
            from: 'MovieRequester <pi.midboe@gmail.com>', // sender address
            to: 'kevin.midboe@gmail.com', // list of receivers
            subject: 'Download request', // Subject line
            text: mailTemplate.toText(),
            html: mailTemplate.toHTML(),
         };

         // send mail with defined transport object
         transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
               return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response);
         });
      });

      // TODO add better response when done.
      return Promise.resolve();
   }

   fetchRequested(status) {
      if (status === 'requested' || status === 'downloading' || status === 'downloaded')
         return this.database.all(this.queries.fetchRequestedItemsByStatus, status);
      else
         return this.database.all(this.queries.fetchRequestedItems);
   }

   updateRequestedById(id, type, status) {
      return this.database.run(this.queries.updateRequestedById, [status, id, type]);
   }
}

module.exports = RequestRepository;
