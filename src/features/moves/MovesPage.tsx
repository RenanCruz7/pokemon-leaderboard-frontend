import { useState, useEffect } from 'react';
import { movesService, type Move, type MoveEffect } from '../../services/moves.service';
import { useToast } from '../../hooks/useToast';

export function MovesPage() {
  const { showToast } = useToast();
  const [moves, setMoves] = useState<Move[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const itemsPerPage = 20;

  const fetchMoves = async (page: number) => {
    try {
      setIsLoading(true);
      const offset = page * itemsPerPage;
      const listResponse = await movesService.getMovesList(offset, itemsPerPage);
      
      setTotalCount(listResponse.count);
      
      // Buscar detalhes de cada move
      const moveNames = listResponse.results.map(m => m.name);
      const movesDetails = await movesService.getMovesDetails(moveNames);
      
      setMoves(movesDetails);
    } catch (error) {
      showToast('Erro ao carregar moves', 'error');
      console.error('Erro ao buscar moves:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar moves que contenham o termo
  const searchMoves = async (searchQuery: string) => {
    try {
      setIsSearching(true);
      const query = searchQuery.toLowerCase().trim();
      
      // Buscar lista completa (limitado a 1000 moves)
      const listResponse = await movesService.getMovesList(0, 1000);
      
      // Filtrar moves que contenham o termo de busca
      const matchingMoves = listResponse.results.filter(move => 
        move.name.includes(query)
      );

      if (matchingMoves.length === 0) {
        setMoves([]);
        showToast(`Nenhum move encontrado para "${searchQuery}"`, 'info');
        return;
      }

      // Limitar a 20 resultados para não sobrecarregar
      const limitedMoves = matchingMoves.slice(0, 20);
      const movesDetails = await movesService.getMovesDetails(limitedMoves.map(m => m.name));
      
      setMoves(movesDetails);
      showToast(`${matchingMoves.length} move(s) encontrado(s)`, 'success');
    } catch (error) {
      console.error('Erro ao buscar moves:', error);
      setMoves([]);
      showToast('Erro ao buscar moves', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      fetchMoves(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim() !== '') {
        setSearchTerm(searchInput);
        searchMoves(searchInput);
      } else {
        setSearchTerm('');
        fetchMoves(currentPage);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-cyan-400',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-700',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-600',
      dark: 'bg-gray-700',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300',
    };
    return colors[type] || 'bg-gray-400';
  };

  const getDamageClassIcon = (damageClass: string): string => {
    const icons: Record<string, string> = {
      physical: 'swords',
      special: 'auto_awesome',
      status: 'healing',
    };
    return icons[damageClass] || 'help';
  };

  if (isLoading && moves.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark">Carregando moves...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-primary mb-2">
          Pokémon Moves
        </h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          Explore todos os golpes disponíveis no universo Pokémon
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark" style={{ fontSize: 20 }}>
              search
            </span>
          </div>
          <input
            type="text"
            placeholder="Buscar move (ex: flame, thunder, punch)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-lg border border-border-light dark:border-border-dark bg-component-light dark:bg-component-dark focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-component-light dark:bg-component-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">casino</span>
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total de Moves</p>
              <p className="text-2xl font-bold text-text-light dark:text-text-dark">{totalCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-component-light dark:bg-component-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-accent-blue text-3xl">library_books</span>
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Página Atual</p>
              <p className="text-2xl font-bold text-text-light dark:text-text-dark">
                {searchTerm ? '-' : `${currentPage + 1} / ${totalPages}`}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-component-light dark:bg-component-dark p-4 rounded-lg border border-border-light dark:border-border-dark">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-accent-yellow text-3xl">visibility</span>
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Exibindo</p>
              <p className="text-2xl font-bold text-text-light dark:text-text-dark">{moves.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Moves Grid */}
      {moves.length === 0 && !isLoading && !isSearching ? (
        <div className="text-center py-12 bg-component-light dark:bg-component-dark rounded-lg border border-border-light dark:border-border-dark">
          <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-5xl">
            search_off
          </span>
          <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark">
            Nenhum move encontrado
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {moves.map((move) => {
            const effect = move.effect_entries.find((e: MoveEffect) => e.language.name === 'en');
            return (
              <div
                key={move.id}
                className="bg-component-light dark:bg-component-dark p-5 rounded-lg border border-border-light dark:border-border-dark hover:border-primary transition-all hover:shadow-lg"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-text-light dark:text-text-dark capitalize mb-2">
                      {move.name.replace(/-/g, ' ')}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${getTypeColor(move.type.name)}`}>
                        {move.type.name}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark text-xs font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                          {getDamageClassIcon(move.damage_class.name)}
                        </span>
                        {move.damage_class.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Power</p>
                    <p className="text-lg font-bold text-accent-red">{move.power || '-'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Accuracy</p>
                    <p className="text-lg font-bold text-accent-blue">{move.accuracy || '-'}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">PP</p>
                    <p className="text-lg font-bold text-accent-green">{move.pp}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Priority</p>
                    <p className="text-lg font-bold text-primary">{move.priority}</p>
                  </div>
                </div>

                {/* Effect */}
                <div className="border-t border-border-light dark:border-border-dark pt-3">
                  <p className="text-xs font-semibold text-text-secondary-light dark:text-text-secondary-dark mb-1">
                    EFEITO
                  </p>
                  <p className="text-sm text-text-light dark:text-text-dark leading-relaxed">
                    {effect?.short_effect || effect?.effect || 'No description available'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination - Oculta durante busca */}
      {!searchTerm && (
        <nav aria-label="Moves pagination" className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0 || isLoading}
            className="flex items-center justify-center px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-component-light dark:bg-component-dark hover:bg-background-light dark:hover:bg-background-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          
          <span className="px-4 py-2 text-text-light dark:text-text-dark font-medium">
            Página {currentPage + 1} de {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1 || isLoading}
            className="flex items-center justify-center px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-component-light dark:bg-component-dark hover:bg-background-light dark:hover:bg-background-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </nav>
      )}
    </div>
  );
}
