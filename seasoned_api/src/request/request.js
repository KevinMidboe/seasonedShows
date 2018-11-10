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
      add: 'insert into request (id,title,year,type) values(?,?,?,?)',
      fetchAll: 'select id, type from request',
      fetchAllSort: `select id, type from request order by ? ?`,
      fetchAllFilter: `select id, type from request where ? is "?"`,
      fetchAllQuery: `select id, type from request where title like "%?%" or year like "%?%"`,
      fetchAllFilterAndSort: `select id, type from request where ? is "?" order by ? ?`,
      downloaded: '(select status from requests where id is request.id and type is request.type limit 1)',
      // deluge: '(select status from deluge_torrent where id is request.id and type is request.type limit 1)',
      // fetchAllFilterStatus: 'select * from request where '
      read: 'select * from request where id is ? and type is ?'
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
  addTmdb(tmdb) {
    return Promise.resolve()
    .then(() => this.database.get(this.queries.read, [tmdb.id, tmdb.type]))
    .then(row => assert.equal(row, undefined, 'Id has already been requested'))
    .then(() => this.database.run(this.queries.add, [tmdb.id, tmdb.title||tmdb.name, tmdb.year, tmdb.type]))
    .catch((error) => {
      if (error.name === 'AssertionError' || error.message.endsWith('been requested')) {
        throw new Error('This id is already requested', error.message);
      }
      console.log('Error @ request.addTmdb:', error);
      throw new Error('Could not add request');
    });
  }

  fetchAll(sort_by=undefined, sort_direction='asc', filter_param=undefined, query=undefined) {
    return Promise.resolve()
      .then(() => utils.validSort(sort_by, sort_direction))
      .then(() => utils.validFilter(filter_param))
      .then(() => this.sortAndFilterToDbQuery(sort_by, sort_direction, filter_param, query))
      .then((dbQuery) => this.database.all(dbQuery))
      .then((rows) => Promise.all(this.mapToTmdbByType(rows)))
  }
}

module.exports = RequestRepository;
