export class TMDBNotFoundError extends Error {
  constructor(message) {
    super(message);

    this.statusCode = 404;
  }
}

export class TMDBUnauthorizedError extends Error {
  constructor(message = "TMDB returned access denied, requires api token.") {
    super(message);

    this.statusCode = 401;
  }
}

export class TMDBUnexpectedError extends Error {
  constructor(url, errorMessage) {
    const message = `An unexpected error occured while fetching ${url} from tmdb`;
    super(message);

    this.errorMessage = errorMessage;
    this.statusCode = 500;
  }
}

export class TMDBNotReachableError extends Error {
  constructor(
    message = "TMDB api not reachable, check your internet connection"
  ) {
    super(message);
  }
}
