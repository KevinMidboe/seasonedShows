class mailTemplate {
  constructor(mediaItem) {
    this.mediaItem = mediaItem;
    this.posterURL = "https://image.tmdb.org/t/p/w600";
  }

  toText() {
    return `${this.mediaItem.title} (${this.mediaItem.year})`; // plain text body
  }

  toHTML() {
    const info = {
      name: this.mediaItem.title,
      year: `(${this.mediaItem.year})`,
      poster: this.posterURL + this.mediaItem.poster
    };

    return `
         <h1>${info.name} ${info.year}</h1>
         <img src="${info.poster}">
      `;
  }
}

export default mailTemplate;
