import api from './api';
import type {
  Run,
  CreateRunRequest,
  UpdateRunRequest,
  PageResponse,
  RunsCountByGame,
  AvgRunTimeByGame,
  TopPokemon,
} from '../types/api.types';

export const runsService = {
  // CRUD Operations
  async createRun(data: CreateRunRequest): Promise<Run> {
    const response = await api.post<Run>('/runs', data);
    return response.data;
  },

  async getAllRuns(params?: {
    page?: number;
    size?: number;
    sort?: string;
  }): Promise<PageResponse<Run>> {
    const response = await api.get<PageResponse<Run>>('/runs', { params });
    return response.data;
  },

  async getMyRuns(params?: {
    page?: number;
    size?: number;
  }): Promise<PageResponse<Run>> {
    const response = await api.get<PageResponse<Run>>('/runs/me', { params });
    return response.data;
  },

  async getRunById(id: number): Promise<Run> {
    const response = await api.get<Run>(`/runs/${id}`);
    return response.data;
  },

  async updateRun(id: number, data: UpdateRunRequest): Promise<Run> {
    const response = await api.patch<Run>(`/runs/${id}`, data);
    return response.data;
  },

  async deleteRun(id: number): Promise<void> {
    await api.delete(`/runs/${id}`);
  },

  // Filters & Search
  async getRunsByGame(
    game: string,
    params?: { page?: number; size?: number }
  ): Promise<PageResponse<Run>> {
    const response = await api.get<PageResponse<Run>>(`/runs/game/${encodeURIComponent(game)}`, {
      params,
    });
    return response.data;
  },

  async getFastestRuns(
    maxTime: string,
    params?: { page?: number; size?: number }
  ): Promise<PageResponse<Run>> {
    const response = await api.get<PageResponse<Run>>('/runs/fastest', {
      params: { maxTime, ...params },
    });
    return response.data;
  },

  async getRunsByPokedex(
    minStatus: number,
    params?: { page?: number; size?: number }
  ): Promise<PageResponse<Run>> {
    const response = await api.get<PageResponse<Run>>('/runs/pokedex', {
      params: { minStatus, ...params },
    });
    return response.data;
  },

  async getRunsByPokemon(
    pokemon: string,
    params?: { page?: number; size?: number }
  ): Promise<PageResponse<Run>> {
    const response = await api.get<PageResponse<Run>>('/runs/team', {
      params: { pokemon, ...params },
    });
    return response.data;
  },

  // Statistics
  async getCountByGame(): Promise<RunsCountByGame[]> {
    const response = await api.get<RunsCountByGame[]>('/runs/stats/count-by-game');
    return response.data;
  },

  async getAvgTimeByGame(): Promise<AvgRunTimeByGame[]> {
    const response = await api.get<AvgRunTimeByGame[]>('/runs/stats/avg-time-by-game');
    return response.data;
  },

  async getTopPokemons(): Promise<TopPokemon[]> {
    const response = await api.get<TopPokemon[]>('/runs/stats/top-pokemons');
    return response.data;
  },

  // Export
  async exportToCSV(): Promise<string> {
    const response = await api.get<string>('/runs/export/csv');
    return response.data;
  },
};
