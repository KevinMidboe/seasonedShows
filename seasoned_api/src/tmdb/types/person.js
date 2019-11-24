class Person { 
  constructor(id, name, poster=undefined, birthday=undefined, deathday=undefined,
              adult=undefined, knownForDepartment=undefined) {
    this.id = id;
    this.name = name;
    this.poster = poster;
    this.birthday = birthday;
    this.deathday = deathday;
    this.adult = adult;
    this.knownForDepartment = knownForDepartment;
    this.type = 'person';
  }

  static convertFromTmdbResponse(response) {
    const { id, name, poster, birthday, deathday, adult, known_for_department } = response;

    const birthDay = new Date(birthday)
    const deathDay = deathday ? new Date(deathday) : null

    return new Person(id, name, poster, birthDay, deathDay, adult, known_for_department)
  }

  createJsonResponse() {
    return {
      id: this.id,
      name: this.name,
      poster: this.poster,
      birthday: this.birthday,
      deathday: this.deathday,
      known_for_department: this.knownForDepartment,
      adult: this.adult,
      type: this.type
    }
  }
}

module.exports = Person;
