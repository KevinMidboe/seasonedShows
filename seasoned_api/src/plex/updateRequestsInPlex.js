const Plex = require('src/plex/plex')
const configuration = require('src/config/configuration').getInstance();
const plex = new Plex(configuration.get('plex', 'ip'))
const establishedDatabase = require('src/database/database'); 

class UpdateRequestsInPlex {
  constructor() {
     this.database = establishedDatabase;
     this.queries = {
        getMovies: `SELECT * FROM requests WHERE status = 'requested' OR status = 'downloading'`,
//         getMovies: "select * from requests where status is 'reset'",
        saveNewStatus: `UPDATE requests SET status = ? WHERE id IS ? and type IS ?`,
     }
  }
  getByStatus() {
     return this.database.all(this.queries.getMovies);
  }
  scrub() {
     return this.getByStatus()
        .then((requests) => Promise.all(requests.map(movie => plex.existsInPlex(movie))))
  }

  commitNewStatus(status, id, type, title) {
    console.log(type, title, 'updated to:', status)
    this.database.run(this.queries.saveNewStatus, [status, id, type])
  }

   
  updateStatus(status) {
    this.getByStatus()
      .then(requests => Promise.all(requests.map(request => plex.existsInPlex(request))))
      .then(matchedRequests => matchedRequests.filter(request => request.existsInPlex))
      .then(newMatches => newMatches.map(match => this.commitNewStatus(status, match.id, match.type, match.title)))
  }
}
var requestsUpdater = new UpdateRequestsInPlex();
requestsUpdater.updateStatus('downloaded')

module.exports = UpdateRequestsInPlex
