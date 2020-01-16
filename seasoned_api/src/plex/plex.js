const fetch = require('node-fetch')
const convertPlexToMovie = require('src/plex/convertPlexToMovie')
const convertPlexToShow = require('src/plex/convertPlexToShow')
const convertPlexToEpisode = require('src/plex/convertPlexToEpisode')


const { Movie, Show, Person } = require('src/tmdb/types');

// const { Movie, } 
// TODO? import class definitions to compare types ?
// what would typescript do?

const matchingTitleOrName = (plex, tmdb) => {
  if (plex['title'] !== undefined && tmdb['title'] !== undefined)
      return sanitize(plex.title) === sanitize(tmdb.title)

  return false
}

const matchingYear = (plex, tmdb) => {
  return plex.year === tmdb.year
}

const sanitize = (string) => string.toLowerCase()

class Plex {
  constructor(ip, port=32400) {
    this.plexIP = ip
    this.plexPort = port
  }

  matchTmdbAndPlexMedia(plex, tmdb) {
    if (plex === undefined || tmdb === undefined)
      return false

    let titleMatches;
    let yearMatches;

    if (plex instanceof Array) {
      console.log('Plex object to compare is a list.')
      const plexList = plex
      console.log('List of plex objects:', plexList)

      titleMatches = plexList.map(plexItem => matchingTitleOrName(plexItem, tmdb))
      yearMatches = plexList.map(plexItem => matchingYear(plexItem, tmdb))
    } else {
      titleMatches = matchingTitleOrName(plex, tmdb)
      yearMatches = matchingYear(plex, tmdb)
    }

    return titleMatches && yearMatches
  }

  existsInPlex(tmdbMovie) {
    return this.search(tmdbMovie.title)
      .then(plexMovies => plexMovies.some(plex => this.matchTmdbAndPlexMedia(plex, tmdbMovie)))
  }

  successfullResponse(response) {
    const { status, statusText } = response

    if (status === 200) {
      return response.json()
    } else {
      throw { message: statusText, status: status }
    }
  }

  search(query) {
    const url = `http://${this.plexIP}:${this.plexPort}/hubs/search?query=${query}`
    const options = {
      timeout: 2000,
      headers: { 'Accept': 'application/json' }
    }

    return fetch(url, options)
      .then(this.successfullResponse)
      .then(this.mapResults)
      .catch(error => {
        if (error.type === 'request-timeout') {
          throw { message: 'Plex did not respond', status: 408, success: false }
        }

        throw error
      })
  }

  mapResults(response) {
    if (response === undefined || response.MediaContainer === undefined) {
      console.log('response was not valid to map', response)
      return []
    }

    return response.MediaContainer.Hub
      .filter(category => category.size > 0)
      .map(category => {
        if (category.type === 'movie') {
          return category.Metadata.map(movie => {
            const ovie = Movie.convertFromPlexResponse(movie)
            return ovie.createJsonResponse()
          })
        } else if (category.type === 'show') {
          return category.Metadata.map(convertPlexToShow)
        } else if (category.type === 'episode') {
          return category.Metadata.map(convertPlexToEpisode)
        }
      })
      .filter(result => result !== undefined)
      .flat()
  }
}

module.exports = Plex;
