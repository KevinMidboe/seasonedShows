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
}

module.exports = Person;
