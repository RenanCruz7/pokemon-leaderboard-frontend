import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { runsService } from '../../services/runs.service';
import { useToast } from '../../hooks/useToast';
import type { Run } from '../../types/api.types';

export function MyRunsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [runs, setRuns] = useState<Run[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [runToDelete, setRunToDelete] = useState<number | null>(null);
  const [runToEdit, setRunToEdit] = useState<Run | null>(null);
  const [editForm, setEditForm] = useState({
    game: '',
    runTime: '',
    pokedexStatus: 0,
    pokemonTeam: [] as string[],
    observation: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    game: 'all',
    sortBy: 'runTime',
    sortOrder: 'asc' as 'asc' | 'desc',
  });

  const fetchMyRuns = async () => {
    try {
      setIsLoading(true);
      const response = await runsService.getMyRuns({
        page: currentPage,
        size: 10,
      });
      
      let filteredRuns = response.content;
      
      // Aplicar filtro de jogo
      if (filters.game !== 'all') {
        filteredRuns = filteredRuns.filter(run => run.game === filters.game);
      }
      
      // Aplicar ordenação
      filteredRuns.sort((a, b) => {
        if (filters.sortBy === 'runTime') {
          const timeA = a.runTime.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
          const timeB = b.runTime.split(':').reduce((acc, time) => (60 * acc) + +time, 0);
          return filters.sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
        } else if (filters.sortBy === 'pokedexStatus') {
          return filters.sortOrder === 'asc' 
            ? a.pokedexStatus - b.pokedexStatus 
            : b.pokedexStatus - a.pokedexStatus;
        }
        return 0;
      });
      
      setRuns(filteredRuns);
      setTotalPages(response.totalPages);
    } catch (error) {
      showToast('Erro ao carregar suas runs', 'error');
      console.error('Erro ao buscar runs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRuns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  const handleEdit = (run: Run) => {
    setRunToEdit(run);
    setEditForm({
      game: run.game,
      runTime: run.runTime,
      pokedexStatus: run.pokedexStatus,
      pokemonTeam: run.pokemonTeam,
      observation: run.observation,
    });
  };

  const handleSaveEdit = async () => {
    if (!runToEdit) return;

    try {
      await runsService.updateRun(runToEdit.id, editForm);
      showToast('Run atualizada com sucesso!', 'success');
      setRunToEdit(null);
      fetchMyRuns();
    } catch (error) {
      showToast('Erro ao atualizar run', 'error');
      console.error('Erro ao atualizar run:', error);
    }
  };

  const handleCancelEdit = () => {
    setRunToEdit(null);
    setEditForm({
      game: '',
      runTime: '',
      pokedexStatus: 0,
      pokemonTeam: [],
      observation: '',
    });
  };

  const handleDelete = (runId: number) => {
    setRunToDelete(runId);
  };

  const confirmDelete = async () => {
    if (runToDelete) {
      try {
        await runsService.deleteRun(runToDelete);
        showToast('Run deletada com sucesso!', 'success');
        setRunToDelete(null);
        fetchMyRuns(); // Recarrega a lista
      } catch (error) {
        showToast('Erro ao deletar run', 'error');
        console.error('Erro ao deletar run:', error);
      }
    }
  };

  const cancelDelete = () => {
    setRunToDelete(null);
  };

  const totalRuns = runs.length;
  const totalPokedex = runs.reduce((sum, run) => sum + run.pokedexStatus, 0);
  const avgPokedex = totalRuns > 0 ? Math.round(totalPokedex / totalRuns) : 0;
  const bestTime = runs.length > 0 ? runs[0]?.runTime || '-' : '-';

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark">Carregando suas runs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-2">
          Minhas Runs
        </h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          Gerencie suas runs e acompanhe seu progresso
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-component-light dark:bg-component-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Total de Runs
              </p>
              <p className="text-3xl font-bold text-primary">{totalRuns}</p>
            </div>
            <span className="material-symbols-outlined text-primary text-4xl">
              sports_score
            </span>
          </div>
        </div>

        <div className="bg-component-light dark:bg-component-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Pokédex Média
              </p>
              <p className="text-3xl font-bold text-accent-blue">{avgPokedex}</p>
            </div>
            <span className="material-symbols-outlined text-accent-blue text-4xl">
              format_list_numbered
            </span>
          </div>
        </div>

        <div className="bg-component-light dark:bg-component-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Melhor Tempo
              </p>
              <p className="text-3xl font-bold text-accent-green">{bestTime}</p>
            </div>
            <span className="material-symbols-outlined text-accent-green text-4xl">
              timer
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => navigate('/submit')}
          className="px-6 py-3 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Nova Run
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-6 py-3 border border-border-light dark:border-border-dark rounded-lg font-medium hover:bg-background-light dark:hover:bg-background-dark transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined">filter_list</span>
          Filtros
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-component-light dark:bg-component-dark p-6 rounded-lg border border-border-light dark:border-border-dark mb-6">
          <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-4">Filtros</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Jogo */}
            <div>
              <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                Jogo
              </label>
              <select
                value={filters.game}
                onChange={(e) => setFilters({ ...filters, game: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              >
                <option value="all">Todos os jogos</option>
                {Array.from(new Set(runs.map(r => r.game))).map(game => (
                  <option key={game} value={game}>{game}</option>
                ))}
              </select>
            </div>

            {/* Ordenar por */}
            <div>
              <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                Ordenar por
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              >
                <option value="runTime">Tempo</option>
                <option value="pokedexStatus">Pokédex</option>
              </select>
            </div>

            {/* Ordem */}
            <div>
              <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                Ordem
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value as 'asc' | 'desc' })}
                className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              >
                <option value="asc">Crescente</option>
                <option value="desc">Decrescente</option>
              </select>
            </div>
          </div>

          {/* Botão de Limpar Filtros */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setFilters({ game: 'all', sortBy: 'runTime', sortOrder: 'asc' })}
              className="px-4 py-2 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Runs List */}
      <div className="space-y-4">
        {runs.map((run) => (
          <div
            key={run.id}
            className="bg-component-light dark:bg-component-dark p-6 rounded-lg border border-border-light dark:border-border-dark hover:border-primary transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Run Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark">
                    {run.game}
                  </h3>
                  <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    {run.runTime}
                  </span>
                </div>

                <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
                  {run.observation}
                </p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-accent-blue" style={{ fontSize: 20 }}>
                      format_list_numbered
                    </span>
                    <span className="text-text-light dark:text-text-dark font-medium">
                      Pokédex: {run.pokedexStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-accent-green" style={{ fontSize: 20 }}>
                      groups
                    </span>
                    <span className="text-text-light dark:text-text-dark font-medium">
                      Time: {run.pokemonTeam.length}
                    </span>
                  </div>
                </div>

                {/* Pokemon Team */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {run.pokemonTeam.map((pokemon) => (
                    <span
                      key={pokemon}
                      className="px-3 py-1 bg-background-light dark:bg-background-dark rounded-full text-xs font-medium text-text-light dark:text-text-dark border border-border-light dark:border-border-dark"
                    >
                      {pokemon}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col gap-2">
                <button
                  onClick={() => navigate(`/run/${run.id}`)}
                  className="flex-1 md:flex-none px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors flex items-center justify-center gap-2"
                  title="Ver detalhes"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    visibility
                  </span>
                  <span className="md:hidden">Detalhes</span>
                </button>
                <button
                  onClick={() => handleEdit(run)}
                  className="flex-1 md:flex-none px-4 py-2 bg-accent-yellow text-background-dark rounded-lg hover:bg-accent-yellow/90 transition-colors flex items-center justify-center gap-2"
                  title="Editar"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    edit
                  </span>
                  <span className="md:hidden">Editar</span>
                </button>
                <button
                  onClick={() => handleDelete(run.id)}
                  className="flex-1 md:flex-none px-4 py-2 bg-accent-red text-white rounded-lg hover:bg-accent-red/90 transition-colors flex items-center justify-center gap-2"
                  title="Deletar"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    delete
                  </span>
                  <span className="md:hidden">Deletar</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (se não houver runs) */}
      {runs.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-6xl mb-4">
            inbox
          </span>
          <h3 className="text-xl font-medium text-text-light dark:text-text-dark mb-2">
            Nenhuma run encontrada
          </h3>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
            Comece registrando sua primeira run!
          </p>
          <button
            onClick={() => navigate('/submit')}
            className="px-6 py-3 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Registrar Primeira Run
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Página {currentPage + 1} de {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {runToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-component-light dark:bg-component-dark rounded-lg p-6 max-w-md w-full border border-border-light dark:border-border-dark">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-accent-red text-3xl">
                warning
              </span>
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark">
                Confirmar Exclusão
              </h3>
            </div>
            
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">
              Tem certeza que deseja deletar esta run? Esta ação não pode ser desfeita.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-6 py-2.5 border border-border-light dark:border-border-dark rounded-lg font-medium hover:bg-background-light dark:hover:bg-background-dark transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-6 py-2.5 bg-accent-red text-white rounded-lg font-medium hover:bg-accent-red/90 transition-colors"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {runToEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-component-light dark:bg-component-dark rounded-lg p-6 max-w-2xl w-full border border-border-light dark:border-border-dark my-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">
                edit
              </span>
              <h3 className="text-2xl font-bold text-text-light dark:text-text-dark">
                Editar Run
              </h3>
            </div>
            
            <div className="space-y-4">
              {/* Game (read-only) */}
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Jogo
                </label>
                <input
                  type="text"
                  value={editForm.game}
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light/50 dark:bg-background-dark/50 text-text-secondary-light dark:text-text-secondary-dark cursor-not-allowed"
                />
              </div>

              {/* Run Time */}
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Tempo *
                </label>
                <input
                  type="text"
                  value={editForm.runTime}
                  onChange={(e) => setEditForm({ ...editForm, runTime: e.target.value })}
                  placeholder="HH:MM (ex: 04:30)"
                  className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              {/* Pokedex Status */}
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Pokédex Completude *
                </label>
                <input
                  type="number"
                  value={editForm.pokedexStatus}
                  onChange={(e) => setEditForm({ ...editForm, pokedexStatus: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              {/* Observation */}
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                  Observação
                </label>
                <textarea
                  value={editForm.observation}
                  onChange={(e) => setEditForm({ ...editForm, observation: e.target.value })}
                  rows={4}
                  placeholder="Adicione suas observações sobre esta run..."
                  className="w-full px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                />
              </div>
            </div>
            
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-2.5 border border-border-light dark:border-border-dark rounded-lg font-medium hover:bg-background-light dark:hover:bg-background-dark transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2.5 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
