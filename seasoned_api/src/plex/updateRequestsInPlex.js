const PlexRepository = require('src/plex/plexRepository');
const configuration = require('src/config/configuration').getInstance();
const establishedDatabase = require('src/database/database');

const plexRepository = new PlexRepository();

class UpdateRequestsInPlex {
   constructor() {
      this.database = establishedDatabase;
      this.queries = {
         getRequests: `SELECT * FROM requests WHERE status IS 'requested' OR 'downloaded'`,
         saveNewStatus: `UPDATE requests SET status = ? WHERE id IS ? and type IS ?`,
      }
   }

   getRequests() {
      return this.database.all(this.queries.getRequests);
   }

   scrub() {
      return this.getRequests()
         .then((requests) => Promise.all(requests.map(async (movie) => {
            return plexRepository.inPlex(movie)
         })))
         .then((requests_checkInPlex) => requests_checkInPlex.filter((movie) => movie.matchedInPlex))
   }

   updateStatus(status) {
     this.scrub().then((newInPlex) => 
         newInPlex.map((movie) => {
            console.log('updated', movie.title, 'to', status)
            // this.database.run(this.queries.saveNewStatus, [status, movie.id, movie.type])
         })
      )
   }
}

var requestsUpdater = new UpdateRequestsInPlex();
requestsUpdater.updateStatus('downloaded')

module.exports = UpdateRequestsInPlex