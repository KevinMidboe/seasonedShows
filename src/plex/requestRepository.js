const PlexRepository = require("./plexRepository");
const configuration = require("../config/configuration").getInstance();
const TMDB = require("../tmdb/tmdb");
const establishedDatabase = require("../database/database");

const plexRepository = new PlexRepository(configuration.get("plex", "ip"));
const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));

class RequestRepository {
  constructor(database) {
    this.database = database || establishedDatabase;
    this.queries = {
      insertRequest: `INSERT INTO requests(id,title,year,poster_path,background_path,requested_by,ip,user_agent,type)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      fetchRequestedItems:
        "SELECT * FROM requests ORDER BY date DESC LIMIT 25 OFFSET ?*25-25",
      fetchRequestedItemsByStatus:
        "SELECT * FROM requests WHERE status IS ? AND type LIKE ? ORDER BY date DESC LIMIT 25 OFFSET ?*25-25",
      updateRequestedById:
        "UPDATE requests SET status = ? WHERE id is ? AND type is ?",
      checkIfIdRequested: "SELECT * FROM requests WHERE id IS ? AND type IS ?",
      userRequests:
        "SELECT * FROM requests WHERE requested_by IS ? ORDER BY date DESC"
    };
    this.cacheTags = {
      search: "se",
      lookup: "i"
    };
  }

  search(query, type, page) {
    return Promise.resolve()
      .then(() => tmdb.search(query, type, page))
      .catch(error => Error(`error in the house${error}`));
  }

  lookup(identifier, type = "movie") {
    return Promise.resolve()
      .then(() => tmdb.lookup(identifier, type))
      .then(tmdbMovie => this.checkID(tmdbMovie))
      .then(tmdbMovie => plexRepository.inPlex(tmdbMovie))
      .catch(error => {
        throw new Error(error);
      });
  }

  checkID(tmdbMovie) {
    return Promise.resolve()
      .then(() =>
        this.database.get(this.queries.checkIfIdRequested, [
          tmdbMovie.id,
          tmdbMovie.type
        ])
      )
      .then((result, error) => {
        if (error) {
          throw new Error(error);
        }
        tmdbMovie.requested = !!result;
        return tmdbMovie;
      });
  }

  /**
   * Send request for given media id.
   * @param {identifier, type} the id of the media object and type of media must be defined
   * @returns {Promise} If nothing has gone wrong.
   */
  sendRequest(identifier, type, ip, userAgent, user) {
    return Promise.resolve()
      .then(() => tmdb.lookup(identifier, type))
      .then(movie => {
        const username = user === undefined ? undefined : user.username;
        // Add request to database
        return this.database.run(this.queries.insertRequest, [
          movie.id,
          movie.title,
          movie.year,
          movie.poster_path,
          movie.background_path,
          username,
          ip,
          userAgent,
          movie.type
        ]);
      });
  }

  fetchRequested(status, page = "1", type = "%") {
    return Promise.resolve().then(() => {
      if (
        status === "requested" ||
        status === "downloading" ||
        status === "downloaded"
      )
        return this.database.all(this.queries.fetchRequestedItemsByStatus, [
          status,
          type,
          page
        ]);
      return this.database.all(this.queries.fetchRequestedItems, page);
    });
  }

  userRequests(username) {
    return Promise.resolve()
      .then(() => this.database.all(this.queries.userRequests, username))
      .catch(error => {
        if (String(error).includes("no such column")) {
          throw new Error("Username not found");
        }
        throw new Error("Unable to fetch your requests");
      })
      .then(result => {
        // TODO do a correct mapping before sending, not just a dump of the database
        result.map(item => (item.poster = item.poster_path));
        return result;
      });
  }

  updateRequestedById(id, type, status) {
    return this.database.run(this.queries.updateRequestedById, [
      status,
      id,
      type
    ]);
  }
}

module.exports = RequestRepository;
