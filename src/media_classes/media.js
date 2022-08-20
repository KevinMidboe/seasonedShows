class Media {
  constructor(title, year, type) {
    this.title = title;
    this.year = year;
    this.type = type;
  }

  toString() {
    return `N: ${this.title} | Y: ${this.year} | T: ${this.type}`;
  }

  print() {
    /* eslint-disable no-console */
    console.log(this.toString());
  }
}

module.exports = Media;
