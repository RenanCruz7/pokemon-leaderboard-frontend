import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useRuns } from '../../hooks/useRuns';

export const LeaderboardTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const { runs, pagination, isLoading, error } = useRuns({ page, size, sort: 'runTime,asc' });

  if (isLoading) {
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
        <div className="text-center">
          <span className="material-symbols-outlined text-accent-red text-5xl">error</span>
          <p className="mt-4 text-accent-red font-medium">{error}</p>
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
            <input id="search-input" placeholder="Search by user or Pokémon..." className="form-input block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark pl-10 pr-3 py-2 text-sm focus:border-primary focus:ring-primary/50" />
          </div>
        </div>
        <div className="w-full md:w-auto md:min-w-[200px]">
          <label className="sr-only" htmlFor="game-filter">Filter by game</label>
          <select id="game-filter" className="form-select w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm focus:border-primary focus:ring-primary/50">
            <option>All Games</option>
            <option>Red/Blue/Yellow</option>
            <option>Gold/Silver/Crystal</option>
            <option>Ruby/Sapphire/Emerald</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border-light dark:border-border-dark bg-component-light dark:bg-component-dark">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="border-b border-border-light dark:border-border-dark text-xs uppercase text-text-secondary-light dark:text-text-secondary-dark">
              <tr>
                <th className="px-6 py-4 font-semibold w-12 text-center">#</th>
                <th className="px-6 py-4 font-semibold">Game</th>
                <th className="px-6 py-4 font-semibold">Time</th>
                <th className="px-6 py-4 font-semibold">Pokédex</th>
                <th className="px-6 py-4 font-semibold">Team</th>
                <th className="px-6 py-4 font-semibold">User</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run, index) => (
                <tr 
                  key={run.id} 
                  onClick={() => navigate(`/run/${run.id}`)}
                  className="border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-bold text-center">{page * size + index + 1}</td>
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><span className="font-medium">{run.game}</span></div></td>
                  <td className="px-6 py-4 font-mono font-medium">{run.runTime}</td>
                  <td className="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark">{run.pokedexStatus}</td>
                  <td className="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark">{run.pokemonTeam.join(', ') || '-'}</td>
                  <td className="px-6 py-4 font-medium">{run.user.username}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
