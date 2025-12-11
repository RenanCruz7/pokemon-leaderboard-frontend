import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useRuns, useAvailableGames } from '../../hooks/useRuns';
import { useAuthStore } from '../../stores/authStore';

export const LeaderboardTable = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [gameFilter, setGameFilter] = useState('all');
  
  const { games, isLoading: gamesLoading } = useAvailableGames();
  const { runs, pagination, isLoading, error } = useRuns({ 
    page, 
    size, 
    sort: 'runTime,asc',
    search: searchTerm,
    game: gameFilter,
  });

  // Debounce para busca (aguarda 500ms após o usuário parar de digitar)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(0); // Reseta para primeira página ao buscar
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  if (isLoading && runs.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark">Carregando runs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-accent-red text-5xl">
            error
          </span>
          <p className="mt-4 text-text-light dark:text-text-dark font-medium text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full bg-component-light dark:bg-component-dark p-4 rounded-lg border border-border-light dark:border-border-dark flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label className="sr-only" htmlFor="search-input">Search</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark" style={{ fontSize: 20 }}>search</span>
            </div>
            <input 
              id="search-input" 
              placeholder="Search by user or Pokémon..." 
              className="form-input block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark pl-10 pr-3 py-2 text-sm focus:border-primary focus:ring-primary/50" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            )}
          </div>
        </div>
        <div className="w-full md:w-auto md:min-w-[200px]">
          <label className="sr-only" htmlFor="game-filter">Filter by game</label>
          <select 
            id="game-filter" 
            className="form-select w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm focus:border-primary focus:ring-primary/50"
            value={gameFilter}
            onChange={(e) => {
              setGameFilter(e.target.value);
              setPage(0); // Reseta para primeira página ao filtrar
            }}
            disabled={gamesLoading}
          >
            <option value="all">All Games</option>
            {games.map((game) => (
              <option key={game} value={game}>{game}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Indicador de filtros ativos */}
      {(searchTerm || gameFilter !== 'all') && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Filtros ativos:
          </span>
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>search</span>
              {searchTerm}
              <button 
                onClick={() => setSearchInput('')}
                className="ml-1 hover:bg-primary/20 rounded-full"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
              </button>
            </span>
          )}
          {gameFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>videogame_asset</span>
              {gameFilter}
              <button 
                onClick={() => setGameFilter('all')}
                className="ml-1 hover:bg-primary/20 rounded-full"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
              </button>
            </span>
          )}
        </div>
      )}

      {runs.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center py-12 bg-component-light dark:bg-component-dark rounded-lg border border-border-light dark:border-border-dark">
          <div className="text-center">
            <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-5xl">
              {searchTerm || gameFilter !== 'all' ? 'search_off' : 'inbox'}
            </span>
            <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark font-medium">
              {searchTerm || gameFilter !== 'all' 
                ? 'Nenhuma run encontrada com esses filtros' 
                : 'Nenhuma run cadastrada ainda'}
            </p>
            {(searchTerm || gameFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setGameFilter('all');
                }}
                className="mt-4 px-4 py-2 bg-primary text-background-dark rounded-lg hover:bg-primary/90 transition-colors"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {runs.map((run, index) => {
            const isUserRun = user && run.user.username === user.username;
            const position = page * size + index + 1;
            const getMedalColor = (pos: number) => {
              if (pos === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-500/50';
              if (pos === 2) return 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900 shadow-lg shadow-gray-400/50';
              if (pos === 3) return 'bg-gradient-to-br from-orange-400 to-orange-700 text-white shadow-lg shadow-orange-500/50';
              return 'bg-component-light dark:bg-component-dark text-text-light dark:text-text-dark';
            };

            return (
              <div
                key={run.id}
                onClick={() => navigate(`/run/${run.id}`)}
                className={`group bg-component-light dark:bg-component-dark rounded-xl border-2 transition-all cursor-pointer hover:shadow-lg ${
                  isUserRun
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-border-light dark:border-border-dark hover:border-primary'
                }`}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-4">
                    {/* Position Badge */}
                    <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-black text-lg sm:text-xl ${getMedalColor(position)}`}>
                      {position <= 3 ? (
                        <span className="material-symbols-outlined text-2xl sm:text-3xl">emoji_events</span>
                      ) : (
                        position
                      )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-text-light dark:text-text-dark mb-1">
                            {run.game}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person</span>
                              {run.user.username}
                            </span>
                            {isUserRun && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>check_circle</span>
                                Sua Run
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Time Badge */}
                        <div className="bg-primary/10 dark:bg-primary/20 px-4 py-2 rounded-lg">
                          <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Tempo</div>
                          <div className="text-xl sm:text-2xl font-black font-mono text-primary">{run.runTime}</div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="bg-background-light dark:bg-background-dark rounded-lg p-3">
                          <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark text-xs mb-1">
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>menu_book</span>
                            Pokédex
                          </div>
                          <div className="text-lg font-bold text-text-light dark:text-text-dark">{run.pokedexStatus}</div>
                        </div>
                        
                        <div className="bg-background-light dark:bg-background-dark rounded-lg p-3">
                          <div className="flex items-center gap-2 text-text-secondary-light dark:text-text-secondary-dark text-xs mb-1">
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>groups</span>
                            Team Size
                          </div>
                          <div className="text-lg font-bold text-text-light dark:text-text-dark">{run.pokemonTeam.length} Pokémon</div>
                        </div>
                      </div>

                      {/* Pokemon Team */}
                      <div className="bg-background-light dark:bg-background-dark rounded-lg p-3">
                        <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-2 font-semibold">EQUIPE</div>
                        <div className="flex flex-wrap gap-2">
                          {run.pokemonTeam.map((pokemon, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-component-light dark:bg-component-dark text-text-light dark:text-text-dark text-sm border border-border-light dark:border-border-dark"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>pets</span>
                              {pokemon}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <nav aria-label="Table navigation" className="flex items-center justify-between pt-6">
        <span className="text-sm font-normal text-text-secondary-light dark:text-text-secondary-dark">
          Showing <span className="font-semibold text-text-light dark:text-text-dark">{pagination?.numberOfElements || 0}</span> of <span className="font-semibold text-text-light dark:text-text-dark">{pagination?.totalElements || 0}</span>
        </span>
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={pagination?.first}
              className="flex items-center justify-center px-3 h-8 ml-0 leading-tight rounded-l-lg border border-border-light dark:border-border-dark bg-component-light dark:bg-component-dark hover:bg-background-light dark:hover:bg-background-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_left</span>
            </button>
          </li>
          {pagination && Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => (
            <li key={i}>
              <button
                onClick={() => setPage(i)}
                className={`flex items-center justify-center px-3 h-8 leading-tight border border-border-light dark:border-border-dark ${
                  page === i 
                    ? 'bg-primary text-background-dark' 
                    : 'bg-component-light dark:bg-component-dark hover:bg-background-light dark:hover:bg-background-dark'
                }`}
              >
                {i + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => setPage(p => Math.min((pagination?.totalPages || 1) - 1, p + 1))}
              disabled={pagination?.last}
              className="flex items-center justify-center px-3 h-8 leading-tight rounded-r-lg border border-border-light dark:border-border-dark bg-component-light dark:bg-component-dark hover:bg-background-light dark:hover:bg-background-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_right</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default LeaderboardTable;
