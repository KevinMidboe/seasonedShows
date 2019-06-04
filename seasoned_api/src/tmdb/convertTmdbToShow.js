const Show = require('src/tmdb/types/show');

function convertTmdbToShow(tmdbShow, credits=undefined) {
  const show = new Show(tmdbShow.id, tmdbShow.name)
  show.seasons = tmdbShow.number_of_seasons;
  show.episodes = tmdbShow.number_of_episodes;
  show.overview = tmdbShow.overview;
  show.rank = tmdbShow.vote_average;

  if (credits) {
    show.credits = credits
  }

  if (tmdbShow.genres !== undefined) {
    show.genres = tmdbShow.genres.map(genre => genre.name);
  }

  if (tmdbShow.first_air_date !== undefined) {
    show.first_air_date = new Date(tmdbShow.first_air_date);
    show.year = show.first_air_date.getFullYear();
  }

  if (tmdbShow.poster_path !== undefined) {
    show.poster = tmdbShow.poster_path;
  }
  if (tmdbShow.backdrop_path !== undefined) {
    show.backdrop = tmdbShow.backdrop_path;
  }

  if (tmdbShow.status !== undefined) {
    show.status = tmdbShow.status;
  }

  if (tmdbShow.episode_run_time !== undefined) {
    show.runtime = tmdbShow.runtime;
  }

  return show;
}

module.exports = convertTmdbToShow;
