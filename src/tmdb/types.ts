interface Movie {
  adult: boolean;
  backdrop: string;
  genres: Genre[];
  id: number;
  imdb_id: number;
  overview: string;
  popularity: number;
  poster: string;
  release_date: Date;
  rank: number;
  runtime: number;
  status: string;
  tagline: string;
  title: string;
  vote_count: number;
}

interface Show {
  adult: boolean;
  backdrop: string;
  episodes: number;
  genres: Genre[];
  id: number;
  imdb_id: number;
  overview: string;
  popularity: number;
  poster: string;
  rank: number;
  runtime: number;
  seasons: number;
  status: string;
  tagline: string;
  title: string;
  vote_count: number;
}

interface Person {
  birthday: Date;
  deathday: Date;
  id: number;
  known_for: string;
  name: string;
  poster: string;
}

interface SearchResult {
  adult: boolean;
  backdrop_path: string;
  id: number;
  original_title: string;
  release_date: Date;
  poster_path: string;
  popularity: number;
  vote_average: number;
  vote_counte: number;
}

interface Genre {
  id: number;
  name: string;
}

export { Movie, Show, Person, Genre };
