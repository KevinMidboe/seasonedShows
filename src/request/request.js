import assert from "assert";
// const configuration = require("../config/configuration").getInstance();
// const TMDB = require("../tmdb/tmdb");
import establishedDatabase from "../database/database.js";

// const tmdb = new TMDB(configuration.get("tmdb", "apiKey"));

// function mapToTmdbByType(rows) {
//   return rows.map(row => {
//     if (row.type === "movie") return tmdb.movieInfo(row.id);
//     if (row.type === "show") return tmdb.showInfo(row.id);
//     return null;
//   });
// }

class RequestRepository {
  constructor(database) {
    this.database = database || establishedDatabase;
    this.queries = {
      add: "insert into requests (id,title,year,poster_path,background_path,requested_by,ip,user_agent,type) values(?,?,?,?,?,?,?,?,?)",
      fetchAll:
        'select * from requests where status != "downloaded" order by date desc LIMIT 25 OFFSET ?*25-25',
      fetchAllFilteredStatus:
        "select * from requests where status = ? order by date desc LIMIT 25 offset ?*25-25",
      totalRequests:
        'select count(*) as totalRequests from requests where status != "downloaded"',
      totalRequestsFilteredStatus:
        "select count(*) as totalRequests from requests where status = ?",
      // fetchAllSort: `select id, type from request order by ? ?`,
      // fetchAllFilter: `select id, type from request where ? is "?"`,
      // fetchAllQuery: `select id, type from request where title like "%?%" or year like "%?%"`,
      // fetchAllFilterAndSort: `select id, type from request where ? is "?" order by ? ?`,
      // downloaded: "(select status from requests where id is request.id and type is request.type limit 1)",
      // deluge: '(select status from deluge_torrent where id is request.id and type is request.type limit 1)',
      // fetchAllFilterStatus: 'select * from request where '
      readWithoutUserData:
        "select id, title, year, type, status, date from requests where id is ? and type is ?",
      read: "select id, title, year, type, status, requested_by, ip, date, user_agent from requests where id is ? and type is ?"
    };
  }

  /**
   * Add tmdb movie|show to requests
   * @param {tmdb} tmdb class of movie|show to add
   * @returns {Promise}
   */
  requestFromTmdb(tmdb, ip, userAgent, username) {
    return Promise.resolve()
      .then(() => this.database.get(this.queries.read, [tmdb.id, tmdb.type]))
      .then(row =>
        assert.equal(row, undefined, "Id has already been requested")
      )
      .then(() =>
        this.database.run(this.queries.add, [
          tmdb.id,
          tmdb.title,
          tmdb.year,
          tmdb.poster,
          tmdb.backdrop,
          username,
          ip,
          userAgent,
          tmdb.type
        ])
      )
      .catch(error => {
        if (
          error.name === "AssertionError" ||
          error.message.endsWith("been requested")
        ) {
          throw new Error("This id is already requested", error.message);
        }
        throw new Error("Could not add request");
      });
  }

  /**
   * Get request item by id
   * @param {String} id
   * @param {String} type
   * @returns {Promise}
   */
  getRequestByIdAndType(id, type) {
    return this.database
      .get(this.queries.readWithoutUserData, [id, type])
      .then(row => {
        if (!row) return Promise.resolve(null);

        return Promise.resolve({
          id: row.id,
          title: row.title,
          year: row.year,
          type: row.type,
          status: row.status,
          requested_date: new Date(row.date)
        });
      });
  }

  /**
   * Fetch all requests with optional sort and filter params
   * @param {String} what we are sorting by
   * @param {String} params to filter by
   * @returns {Promise}
   */
  fetchAll(_page = 1, filter = null) {
    // TODO implemented sort and filter
    const page = parseInt(_page, 10);
    let fetchQuery = this.queries.fetchAll;
    let fetchTotalResults = this.queries.totalRequests;
    let fetchParams = [page];

    if (
      filter &&
      (filter === "downloading" ||
        filter === "downloaded" ||
        filter === "requested")
    ) {
      fetchQuery = this.queries.fetchAllFilteredStatus;
      fetchTotalResults = this.queries.totalRequestsFilteredStatus;
      fetchParams = [filter, page];
    }

    return this.database
      .all(fetchQuery, fetchParams)
      .then(async rows => {
        const sqliteResponse = await this.database.get(fetchTotalResults);
        const { totalRequests } = sqliteResponse;
        const totalPages = Math.ceil(totalRequests / 26);

        return [
          rows.map(_item => {
            const item = _item;
            item.poster = item.poster_path;
            delete item.poster_path;
            item.backdrop = item.background_path;
            delete item.background_path;
            return item;
          }),
          totalPages,
          totalRequests
        ];

        // return mapToTmdbByType(rows);
      })
      .then(([result, totalPages, totalRequests]) =>
        Promise.resolve({
          results: result,
          total_results: totalRequests,
          page,
          total_pages: totalPages
        })
      )
      .catch(error => {
        throw error;
      });
  }
}

export default RequestRepository;
