import { useState, useEffect } from 'react';
import { runsService } from '../services/runs.service';
import type { Run, PageResponse } from '../types/api.types';

interface UseRunsOptions {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
  game?: string;
}

export function useRuns(options?: UseRunsOptions) {
  const [runs, setRuns] = useState<Run[]>([]);
  const [pagination, setPagination] = useState<Omit<PageResponse<Run>, 'content'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRuns = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let response: PageResponse<Run>;
      
      // Se houver filtro de jogo, usa o endpoint específico
      if (options?.game && options.game !== 'all') {
        response = await runsService.getRunsByGame(options.game, {
          page: options.page,
          size: options.size,
        });
      } 
      // Caso contrário, busca todas
      else {
        response = await runsService.getAllRuns({
          page: options?.page,
          size: options?.size,
          sort: options?.sort,
        });
      }
      
      // Se há termo de busca, filtra no frontend por username ou pokemon
      if (options?.search && options.search.trim() !== '') {
        const searchLower = options.search.toLowerCase().trim();
        const filteredContent = response.content.filter(run => 
          run.user.username.toLowerCase().includes(searchLower) ||
          run.pokemonTeam.some(pokemon => pokemon.toLowerCase().includes(searchLower))
        );
        
        setRuns(filteredContent);
        
        // Atualiza paginação para refletir o filtro
        setPagination({
          pageable: response.pageable,
          totalPages: 1, // Como filtramos no frontend, só temos 1 página
          totalElements: filteredContent.length,
          last: true,
          first: true,
          size: filteredContent.length,
          number: 0,
          numberOfElements: filteredContent.length,
          empty: filteredContent.length === 0,
        });
      } else {
        setRuns(response.content);
        setPagination({
          pageable: response.pageable,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          last: response.last,
          first: response.first,
          size: response.size,
          number: response.number,
          numberOfElements: response.numberOfElements,
          empty: response.empty,
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar runs');
      setRuns([]);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRuns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.page, options?.size, options?.sort, options?.search, options?.game]);

  return { runs, pagination, isLoading, error, refetch: fetchRuns };
}

export function useRun(id: number | string) {
  const [run, setRun] = useState<Run | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRun = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await runsService.getRunById(Number(id));
        setRun(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar run');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRun();
    }
  }, [id]);

  return { run, isLoading, error };
}

// Hook para buscar jogos disponíveis dinamicamente
export function useAvailableGames() {
  const [games, setGames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const stats = await runsService.getCountByGame();
        // Extrai os nomes dos jogos únicos
        const gameNames = stats.map(stat => stat.game);
        setGames(gameNames);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar jogos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  return { games, isLoading, error };
}
