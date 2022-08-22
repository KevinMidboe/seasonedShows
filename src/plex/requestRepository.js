import PlexRepository from "./plexRepository";
import TMDB from "../tmdb/tmdb";
import establishedDatabase from "../database/database";
import Configuration from "../config/configuration";

const configuration = Configuration.getInstance();
const plexRepository = new PlexRepository(
  configuration.get("plex", "ip"),
  configuration.get("plex", "token")
);
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

  static search(query, type, page) {
    return tmdb
      .search(query, type, page)
      .catch(error => Error(`error in the house${error}`));
  }

  lookup(identifier, type = "movie") {
    return tmdb
      .lookup(identifier, type)
      .then(tmdbMovie => this.checkID(tmdbMovie))
      .then(tmdbMovie => plexRepository.inPlex(tmdbMovie))
      .catch(error => {
        throw new Error(error);
      });
  }

  checkID(_tmdbMovie) {
    const tmdbMovie = _tmdbMovie;

    return this.database
      .get(this.queries.checkIfIdRequested, [tmdbMovie.id, tmdbMovie.type])
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
    return tmdb.lookup(identifier, type).then(movie => {
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
  }

  userRequests(username) {
    return this.database
      .all(this.queries.userRequests, username)
      .catch(error => {
        if (String(error).includes("no such column")) {
          throw new Error("Username not found");
        }
        throw new Error("Unable to fetch your requests");
      })
      .then(result => {
        // TODO do a correct mapping before sending, not just a dump of the database
        return result.map(_item => {
          const item = { ..._item };
          item.poster = item.poster_path;
          return item;
        });
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

export default RequestRepository;
