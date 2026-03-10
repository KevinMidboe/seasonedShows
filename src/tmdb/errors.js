class TMDBNotFoundError extends Error {
  constructor(message) {
    super(message);

    this.statusCode = 404;
  }
}

class TMDBUnauthorizedError extends Error {
  constructor(message = "TMDB returned access denied, requires api token.") {
    super(message);

    this.statusCode = 401;
  }
}

class TMDBUnexpectedError extends Error {
  constructor(type, errorMessage) {
    const message = `An unexpected error occured while fetching ${type} from tmdb`;
    super(message);

    this.errorMessage = errorMessage;
    this.statusCode = 500;
  }
}

class TMDBNotReachableError extends Error {
  constructor(
    message = "TMDB api not reachable, check your internet connection"
  ) {
    super(message);
  }
}
