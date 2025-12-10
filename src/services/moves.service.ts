import axios from 'axios';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export interface MoveEffect {
  effect: string;
  short_effect: string;
  language: {
    name: string;
    url: string;
  };
}

export interface Move {
  id: number;
  name: string;
  accuracy: number | null;
  pp: number;
  priority: number;
  power: number | null;
  type: {
    name: string;
    url: string;
  };
  damage_class: {
    name: string;
    url: string;
  };
  effect_entries: MoveEffect[];
}

export interface MoveListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export const movesService = {
  /**
   * Busca a lista de moves com paginação
   * @param offset Índice inicial
   * @param limit Quantidade de itens
   */
  async getMovesList(offset: number = 0, limit: number = 20): Promise<MoveListResponse> {
    const response = await axios.get<MoveListResponse>(
      `${POKEAPI_BASE_URL}/move?offset=${offset}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Busca detalhes de um move específico
   * @param nameOrId Nome ou ID do move
   */
  async getMoveDetails(nameOrId: string | number): Promise<Move> {
    const response = await axios.get<Move>(
      `${POKEAPI_BASE_URL}/move/${nameOrId}`
    );
    return response.data;
  },

  /**
   * Busca detalhes de múltiplos moves em paralelo
   * @param names Array de nomes de moves
   */
  async getMovesDetails(names: string[]): Promise<Move[]> {
    const promises = names.map(name => this.getMoveDetails(name));
    return Promise.all(promises);
  },
};
