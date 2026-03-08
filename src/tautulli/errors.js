export class TautulliUnexpectedError extends Error {
  constructor(errorMessage) {
    const message = "Unexpected error fetching from tautulli.";
    super(message);

    this.statusCode = 500;
    this.errorMessage = errorMessage;
  }
}
