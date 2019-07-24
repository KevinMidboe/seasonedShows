const assert = require('assert')
const configuration = require('src/config/configuration').getInstance();
const Cache = require('src/tmdb/cache');
const TMDB = require('src/tmdb/tmdb');
const cache = new Cache();
const tmdb = new TMDB(cache, configuration.get('tmdb', 'apiKey'));
const establishedDatabase = require('src/database/database');
const utils = require('./utils');

class RequestRepository {
  constructor(database) {
    this.database = database || establishedDatabase;
    this.queries = {
      add: 'insert into requests (id,title,year,poster_path,background_path,requested_by,ip,user_agent,type) values(?,?,?,?,?,?,?,?,?)',
      fetchAll: 'select * from requests where status != "downloaded" order by date desc LIMIT 25 OFFSET ?*25-25',
      fetchAllFilteredStatus: 'select * from requests where status = ? order by date desc LIMIT 25 offset ?*25-25',
      totalRequests: 'select count(*) as totalRequests from requests where status != "downloaded"',
      totalRequestsFilteredStatus: 'select count(*) as totalRequests from requests where status = ?',
      fetchAllSort: `select id, type from request order by ? ?`,
      fetchAllFilter: `select id, type from request where ? is "?"`,
      fetchAllQuery: `select id, type from request where title like "%?%" or year like "%?%"`,
      fetchAllFilterAndSort: `select id, type from request where ? is "?" order by ? ?`,
      downloaded: '(select status from requests where id is request.id and type is request.type limit 1)',
      // deluge: '(select status from deluge_torrent where id is request.id and type is request.type limit 1)',
      // fetchAllFilterStatus: 'select * from request where '
      read: 'select id, title, year, type, status, requested_by, ip, date, user_agent from requests where id is ? and type is ?'
    };
  }

  sortAndFilterToDbQuery(by, direction, filter, query) {
    let dbQuery = undefined;

    if (query !== undefined) {
      const dbParams = [query, query];
      const dbquery = this.queries.fetchAllQuery

      dbQuery = dbquery.split('').map((char) => char === '?' ? dbParams.shift() : char).join('')
    }
    else if (by !== undefined && filter !== undefined) {
      const paramToColumnAndValue = {
        movie: ['type', 'movie'],
        show: ['type', 'show']
      }
      const dbParams = paramToColumnAndValue[filter].concat([by, direction]);
      const query = this.queries.fetchAllFilterAndSort;

      dbQuery = query.split('').map((char) => char === '?' ? dbParams.shift() : char).join('')
    }
    else if (by !== undefined) {
      const dbParams = [by, direction];
      const query = this.queries.fetchAllSort;

      dbQuery = query.split('').map((char) => char === '?' ? dbParams.shift() : char).join('')
    }
    else if (filter !== undefined) {
      const paramToColumnAndValue = {
        movie: ['type', 'movie'],
        show: ['type', 'show'],
        downloaded: [this.queries.downloaded, 'downloaded']
        // downloading: [this.database.delugeStatus, 'downloading']
      }
      const dbParams = paramToColumnAndValue[filter]
      const query = this.queries.fetchAllFilter;

      dbQuery = query.split('').map((char) => char === '?' ? dbParams.shift() : char).join('')
    }
    else {
      dbQuery = this.queries.fetchAll;
    }

    return dbQuery
  }

  mapToTmdbByType(rows) {
    return rows.map((row) => {
      if (row.type === 'movie')
        return tmdb.movieInfo(row.id)
      else if (row.type === 'show')
        return tmdb.showInfo(row.id)
    })
  }

  /**
   * Add tmdb movie|show to requests
   * @param {tmdb} tmdb class of movie|show to add
   * @returns {Promise}
   */
  requestFromTmdb(tmdb, ip, user_agent, user) {
    return Promise.resolve()
    .then(() => this.database.get(this.queries.read, [tmdb.id, tmdb.type]))
    .then(row => assert.equal(row, undefined, 'Id has already been requested'))
    .then(() => this.database.run(this.queries.add, [tmdb.id, tmdb.title, tmdb.year, tmdb.poster, tmdb.backdrop, user, ip, user_agent, tmdb.type]))
    .catch((error) => {
      if (error.name === 'AssertionError' || error.message.endsWith('been requested')) {
        throw new Error('This id is already requested', error.message);
      }
      console.log('Error @ request.addTmdb:', error);
      throw new Error('Could not add request');
    });
  }

  /**
   * Get request item by id
   * @param {String} id
   * @param {String} type
   * @returns {Promise}
   */
  getRequestByIdAndType(id, type) {
    return Promise.resolve()
      .then(() => this.database.get(this.queries.read, [id, type]))
      .then(row => {
        assert(row, 'Could not find request item with that id and type')
        return JSON.stringify(row)
      })
  }

  /**
   * Fetch all requests with optional sort and filter params
   * @param {String} what we are sorting by
   * @param {String} direction that can be either 'asc' or 'desc', default 'asc'.
   * @param {String} params to filter by
   * @param {String} query param to filter result on. Filters on title and year
   * @returns {Promise}
   */
  fetchAll(page=1, sort_by=undefined, sort_direction='asc', filter=undefined, query=undefined) {
    // TODO implemented sort and filter
    page = parseInt(page)
    let fetchQuery = this.queries.fetchAll
    let fetchTotalResults = this.queries.totalRequests
    let fetchParams = [page]

    if (filter && (filter === 'downloading' || filter === 'downloaded' || filter === 'requested')) {
      console.log('tes')
      fetchQuery = this.queries.fetchAllFilteredStatus
      fetchTotalResults = this.queries.totalRequestsFilteredStatus
      fetchParams = [filter, page]
    } else {
      filter = undefined
    }

    return Promise.resolve()
      .then((dbQuery) => this.database.all(fetchQuery, fetchParams))
      .then(async (rows) => {
        const sqliteResponse = await this.database.get(fetchTotalResults, filter ? filter : undefined)
        const totalRequests = sqliteResponse['totalRequests']
        const totalPages = Math.ceil(totalRequests / 26)

        return [ rows.map(item => { item.poster = item.poster_path; return item }), totalPages ]
        return Promise.all(this.mapToTmdbByType(rows))
})
      .then(([result, totalPages]) => Promise.resolve({
        results: result, total_results: result.length, page: page, total_pages: totalPages
      }))
      .catch(error => { console.log(error);throw error })
  }
}

module.exports = RequestRepository;
