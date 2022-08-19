const tmdbMock = () => ({
    error: null,
    response: null,
    searchMovie(query, callback) {
        callback(this.error, this.response);
    },
    movieInfo(query, callback) {
      callback(this.error, this.response);
    },
    miscPopularMovies(callback) {
      console.log('miscPopMovies callback', callback)
      callback(this.error, this.response);
    },
});

module.exports = tmdbMock;
