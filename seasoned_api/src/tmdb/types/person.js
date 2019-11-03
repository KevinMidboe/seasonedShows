class Person { 
  constructor(id, name, poster=null, birthday=null, deathday=null, known_for=null) {
    this.id = id;
    this.name = name;
    this.poster = poster;
    this.birthday = birthday;
    this.deathday = deathday;
    this.known_for = known_for;
    this.type = 'person';
  }

  createJsonResponse() {
    return {
      id: this.id,
      name: this.name,
      poster: this.poster,
      birthday: this.birthday,
      deathday: this.deathday,
      known_for: this.known_for,
      type: this.type
    }
  }
}

module.exports = Person;
