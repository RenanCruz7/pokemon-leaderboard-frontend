// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface UserSummary {
  id: number;
  username: string;
  email: string;
}

// Auth Types
export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Run Types
export interface Run {
  id: number;
  game: string;
  runTime: string;
  pokedexStatus: number;
  pokemonTeam: string[];
  observation: string;
  user: UserSummary;
}

export interface CreateRunRequest {
  game: string;
  runTime: string;
  pokedexStatus: number;
  pokemonTeam?: string[];
  observation?: string;
}

export interface UpdateRunRequest {
  game: string;
  runTime: string;
  pokedexStatus: number;
  pokemonTeam?: string[];
  observation?: string;
}

// Pagination Types
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      empty: boolean;
      unsorted: boolean;
    };
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}

// Statistics Types
export interface RunsCountByGame {
  game: string;
  count: number;
}

export interface AvgRunTimeByGame {
  game: string;
  avgRunTime: number;
}

export interface TopPokemon {
  pokemon: string;
  count: number;
}

// Error Types
export interface ApiError {
  erro: string;
  detalhes: string;
}
