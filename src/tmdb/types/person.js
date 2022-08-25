/* eslint-disable camelcase */

class Person {
  constructor(
    id,
    name,
    poster = undefined,
    birthday = undefined,
    deathday = undefined,
    adult = undefined,
    placeOfBirth = undefined,
    biography = undefined,
    knownForDepartment = undefined
  ) {
    this.id = id;
    this.name = name;
    this.poster = poster;
    this.birthday = birthday;
    this.deathday = deathday;
    this.adult = adult;
    this.placeOfBirth = placeOfBirth;
    this.biography = biography;
    this.knownForDepartment = knownForDepartment;
    this.type = "person";
  }

  static convertFromTmdbResponse(response) {
    const {
      id,
      name,
      profile_path,
      birthday,
      deathday,
      adult,
      place_of_birth,
      biography,
      known_for_department
    } = response;

    const birthDay = new Date(birthday);
    const deathDay = deathday ? new Date(deathday) : null;

    return new Person(
      id,
      name,
      profile_path,
      birthDay,
      deathDay,
      adult,
      place_of_birth,
      biography,
      known_for_department
    );
  }

  createJsonResponse() {
    return {
      id: this.id,
      name: this.name,
      poster: this.poster,
      birthday: this.birthday,
      deathday: this.deathday,
      place_of_birth: this.placeOfBirth,
      biography: this.biography,
      known_for_department: this.knownForDepartment,
      adult: this.adult,
      type: this.type
    };
  }
}

export default Person;
