import axios from 'axios';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

interface PokemonSprites {
  front_default: string;
  other?: {
    'official-artwork'?: {
      front_default: string;
    };
    home?: {
      front_default: string;
    };
  };
}

interface PokemonResponse {
  name: string;
  sprites: PokemonSprites;
}

export const pokemonService = {
  /**
   * Busca o sprite de um Pokémon pelo nome
   * @param name Nome do Pokémon (case-insensitive)
   * @returns URL do sprite oficial ou null se não encontrado
   */
  async getPokemonSprite(name: string): Promise<string | null> {
    try {
      const normalizedName = name.toLowerCase().trim();
      const response = await axios.get<PokemonResponse>(
        `${POKEAPI_BASE_URL}/pokemon/${normalizedName}`
      );
      
      // Prioridade: Official Artwork > Home > Front Default
      return (
        response.data.sprites.other?.['official-artwork']?.front_default ||
        response.data.sprites.other?.home?.front_default ||
        response.data.sprites.front_default
      );
    } catch (error) {
      console.warn(`Sprite não encontrado para: ${name}`, error);
      return null;
    }
  },

  /**
   * Busca sprites de múltiplos Pokémons em paralelo
   * @param names Array de nomes de Pokémons
   * @returns Map com nome => URL do sprite
   */
  async getPokemonSprites(names: string[]): Promise<Map<string, string | null>> {
    const promises = names.map(async (name) => {
      const sprite = await this.getPokemonSprite(name);
      return [name, sprite] as [string, string | null];
    });

    const results = await Promise.all(promises);
    return new Map(results);
  },
};
