import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const SubmitRunPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    gameName: '',
    runTime: '',
    pokedexStatus: '',
    pokemonTeam: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Aqui você pode adicionar a lógica para enviar os dados para o backend
    alert('Run submetida com sucesso!');
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col gap-2 text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">
            Submeter Nova Run de Pokémon
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-base">
            Preencha o formulário abaixo para adicionar sua run ao leaderboard.
          </p>
        </div>

        <div className="w-full bg-component-light dark:bg-component-dark p-6 sm:p-8 rounded-xl border border-border-light dark:border-border-dark">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="gameName" 
                className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
              >
                Nome do Jogo <span className="text-accent-red">*</span>
              </label>
              <input
                type="text"
                id="gameName"
                name="gameName"
                value={formData.gameName}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Ex: Pokémon Emerald"
                className="form-input block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm focus:border-primary focus:ring-primary/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label 
                  htmlFor="runTime" 
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                >
                  Tempo da Run <span className="text-accent-red">*</span>
                </label>
                <input
                  type="text"
                  id="runTime"
                  name="runTime"
                  value={formData.runTime}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{2}:[0-5][0-9]"
                  placeholder="HH:MM"
                  className="form-input font-mono block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm focus:border-primary focus:ring-primary/50"
                />
              </div>

              <div>
                <label 
                  htmlFor="pokedexStatus" 
                  className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
                >
                  Status da Pokédex
                </label>
                <input
                  type="number"
                  id="pokedexStatus"
                  name="pokedexStatus"
                  value={formData.pokedexStatus}
                  onChange={handleChange}
                  min="1"
                  placeholder="Ex: 151"
                  className="form-input block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm focus:border-primary focus:ring-primary/50"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="pokemonTeam" 
                className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
              >
                Equipe Pokémon
              </label>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-2">
                Liste até 6 Pokémon, separados por vírgula.
              </p>
              <textarea
                id="pokemonTeam"
                name="pokemonTeam"
                value={formData.pokemonTeam}
                onChange={handleChange}
                rows={3}
                placeholder="Ex: Charizard, Blastoise, Venusaur, Pikachu, Snorlax, Dragonite"
                className="form-textarea block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm focus:border-primary focus:ring-primary/50"
              />
            </div>

            <div>
              <label 
                htmlFor="notes" 
                className="block text-sm font-medium text-text-light dark:text-text-dark mb-1"
              >
                Observações
              </label>
              <input
                type="text"
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                maxLength={100}
                placeholder="Detalhes adicionais (opcional)"
                className="form-input block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm focus:border-primary focus:ring-primary/50"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary text-background-dark text-base font-bold tracking-wide hover:bg-primary/90 transition-colors"
              >
                Submeter Run
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitRunPage;
