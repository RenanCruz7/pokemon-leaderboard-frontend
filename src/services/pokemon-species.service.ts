import axios from 'axios';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export interface PokemonSpeciesName {
  name: string;
  language: {
    name: string;
    url: string;
  };
}

export interface PokemonSpeciesGenus {
  genus: string;
  language: {
    name: string;
    url: string;
  };
}

export interface PokemonSpeciesFlavorText {
  flavor_text: string;
  language: {
    name: string;
    url: string;
  };
  version: {
    name: string;
    url: string;
  };
}

export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  generation: {
    name: string;
    url: string;
  };
  names: PokemonSpeciesName[];
  genera: PokemonSpeciesGenus[];
  flavor_text_entries: PokemonSpeciesFlavorText[];
  varieties: Array<{
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }>;
  evolution_chain: {
    url: string;
  };
  color: {
    name: string;
    url: string;
  };
  shape: {
    name: string;
    url: string;
  };
  habitat: {
    name: string;
    url: string;
  } | null;
}

export interface PokemonSpeciesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export const pokemonSpeciesService = {
  /**
   * Busca a lista de pokemon species com paginação
   */
  async getSpeciesList(offset: number = 0, limit: number = 20): Promise<PokemonSpeciesListResponse> {
    const response = await axios.get<PokemonSpeciesListResponse>(
      `${POKEAPI_BASE_URL}/pokemon-species?offset=${offset}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Busca detalhes de uma espécie específica
   */
  async getSpeciesDetails(nameOrId: string | number): Promise<PokemonSpecies> {
    const response = await axios.get<PokemonSpecies>(
      `${POKEAPI_BASE_URL}/pokemon-species/${nameOrId}`
    );
    return response.data;
  },

  /**
   * Busca detalhes de múltiplas espécies em paralelo
   */
  async getMultipleSpecies(names: string[]): Promise<PokemonSpecies[]> {
    const promises = names.map(name => this.getSpeciesDetails(name));
    return Promise.all(promises);
  },
};
