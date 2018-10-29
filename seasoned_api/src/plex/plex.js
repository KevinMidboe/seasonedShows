const axios = require('axios');
const convertPlexToMovie = require('src/plex/convertPlexToMovie');
const convertPlexToShow = require('src/plex/convertPlexToShow');
const convertPlexToEpisode = require('src/plex/convertPlexToEpisode');

class Plex {
  constructor(ip) {
    this.plexIP = ip;
    this.plexPort = 32400;
  }

  existsInPlex(tmdbMovie) {
    return Promise.resolve()
      .then(() => this.search(tmdbMovie.title))
      .then((plexMovies) => {
        const matches = plexMovies.some((plexMovie) => {
          return tmdbMovie.title === plexMovie.title && tmdbMovie.type === plexMovie.type;
        })

        tmdbMovie.existsInPlex = matches;
        return tmdbMovie;
      })
  }

  search(query) {
    const options = {
      baseURL: `http://${this.plexIP}:${this.plexPort}`,
      url: '/hubs/search',
      params: { query: query },
      responseType: 'json'
    }

    return Promise.resolve()
      .then(() => axios.request(options))
      .catch((error) => { throw new Error(`Unable to search plex library`); })
      .then(response => this.mapResults(response));
  }


  mapResults(response) {
    return response.data.MediaContainer.Hub.reduce((result, hub) => {
      if (hub.type === 'movie' && hub.Metadata !== undefined) {
        return [...result, ...hub.Metadata.map(convertPlexToMovie)];
      }
      else if (hub.type === 'show' && hub.Metadata !== undefined) {
        return [...result, ...hub.Metadata.map(convertPlexToShow)];
      }
      else if (hub.type === 'episode' && hub.Metadata !== undefined) {
        return [...result, ...hub.Metadata.map(convertPlexToEpisode)];
      }

      return result
    }, [])
  }
}

module.exports = Plex;
