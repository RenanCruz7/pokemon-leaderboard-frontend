export interface Run {
  id: number;
  game: string;
  time: string;
  pokedex: string;
  team: string;
  user: string;
}

export interface RunDetails {
  id: number;
  game: string;
  time: string;
  pokedex: number;
  team: string[];
  user: string;
  notes: string;
}

export interface SubmitRunFormData {
  gameName: string;
  runTime: string;
  pokedexStatus: string;
  pokemonTeam: string;
  notes: string;
}
