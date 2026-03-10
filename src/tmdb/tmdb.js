import {
  TMDBNotFoundError,
  TMDBUnauthorizedError,
  TMDBUnexpectedError,
  TMDBNotReachableError
} from "./errors.js";
import { Movie, Show, Person, Credits, ReleaseDates } from "./types.js";

const tmdbErrorResponse = (error, type = null) => {
  if (error?.status === 404) {
    const message = error?.response?.body?.status_message;

    throw new TMDBNotFoundError(`${message.slice(0, -1)} in tmdb.`);
  } else if (error?.status === 401) {
    throw new TMDBUnauthorizedError(error?.response?.body?.status_message);
  } else if (error?.code === "ENOTFOUND") {
    throw new TMDBNotReachableError();
  }

  throw new TMDBUnexpectedError(type, error.message);
};

const DISCOVER_DICT = {
  popular_now: "sort_by=popularity.desc&vote_count.gte=200&include_adult=false",
  top_rated: "sort_by=vote_average.desc&vote_count.gte=2000",
  critics_choice:
    "vote_average.gte=8&vote_count.gte=1000&sort_by=vote_average.desc",
  hidden_gems:
    "vote_average.gte=7.5&vote_count.gte=100&vote_count.lte=500&sort_by=vote_average.desc",
  modern_classics:
    "primary_release_date.gte=2020-01-01&vote_average.gte=7.5&vote_count.gte=500&sort_by=vote_average.desc",
  blockbusters: "sort_by=revenue.desc&vote_count.gte=500",
  quick_picks:
    "with_runtime.gte=70&with_runtime.lte=100&vote_average.gte=6.5&vote_count.gte=300&sort_by=vote_average.desc",
  epic_movies:
    "with_runtime.gte=150&vote_average.gte=7&vote_count.gte=500&sort_by=vote_average.desc",
  feel_good:
    "with_genres=35,10751&vote_average.gte=6.5&vote_count.gte=300&sort_by=popularity.desc",
  mind_benders:
    "with_genres=53,9648&vote_average.gte=7&vote_count.gte=500&sort_by=vote_average.desc",
  action_packed:
    "with_genres=28&vote_average.gte=6.5&vote_count.gte=500&sort_by=popularity.desc",
  sci_fi_wonders:
    "with_genres=878&vote_average.gte=6.8&vote_count.gte=400&sort_by=vote_average.desc",
  horror_hits:
    "with_genres=27&vote_average.gte=6.5&vote_count.gte=300&sort_by=popularity.desc",
  romantic_favorites:
    "with_genres=10749&vote_average.gte=6.8&vote_count.gte=300&sort_by=vote_average.desc",
  laugh_out_loud:
    "with_genres=35&vote_average.gte=6.5&vote_count.gte=400&sort_by=vote_average.desc",
  animated_magic:
    "with_genres=16&vote_average.gte=7&vote_count.gte=300&sort_by=vote_average.desc",
  fantasy_worlds:
    "with_genres=14&vote_average.gte=6.5&vote_count.gte=300&sort_by=popularity.desc",
  true_stories:
    "with_genres=99,36&vote_average.gte=7&vote_count.gte=200&sort_by=vote_average.desc",
  crime_dramas:
    "with_genres=80,9648&vote_average.gte=7&vote_count.gte=400&sort_by=vote_average.desc",
  war_epics:
    "with_genres=10752&vote_average.gte=7&vote_count.gte=300&sort_by=vote_average.desc",
  westerns:
    "with_genres=37&vote_average.gte=6.5&vote_count.gte=200&sort_by=vote_average.desc",
  family_night:
    "with_genres=10751&vote_average.gte=6.5&vote_count.gte=300&sort_by=popularity.desc",
  international_cinema:
    "with_original_language=fr|es|de|ja|ko|it&vote_average.gte=7&vote_count.gte=200&sort_by=vote_average.desc",
  "90s_nostalgia":
    "primary_release_date.gte=1990-01-01&primary_release_date.lte=1999-12-31&vote_average.gte=6.5&vote_count.gte=500&sort_by=popularity.desc",
  "2000s_classics":
    "primary_release_date.gte=2000-01-01&primary_release_date.lte=2009-12-31&vote_average.gte=6.8&vote_count.gte=500&sort_by=vote_average.desc",
  "2010s_best":
    "primary_release_date.gte=2010-01-01&primary_release_date.lte=2019-12-31&vote_average.gte=7&vote_count.gte=500&sort_by=vote_average.desc",
  golden_age:
    "primary_release_date.lte=1979-12-31&vote_average.gte=7.5&vote_count.gte=300&sort_by=vote_average.desc",
  recent_releases:
    "primary_release_date.gte=2025-01-01&vote_count.gte=50&sort_by=popularity.desc",
  crowd_pleasers:
    "vote_count.gte=3000&vote_average.gte=7&sort_by=vote_count.desc",
  indie_darlings:
    "vote_average.gte=7.5&vote_count.gte=150&vote_count.lte=800&without_genres=28,12,14,878&sort_by=vote_average.desc",
  thriller_edge:
    "with_genres=53&vote_average.gte=7&vote_count.gte=500&sort_by=vote_average.desc",
  dark_comedy:
    "with_genres=35,80&vote_average.gte=6.8&vote_count.gte=300&sort_by=vote_average.desc",
  musical_magic:
    "with_genres=10402&vote_average.gte=6.5&vote_count.gte=200&sort_by=vote_average.desc",
  space_odyssey:
    "with_genres=878&with_keywords=9663,10683&vote_average.gte=6.5&vote_count.gte=200&sort_by=popularity.desc",
  superhero_saga:
    "with_genres=28,12,14&with_keywords=9715,180547&vote_average.gte=6.5&vote_count.gte=500&sort_by=popularity.desc",
  oscar_winners:
    "vote_average.gte=7.5&vote_count.gte=1500&sort_by=vote_average.desc",
  coming_of_age:
    "with_genres=18&with_keywords=4344&vote_average.gte=6.8&vote_count.gte=200&sort_by=vote_average.desc",
  heist_films:
    "with_genres=80,53&with_keywords=157186&vote_average.gte=6.5&vote_count.gte=300&sort_by=vote_average.desc",
  zombies_apocalypse:
    "with_genres=27&with_keywords=12377&vote_average.gte=6&vote_count.gte=200&sort_by=popularity.desc",
  time_travel:
    "with_keywords=4379&vote_average.gte=6.5&vote_count.gte=300&sort_by=vote_average.desc"
};

class TMDB {
  constructor(apiKey, cache) {
    this.host = "https://api.themoviedb.org";
    this.apiKey = apiKey;

    this.cache = cache || redisCache;
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

  async fetchTmdb(url, options) {
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
      tmdbErrorResponse(error, tmdbMethod)
    );
  }

  // ----- MOVIE FUNCTIONS -----
  async movieInfo(identifier) {
    const path = `/v3/movie/${identifier}`;
    const url = new URL(this.host, path);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => Movie.convertFromTmdbResponse(response));
  }

  async movieCredits(identifier) {
    const path = `/v3/movie/${identifier}/credits`;
    const url = new URL(this.host, path);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => Credits.convertFromTmdbResponse(response));
  }

  async movieReleaseDates(identifier) {
    const path = `/v3/movie/${identifier}/release_dates`;
    const url = new URL(this.host, path);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => ReleaseDates.convertFromTmdbResponse(response));
  }

  async movieDiscover(id, page = 1) {
    const params = new URLSearchParams(DISCOVER_DICT[id]);
    params.append("page", page);

    const path = `/v3/discover/movie?${params.toString()}`;
    const url = new URL(this.host, path);

    return this.fetchTmdb(url.href, options)
      .then(resp => resp.json())
      .then(response => Movie.convertFromTmdbResponse(response));
  }

  // ----- TV/SHOW FUNCTIONS -----
  async showInfo(identifier) {
    const path = `/v3/show/${identifier}`;
    const url = new URL(this.host, path);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => Show.convertFromTmdbResponse(response));
  }

  async showCredits(identifier) {
    const path = `/v3/tv/${identifier}/credits`;
    const url = new URL(this.host, path);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => Credits.convertFromTmdbResponse(response));
  }

  // ----- PERSON FUNCTIONS -----
  async personInfo(identifier) {
    const path = `/v3/person/${identifier}`;
    const url = new URL(this.host, path);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => Person.convertFromTmdbResponse(response));
  }

  async personCredits(identifier) {
    const path = `/v3/person/${identifier}/credits`;
    const url = new URL(this.host, path);

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

    const path = `/v3/search/${type}?${params.toString()}`;
    const url = new URL(this.host, path);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => mapResults(response, type));
  }

  // ----- LIST FUNCTIONS -----
  async list(listName, type, page = 1) {
    const params = new URLSearchParams();
    params.append("page", page);

    const path = `/v3/${type}/${listName}?${params.toString()}`;
    const url = new URL(this.host, path);

    return this.fetchTmdb(url.href)
      .then(resp => resp.json())
      .then(response => mapResults(response, type));
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
