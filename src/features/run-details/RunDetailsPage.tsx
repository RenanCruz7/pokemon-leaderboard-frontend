import { useParams, useNavigate } from 'react-router-dom';

interface RunDetailsData {
  id: number;
  game: string;
  time: string;
  pokedex: string;
  team: string[];
  user: string;
  observations: string;
}

const mockRunsData: { [key: string]: RunDetailsData } = {
  '1': {
    id: 1,
    game: 'Pokémon Platinum',
    time: '42:10',
    pokedex: '210 / 493',
    team: ['Infernape', 'Staraptor', 'Luxray', 'Garchomp', 'Floatzel', 'Lucario'],
    user: 'AshK',
    observations: 'A very solid run with good RNG in the early game. The Elite Four battle against Lucian was particularly close. Could save about 30 seconds with better menuing during the Giratina encounter. Overall, very proud of this time and looking forward to improving it in the future.'
  },
  '2': {
    id: 2,
    game: 'Pokémon Emerald',
    time: '48:30',
    pokedex: '198 / 386',
    team: ['Swampert', 'Gardevoir', 'Breloom', 'Crobat', 'Salamence', 'Manectric'],
    user: 'Misty',
    observations: 'Great run overall! The Rayquaza encounter was smooth and the Elite Four went well.'
  },
  '3': {
    id: 3,
    game: 'Pokémon Black 2',
    time: '51:05',
    pokedex: '301 / 301',
    team: ['Samurott', 'Krookodile', 'Haxorus', 'Arcanine', 'Metagross', 'Braviary'],
    user: 'BrockRox',
    observations: 'Complete Pokédex run! Took a lot of time but managed to catch them all.'
  }
};

export const RunDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const run = id ? mockRunsData[id] : null;

  if (!run) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Run not found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            Back to Leaderboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <div className="flex flex-col gap-1">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors w-fit"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
            <span>Back to Leaderboard</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">
            {run.game} Run Details
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-base">
            Submitted by <span className="font-semibold text-text-light dark:text-text-dark">{run.user}</span>
          </p>
        </div>

        <div className="bg-component-light dark:bg-component-dark p-6 sm:p-8 rounded-xl border border-border-light dark:border-border-dark">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                Game
              </h3>
              <p className="text-lg font-bold">{run.game}</p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                Time
              </h3>
              <p className="text-lg font-bold font-mono">{run.time}</p>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                Pokédex
              </h3>
              <p className="text-lg font-bold">{run.pokedex}</p>
            </div>

            <div className="md:col-span-3 flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                Team
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {run.team.map((pokemon, index) => (
                  <div
                    key={index}
                    className="bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg py-2 px-3 text-center"
                  >
                    <span className="font-medium text-sm">{pokemon}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-3 flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">
                Observations
              </h3>
              <p className="text-base text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                {run.observations}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunDetailsPage;
