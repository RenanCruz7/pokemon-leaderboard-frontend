import { useState, useEffect } from 'react';
import { runsService } from '../../services/runs.service';
import { useToast } from '../../hooks/useToast';
import type { RunsCountByGame, AvgRunTimeByGame, TopPokemon } from '../../types/api.types';

// Utilitário para converter minutos em formato HH:MM
const formatMinutes = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  return `${hours}h ${minutes.toString().padStart(2, '0')}min`;
};

export function StatsPage() {
  const { showToast } = useToast();
  const [countByGame, setCountByGame] = useState<RunsCountByGame[]>([]);
  const [avgTimeByGame, setAvgTimeByGame] = useState<AvgRunTimeByGame[]>([]);
  const [topPokemons, setTopPokemons] = useState<TopPokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const [countData, avgTimeData, topPokemonsData] = await Promise.all([
        runsService.getCountByGame(),
        runsService.getAvgTimeByGame(),
        runsService.getTopPokemons(),
      ]);
      setCountByGame(countData);
      setAvgTimeByGame(avgTimeData);
      setTopPokemons(topPokemonsData);
    } catch (error) {
      showToast('Erro ao carregar estatísticas', 'error');
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calcular total de runs
  const totalRuns = countByGame.reduce((sum, item) => sum + item.count, 0);

  // Encontrar jogo mais popular
  const mostPopularGame = countByGame.length > 0 
    ? countByGame.reduce((prev, current) => current.count > prev.count ? current : prev)
    : { game: '-', count: 0 };

  // Calcular tempo médio geral
  const overallAvgTime = avgTimeByGame.length > 0
    ? avgTimeByGame.reduce((sum, item) => sum + item.avgRunTime, 0) / avgTimeByGame.length
    : 0;

  const handleExportCSV = async () => {
    try {
      const csvData = await runsService.exportToCSV();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pokemon-runs.csv';
      link.click();
      window.URL.revokeObjectURL(url);
      showToast('Dados exportados com sucesso!', 'success');
    } catch (error) {
      showToast('Erro ao exportar dados', 'error');
      console.error('Erro ao exportar CSV:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark">Carregando estatísticas...</p>
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
          Estatísticas
        </h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          Insights e métricas da comunidade Pokémon
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-6 rounded-lg border border-primary/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Total de Runs
              </p>
              <p className="text-3xl font-bold text-primary">{totalRuns}</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                De todos os jogos
              </p>
            </div>
            <span className="material-symbols-outlined text-primary text-5xl">
              leaderboard
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 p-6 rounded-lg border border-accent-blue/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Jogo Mais Popular
              </p>
              <p className="text-xl font-bold text-accent-blue">{mostPopularGame.game}</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                {mostPopularGame.count} runs registradas
              </p>
            </div>
            <span className="material-symbols-outlined text-accent-blue text-5xl">
              stars
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent-green/20 to-accent-green/5 p-6 rounded-lg border border-accent-green/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                Tempo Médio Geral
              </p>
              <p className="text-2xl font-bold text-accent-green">{formatMinutes(overallAvgTime)}</p>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                Média de todos os jogos
              </p>
            </div>
            <span className="material-symbols-outlined text-accent-green text-5xl">
              schedule
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Runs por Jogo */}
        <div className="bg-component-light dark:bg-component-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">bar_chart</span>
            Runs por Jogo
          </h2>
          <div className="space-y-4">
            {countByGame.map((item) => {
              const percentage = (item.count / totalRuns) * 100;
              return (
                <div key={item.game}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-text-light dark:text-text-dark">
                      {item.game}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {item.count} runs
                    </span>
                  </div>
                  <div className="w-full bg-background-light dark:bg-background-dark rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    {percentage.toFixed(1)}% do total
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tempo Médio por Jogo */}
        <div className="bg-component-light dark:bg-component-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
          <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-accent-blue">timer</span>
            Tempo Médio por Jogo
          </h2>
          <div className="space-y-4">
            {avgTimeByGame
              .sort((a, b) => a.avgRunTime - b.avgRunTime)
              .map((item) => {
                const maxTime = Math.max(...avgTimeByGame.map(i => i.avgRunTime));
                const percentage = (item.avgRunTime / maxTime) * 100;
                return (
                  <div key={item.game}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-text-light dark:text-text-dark">
                        {item.game}
                      </span>
                      <span className="text-sm font-bold text-accent-blue">
                        {formatMinutes(item.avgRunTime)}
                      </span>
                    </div>
                    <div className="w-full bg-background-light dark:bg-background-dark rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-blue to-accent-blue/70 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Top Pokémons */}
      <div className="bg-component-light dark:bg-component-dark p-6 rounded-lg border border-border-light dark:border-border-dark">
        <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-accent-yellow">emoji_events</span>
          Top 10 Pokémons Mais Usados
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {topPokemons.map((item, index) => {
            const medalColors = ['text-accent-yellow', 'text-gray-400', 'text-orange-600'];
            const medalColor = index < 3 ? medalColors[index] : 'text-text-secondary-light dark:text-text-secondary-dark';
            
            return (
              <div
                key={item.pokemon}
                className="relative bg-background-light dark:bg-background-dark p-4 rounded-lg border border-border-light dark:border-border-dark hover:border-primary transition-all hover:scale-105"
              >
                {/* Ranking Badge */}
                <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full bg-component-light dark:bg-component-dark border-2 ${index < 3 ? 'border-primary' : 'border-border-light dark:border-border-dark'} flex items-center justify-center`}>
                  <span className={`text-sm font-bold ${medalColor}`}>
                    #{index + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="text-center mt-2">
                  <h3 className="font-bold text-text-light dark:text-text-dark mb-1 mt-4">
                    {item.pokemon}
                  </h3>
                  <p className="text-2xl font-bold text-primary">
                    {item.count}
                  </p>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    aparições
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-8 text-center">
        <button
          onClick={handleExportCSV}
          className="px-8 py-3 bg-accent-green text-white rounded-lg font-medium hover:bg-accent-green/90 transition-colors flex items-center gap-2 mx-auto"
        >
          <span className="material-symbols-outlined">download</span>
          Exportar Dados (CSV)
        </button>
      </div>
    </div>
  );
}
