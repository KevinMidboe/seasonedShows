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
    callback(this.error, this.response);
  }
});

export default tmdbMock;
