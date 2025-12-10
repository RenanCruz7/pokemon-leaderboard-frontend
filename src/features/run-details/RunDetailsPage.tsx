import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useRun } from '../../hooks/useRuns';
import { pokemonService } from '../../services/pokemon.service';

export const RunDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { run, isLoading, error } = useRun(id || '');
  const [pokemonSprites, setPokemonSprites] = useState<Map<string, string | null>>(new Map());

  useEffect(() => {
    if (run) {
      pokemonService.getPokemonSprites(run.pokemonTeam).then(setPokemonSprites);
    }
  }, [run]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark">Carregando detalhes...</p>
        </div>
      </div>
    );
  }

  if (error || !run) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-accent-red text-5xl">error</span>
          <h1 className="text-3xl font-bold mb-4 mt-4">Run não encontrada</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-6">{error || 'Esta run não existe'}</p>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline"
          >
            Voltar para o Leaderboard
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
            Detalhes da Run submetida por <span className="font-semibold text-text-light dark:text-text-dark">{run.user.username}</span>
          </p>
        </div>

        <div className="w-full bg-component-light dark:bg-component-dark p-6 sm:p-8 rounded-xl border border-border-light dark:border-border-dark">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Tempo da Run</span>
                <p className="text-2xl font-bold font-mono tracking-wider text-primary">{run.runTime}</p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Status da Pokédex</span>
                <p className="text-2xl font-bold">{run.pokedexStatus}</p>
              </div>
            </div>

            <div className="border-t border-border-light dark:border-border-dark my-6"></div>

            <div>
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-3">Equipe Pokémon</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {run.pokemonTeam.map((pokemon, index) => {
                  const sprite = pokemonSprites.get(pokemon);
                  return (
                    <div key={index} className="flex items-center gap-3 rounded-lg bg-background-light dark:bg-background-dark p-3 border border-border-light dark:border-border-dark">
                      {sprite ? (
                        <img 
                          src={sprite} 
                          alt={pokemon} 
                          className="w-12 h-12 object-contain"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-primary">capture</span>
                      )}
                      <span className="font-medium capitalize">{pokemon}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-border-light dark:border-border-dark my-6"></div>

            <div>
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">Observações</h3>
              <p className="text-text-secondary-light dark:text-text-secondary-dark italic bg-background-light dark:bg-background-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
                "{run.observation || 'Sem observações'}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
