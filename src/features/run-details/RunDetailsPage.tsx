import { useParams, useNavigate } from 'react-router-dom';

interface RunDetailsData {
  id: number;
  game: string;
  time: string;
  pokedex: number;
  team: string[];
  user: string;
  notes: string;
}

const mockRunsData: { [key: string]: RunDetailsData } = {
  '1': {
    id: 1,
    game: 'Pokémon Platinum',
    time: '42:10',
    pokedex: 210,
    team: ['Infernape', 'Staraptor', 'Luxray', 'Garchomp', 'Floatzel', 'Lucario'],
    user: 'AshK',
    notes: 'A very solid run with good RNG in the early game. The Elite Four battle against Lucian was particularly close.'
  },
  '2': {
    id: 2,
    game: 'Pokémon Emerald',
    time: '48:30',
    pokedex: 198,
    team: ['Swampert', 'Gardevoir', 'Breloom', 'Crobat', 'Salamence', 'Manectric'],
    user: 'Misty',
    notes: 'Great run overall! The Rayquaza encounter was smooth and the Elite Four went well.'
  },
  '3': {
    id: 3,
    game: 'Pokémon Black 2',
    time: '51:05',
    pokedex: 301,
    team: ['Samurott', 'Krookodile', 'Haxorus', 'Arcanine', 'Metagross', 'Braviary'],
    user: 'BrockRox',
    notes: 'Complete Pokédex run! Took a lot of time but managed to catch them all.'
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
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark hover:text-primary dark:hover:text-primary transition-colors mb-4"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
            Voltar para o Leaderboard
          </button>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-primary">{run.game}</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-base mt-2">
            Detalhes da Run submetida por <span className="font-semibold text-text-light dark:text-text-dark">{run.user}</span>
          </p>
        </div>

        <div className="w-full bg-component-light dark:bg-component-dark p-6 sm:p-8 rounded-xl border border-border-light dark:border-border-dark">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Tempo da Run</span>
                <p className="text-2xl font-bold font-mono tracking-wider text-primary">{run.time}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Status da Pokédex</span>
                <p className="text-2xl font-bold">{run.pokedex}</p>
              </div>
            </div>

            <div className="border-t border-border-light dark:border-border-dark my-6"></div>

            <div>
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-3">Equipe Pokémon</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {run.team.map((pokemon, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-lg bg-background-light dark:bg-background-dark p-3 border border-border-light dark:border-border-dark">
                    <span className="material-symbols-outlined text-primary">capture</span>
                    <span className="font-medium">{pokemon}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border-light dark:border-border-dark my-6"></div>

            <div>
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">Observações</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark italic bg-background-light dark:bg-background-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                "{run.notes}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RunDetailsPage;
