const TMDB = require('src/media_classes/tmdb');

function translateYear(tmdbReleaseDate) {
   return new Date(tmdbReleaseDate).getFullYear();
}

function translateGenre(tmdbGenres) {
   return tmdbGenres.map(genre => genre.name);
}

function convertType(tmdbType) {
   if (tmdbType === 'tv') return 'show';
   return undefined;
}

function convertTmdbToMovie(tmdb) {
   const title = tmdb.title || tmdb.name;
   const year = translateYear(tmdb.release_date || tmdb.first_air_date);
   const type = manualType || convertType(tmdb.type) || 'movie';

   const id = tmdb.id;
   const summary = tmdb.overview;
   const poster_path = tmdb.poster_path;
   const background_path = tmdb.backdrop_path;
   const popularity = tmdb.popularity;
   const score = tmdb.vote_average;
   // const genres = translateGenre(tmdb.genres);
   const release_status = tmdb.status;
   const tagline = tmdb.tagline;

   const seasons = tmdb.number_of_seasons;
   const episodes = tmdb.episodes;

   const seasoned = new TMDB(
      title, year, type, id, summary, poster_path, background_path,
      popularity, score, release_status, tagline, seasons, episodes
   );

   // seasoned.print()
   return seasoned;
}

module.exports = convertTmdbToSeasoned;
