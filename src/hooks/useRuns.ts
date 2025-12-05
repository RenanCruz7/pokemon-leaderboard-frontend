import { useState, useEffect } from 'react';
import { runsService } from '../services/runs.service';
import type { Run, PageResponse } from '../types/api.types';

interface UseRunsOptions {
  page?: number;
  size?: number;
  sort?: string;
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
      const response = await runsService.getAllRuns(options);
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar runs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRuns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options?.page, options?.size, options?.sort]);

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
