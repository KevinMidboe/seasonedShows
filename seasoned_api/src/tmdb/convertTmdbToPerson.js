import { Person } from './types'
const convertTmdbToMovie = require('src/tmdb/convertTmdbToMovie');

function convertTmdbToPerson(tmdbPerson, cast=undefined) {
  const person = new Person(tmdbPerson.id, tmdbPerson.name);

  if (tmdbPerson.profile_path !== undefined) {
    person.poster = tmdbPerson.profile_path;
  }

  if (tmdbPerson.birthday !== undefined) {
    person.birthday = new Date(tmdbPerson.birthday);
  }

  if (tmdbPerson.deathday !== undefined) {
    person.deathday = tmdbPerson.deathday;
  }

  if (tmdbPerson.known_for !== undefined) {
    person.known_for = tmdbPerson.known_for.map(convertTmdbToMovie);
  }

  if (cast) {
    person.cast = cast.cast;
  }

  return person;
}

module.exports = convertTmdbToPerson;
