export class MissingDaysParameterError extends Error {
  constructor() {
    const message = "Missing parameter: days (number)";
    super(message);

    this.statusCode = 422;
  }
}

export class MissingYAxisParameterError extends Error {
  constructor(message = "Missing parameter: y_axis") {
    super(message);

    this.statusCode = 422;
  }
}

export class PlexAuthenticationError extends Error {
  constructor(errorResponse) {
    const message =
      "Unexptected error while authenticating to plex signin api. View error response.";
    super(message);

    this.errorResponse = errorResponse;
    this.statusCode = 500;
    this.success = false;
    this.source = "plex";
  }
}

export class PlexUnauthorizedError extends Error {
  constructor(errorResponse) {
    const message = "Unauthorized. Please check plex credentials.";
    super(message);

    this.errorResponse = errorResponse;
    this.statusCode = 401;
    this.success = false;
    this.source = "plex";
  }
}
