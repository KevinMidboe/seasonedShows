import {
  TMDBNotFoundError,
  TMDBUnauthorizedError,
  TMDBUnexpectedError,
  TMDBNotReachableError
} from "./errors.js";
import { Movie, Show, Person, Credits, ReleaseDates } from "./types.js";
import DISCOVER_DICT from "./discoverList.js";

const tmdbErrorResponse = (error, url = null) => {
  if (url?.includes("api_key")) {
    const u = new URL(url);
    u.searchParams.delete("api_key");
    url = u.href;
  }

  if (error?.status === 404) {
    const message = error?.response?.body?.status_message;

    throw new TMDBNotFoundError(`${message.slice(0, -1)} in tmdb.`);
  } else if (error?.status === 401) {
    throw new TMDBUnauthorizedError(error?.response?.body?.status_message);
  } else if (error?.code === "ENOTFOUND") {
    throw new TMDBNotReachableError();
  }

  throw new TMDBUnexpectedError(url, error.message);
};

class TMDB {
  constructor(apiKey, cache = null) {
    this.host = "https://api.themoviedb.org";
    this.apiKey = apiKey;

    this.validSearchTypes = [
      "multi",
      "movie",
      "tv",
      "person",
      "collection",
      "keyword",
      "company"
    ];
    this.cacheTags = {
      multiSearch: "mus",
      movieSearch: "mos",
      showSearch: "ss",
      personSearch: "ps",
      movieInfo: "mi",
      movieCredits: "mc",
      movieReleaseDates: "mrd",
      movieImages: "mimg",
      showInfo: "si",
      showCredits: "sc",
      personInfo: "pi",
      personCredits: "pc",
      miscNowPlayingMovies: "npm",
      miscPopularMovies: "pm",
      miscTopRatedMovies: "tpm",
      miscUpcomingMovies: "um",
      tvOnTheAir: "toa",
      miscPopularTvs: "pt",
      miscTopRatedTvs: "trt"
    };

    this.defaultTTL = 86400;
  }

  async fetchTmdb(url, options = {}) {
    const _url = new URL(url);
    // ensure that url containes api_key search param
    if (_url.searchParams.get("api_key") === null) {
      _url.searchParams.append("api_key", this.apiKey);
    }

    // ensure we have correct headers
    if (!options?.headers?.keys?.includes("Accept")) {
      options.headers = {
        ...(options?.headers || {}),
        Accept: "application/json"
      };
    }

    // make request
    // TODO log error
    return fetch(_url.href, options).catch(error =>
      tmdbErrorResponse(error, url)
    );
  }

  // ----- MOVIE FUNCTIONS -----
  async movieInfo(identifier) {
    const path = `/3/movie/${identifier}`;
    const url = new URL(path, this.host);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => Movie.convertFromTmdbResponse(response));
  }

  async movieCredits(identifier) {
    const path = `/3/movie/${identifier}/credits`;
    const url = new URL(path, this.host);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => Credits.convertFromTmdbResponse(response));
  }

  async movieReleaseDates(identifier) {
    const path = `/3/movie/${identifier}/release_dates`;
    const url = new URL(path, this.host);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => ReleaseDates.convertFromTmdbResponse(response));
  }

  async movieDiscover(id, page = 1) {
    const params = new URLSearchParams(DISCOVER_DICT[id]);
    params.append("page", page);

    const path = `/3/discover/movie?${params.toString()}`;
    const url = new URL(path, this.host);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => TMDB.mapResults(response, "movie"));
  }

  // ----- TV/SHOW FUNCTIONS -----
  async showInfo(identifier) {
    const path = `/3/show/${identifier}`;
    const url = new URL(path, this.host);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => Show.convertFromTmdbResponse(response));
  }

  async showCredits(identifier) {
    const path = `/3/tv/${identifier}/credits`;
    const url = new URL(path, this.host);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => Credits.convertFromTmdbResponse(response));
  }

  // ----- PERSON FUNCTIONS -----
  async personInfo(identifier) {
    const path = `/3/person/${identifier}`;
    const url = new URL(path, this.host);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => Person.convertFromTmdbResponse(response));
  }

  async personCredits(identifier) {
    const path = `/3/person/${identifier}/credits`;
    const url = new URL(path, this.host);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => Credits.convertFromTmdbResponse(response));
  }

  // ----- SEARCH FUNCTIONS -----
  async search(query, type, page = 1, includeAdult = true) {
    if (!this.validSearchTypes.includes(type)) {
      throw new Error("Invalid search type requested!");
    }

    const params = new URLSearchParams();
    params.append("query", query);
    params.append("page", page);
    params.append("include_adult", includeAdult);

    const path = `/3/search/${type}?${params.toString()}`;
    const url = new URL(path, this.host);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => TMDB.mapResults(response, type));
  }

  // ----- LIST FUNCTIONS -----
  async list(listName, type, page = 1) {
    const params = new URLSearchParams();
    params.append("page", page);

    const path = `/3/${type}/${listName}?${params.toString()}`;
    const url = new URL(path, this.host);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => TMDB.mapResults(response, type));
  }

  // ----- HELPER FUNCTIONS -----
  // Maps our response from tmdb api to a movie/show object.
  static mapResults(response, type = null) {
    const results = response?.results?.map(result => {
      if (type === "movie" || result.media_type === "movie") {
        const movie = Movie.convertFromTmdbResponse(result);
        return movie.createJsonResponse();
      }
      if (type === "show" || result.media_type === "tv") {
        const show = Show.convertFromTmdbResponse(result);
        return show.createJsonResponse();
      }
      if (type === "person" || result.media_type === "person") {
        const person = Person.convertFromTmdbResponse(result);
        return person.createJsonResponse();
      }

      return {};
    });

    return {
      results,
      page: response?.page,
      total_results: response?.total_results,
      total_pages: response?.total_pages
    };
  }

  // Checks existance of key in DISCOVER_DICT
  static discoverableExists(key) {
    return Object.keys(DISCOVER_DICT).includes(key);
  }
}

export default TMDB;
