export class PlexRequestTimeoutError extends Error {
  constructor() {
    const message = "Timeout: Plex did not respond.";

    super(message);
    this.statusCode = 408;
  }
}

export class PlexUnexpectedError extends Error {
  constructor(plexError = null) {
    const message = "Unexpected plex error occured.";

    super(message);
    this.statusCode = 500;
    this.plexError = plexError;
  }
}
