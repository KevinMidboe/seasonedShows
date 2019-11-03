class ReleaseDates { 
  constructor(id, releases) {
    this.id = id;
    this.releases = releases;
  }

  static convertFromTmdbResponse(response) {
    const { id, results } = response;

    const releases = results.map(countryRelease => 
      new Release(
        countryRelease.iso_3166_1, 
        countryRelease.release_dates.map(rd => new ReleaseDate(rd.certification, rd.iso_639_1, rd.release_date, rd.type, rd.note))
      ))

    return new ReleaseDates(id, releases)
  }

  createJsonResponse() {
    return {
      id: this.id,
      results: this.releases.map(release => release.createJsonResponse())
    }
  }
}

class Release { 
  constructor(country, releaseDates) {
    this.country = country;
    this.releaseDates = releaseDates;
  }

  createJsonResponse() {
    return {
      country: this.country,
      release_dates: this.releaseDates.map(releaseDate => releaseDate.createJsonResponse())
    }
  }
}

class ReleaseDate {
  constructor(certification, language, releaseDate, type, note) {
    this.certification = certification;
    this.language = language;
    this.releaseDate = releaseDate;
    this.type = this.releaseTypeLookup(type);
    this.note = note;
  }

  releaseTypeLookup(releaseTypeKey) {
    const releaseTypeEnum = {
      1: 'Premier',
      2: 'Limited theatrical',
      3: 'Theatrical',
      4: 'Digital',
      5: 'Physical',
      6: 'TV'
    }
    if (releaseTypeKey <= Object.keys(releaseTypeEnum).length) {
      return releaseTypeEnum[releaseTypeKey]
    } else {
      // TODO log | Release type not defined, does this need updating?
      return null
    }
  }

  createJsonResponse() {
    return {
      certification: this.certification,
      language: this.language,
      release_date: this.releaseDate,
      type: this.type,
      note: this.note
    }
  }
}

module.exports = ReleaseDates;
