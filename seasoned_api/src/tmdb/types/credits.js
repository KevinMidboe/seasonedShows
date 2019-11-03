class Credits { 
  constructor(id, cast=[], crew=[]) {
    this.id = id;
    this.cast = cast;
    this.crew = crew;
    this.type = 'credits';
  }

  static convertFromTmdbResponse(response) {
    console.log('this is our credits response', response)
    const { id, cast, crew } = response;

    const allCast = cast.map(cast => 
      new CastMember(cast.character, cast.gender, cast.id, cast.name, cast.profile_path))
    const allCrew = crew.map(crew =>
      new CrewMember(crew.department, crew.gender, crew.id, crew.job, crew.name, crew.profile_path))

    return new Credits(id, allCast, allCrew)
  }

  createJsonResponse() {
    return {
      id: this.id,
      cast: this.cast,
      crew: this.crew
    }
  }
}

class CastMember {
  constructor(character, gender, id, name, profile_path) {
    this.character = character;
    this.gender = gender;
    this.id = id;
    this.name = name;
    this.profile_path = profile_path;
    this.type = 'cast member';
  }

  createJsonResponse() {
    return {
      character: this.character,
      gender: this.gender,
      id: this.id,
      name: this.name,
      profile_path: this.profile_path,
      type: this.type
    }
  }
}

class CrewMember {
  constructor(department, gender, id, job, name, profile_path) {
    this.department = department;
    this.gender = gender;
    this.id = id;
    this.job = job;
    this.name = name;
    this.profile_path = profile_path;
    this.type = 'crew member';
  }

  createJsonResponse() {
    return {
      department: this.department,
      gender: this.gender,
      id: this.id,
      job: this.job,
      name: this.name,
      profile_path: this.profile_path,
      type: this.type
    }
  }
}

module.exports = Credits;
