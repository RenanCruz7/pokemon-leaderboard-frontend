import { useNavigate } from 'react-router-dom';
import { memo } from 'react';
import type { Run } from '../../types';

const sampleRuns: Run[] = [
  { id: 1, game: 'Pokémon Platinum', time: '42:10', pokedex: '210/493', team: 'Infernape, Staraptor, Luxray, Garchomp, Floatzel, Lucario', user: 'AshK' },
  { id: 2, game: 'Pokémon Emerald', time: '48:30', pokedex: '198/386', team: 'Swampert, Gardevoir, Breloom, Crobat, Salamence, Manectric', user: 'Misty' },
  { id: 3, game: 'Pokémon Black 2', time: '51:05', pokedex: '301/301', team: 'Samurott, Krookodile, Haxorus, Arcanine, Metagross, Braviary', user: 'BrockRox' },
];

export const LeaderboardTable = memo(() => {
  const navigate = useNavigate();

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
              {sampleRuns.map((row) => (
                <tr 
                  key={row.id} 
                  onClick={() => navigate(`/run/${row.id}`)}
                  className="border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark/50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-bold text-center">{row.id}</td>
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><span className="font-medium">{row.game}</span></div></td>
                  <td className="px-6 py-4 font-mono font-medium">{row.time}</td>
                  <td className={`px-6 py-4 ${row.pokedex.endsWith('/301') ? 'text-primary font-bold' : 'text-text-secondary-light dark:text-text-secondary-dark'}`}>{row.pokedex}</td>
                  <td className="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark">{row.team}</td>
                  <td className="px-6 py-4 font-medium">{row.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <nav aria-label="Table navigation" className="flex items-center justify-between pt-6">
        <span className="text-sm font-normal text-text-secondary-light dark:text-text-secondary-dark">Showing <span className="font-semibold text-text-light dark:text-text-dark">1-10</span> of <span className="font-semibold text-text-light dark:text-text-dark">1000</span></span>
        <ul className="inline-flex items-center -space-x-px">
          <li>
            <a className="flex items-center justify-center px-3 h-8 ml-0 leading-tight rounded-l-lg border border-border-light dark:border-border-dark bg-component-light dark:bg-component-dark hover:bg-background-light dark:hover:bg-background-dark" href="#">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_left</span>
            </a>
          </li>
          <li>
            <a className="flex items-center justify-center px-3 h-8 leading-tight border border-border-light dark:border-border-dark bg-primary text-background-dark" href="#">1</a>
          </li>
          <li>
            <a className="flex items-center justify-center px-3 h-8 leading-tight border border-border-light dark:border-border-dark bg-component-light dark:bg-component-dark hover:bg-background-light dark:hover:bg-background-dark" href="#">2</a>
          </li>
          <li>
            <a className="flex items-center justify-center px-3 h-8 leading-tight border border-border-light dark:border-border-dark bg-component-light dark:bg-component-dark hover:bg-background-light dark:hover:bg-background-dark" href="#">...</a>
          </li>
          <li>
            <a className="flex items-center justify-center px-3 h-8 leading-tight rounded-r-lg border border-border-light dark:border-border-dark bg-component-light dark:bg-component-dark hover:bg-background-light dark:hover:bg-background-dark" href="#">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_right</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
});

LeaderboardTable.displayName = 'LeaderboardTable';
