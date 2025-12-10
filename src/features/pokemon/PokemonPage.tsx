import { useState, useEffect } from 'react';
import { pokemonSpeciesService, type PokemonSpecies } from '../../services/pokemon-species.service';
import { pokemonService } from '../../services/pokemon.service';
import { useToast } from '../../hooks/useToast';

export function PokemonPage() {
  const { showToast } = useToast();
  const [pokemons, setPokemons] = useState<PokemonSpecies[]>([]);
  const [sprites, setSprites] = useState<Map<string, string | null>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const itemsPerPage = 20;

  const fetchPokemons = async (page: number) => {
    try {
      setIsLoading(true);
      const offset = page * itemsPerPage;
      const listResponse = await pokemonSpeciesService.getSpeciesList(offset, itemsPerPage);

      setTotalCount(listResponse.count);

      const pokemonNames = listResponse.results.map(p => p.name);
      const pokemonDetails = await pokemonSpeciesService.getMultipleSpecies(pokemonNames);

      setPokemons(pokemonDetails);

      // Buscar sprites em paralelo
      const spriteMap = await pokemonService.getPokemonSprites(pokemonNames);
      setSprites(spriteMap);
    } catch (error) {
      showToast('Erro ao carregar pokémons', 'error');
      console.error('Erro ao buscar pokémons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const searchPokemons = async (searchQuery: string) => {
    try {
      setIsSearching(true);
      const query = searchQuery.toLowerCase().trim();

      const listResponse = await pokemonSpeciesService.getSpeciesList(0, 1000);

      const matchingPokemons = listResponse.results.filter(pokemon =>
        pokemon.name.includes(query)
      );

      if (matchingPokemons.length === 0) {
        setPokemons([]);
        showToast(`Nenhum pokémon encontrado para "${searchQuery}"`, 'info');
        return;
      }

      const limitedPokemons = matchingPokemons.slice(0, 20);
      const pokemonDetails = await pokemonSpeciesService.getMultipleSpecies(limitedPokemons.map(p => p.name));

      setPokemons(pokemonDetails);

      const spriteMap = await pokemonService.getPokemonSprites(limitedPokemons.map(p => p.name));
      setSprites(spriteMap);

      showToast(`${matchingPokemons.length} pokémon(s) encontrado(s)`, 'success');
    } catch (error) {
      console.error('Erro ao buscar pokémons:', error);
      setPokemons([]);
      showToast('Erro ao buscar pokémons', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === '') {
      fetchPokemons(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput.trim() !== '') {
        setSearchTerm(searchInput);
        searchPokemons(searchInput);
      } else {
        setSearchTerm('');
        fetchPokemons(currentPage);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getGenerationBadge = (generation: string): string => {
    const genNumber = generation.replace('generation-', '').toUpperCase();
    return `Gen ${genNumber}`;
  };

  const getColorClass = (color: string): string => {
    const colors: Record<string, string> = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-400',
      green: 'bg-green-500',
      black: 'bg-gray-800',
      brown: 'bg-yellow-700',
      purple: 'bg-purple-500',
      gray: 'bg-gray-500',
      white: 'bg-gray-300',
      pink: 'bg-pink-400',
    };
    return colors[color] || 'bg-gray-400';
  };

  if (isLoading && pokemons.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark">Carregando pokémons...</p>
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
          Pokédex
        </h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          Explore todas as espécies de Pokémon disponíveis
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
            placeholder="Buscar pokémon (ex: pikachu, charizard)..."
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
            <span className="material-symbols-outlined text-primary text-3xl">pets</span>
            <div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total de Pokémons</p>
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
              <p className="text-2xl font-bold text-text-light dark:text-text-dark">{pokemons.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pokemon Grid */}
      {pokemons.length === 0 && !isLoading && !isSearching ? (
        <div className="text-center py-12 bg-component-light dark:bg-component-dark rounded-lg border border-border-light dark:border-border-dark">
          <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark text-5xl">
            search_off
          </span>
          <p className="mt-4 text-text-secondary-light dark:text-text-secondary-dark">
            Nenhum pokémon encontrado
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {pokemons.map((pokemon) => {
            const englishName = pokemon.names.find(n => n.language.name === 'en')?.name || pokemon.name;
            const genus = pokemon.genera.find(g => g.language.name === 'en')?.genus || '';
            const description = pokemon.flavor_text_entries.find(f => f.language.name === 'en')?.flavor_text.replace(/\f/g, ' ') || '';
            const sprite = sprites.get(pokemon.name);

            return (
              <div
                key={pokemon.id}
                className="bg-component-light dark:bg-component-dark p-5 rounded-lg border border-border-light dark:border-border-dark hover:border-primary transition-all hover:shadow-lg hover:scale-105 cursor-pointer"
              >
                {/* Sprite */}
                <div className="flex justify-center mb-3">
                  {sprite ? (
                    <img
                      src={sprite}
                      alt={englishName}
                      className="w-24 h-24 object-contain"
                    />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-background-light dark:bg-background-dark rounded-lg">
                      <span className="material-symbols-outlined text-4xl text-primary">help</span>
                    </div>
                  )}
                </div>

                {/* Header */}
                <div className="text-center mb-3">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-xs font-mono text-text-secondary-light dark:text-text-secondary-dark">
                      #{pokemon.id.toString().padStart(3, '0')}
                    </span>
                    {pokemon.is_legendary && (
                      <span className="text-xs bg-accent-yellow/20 text-accent-yellow px-2 py-0.5 rounded-full font-semibold">
                        Legendary
                      </span>
                    )}
                    {pokemon.is_mythical && (
                      <span className="text-xs bg-purple-500/20 text-purple-500 px-2 py-0.5 rounded-full font-semibold">
                        Mythical
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark capitalize">
                    {englishName}
                  </h3>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                    {genus}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${getColorClass(pokemon.color.name)}`}>
                    {pokemon.color.name}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                    {getGenerationBadge(pokemon.generation.name)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed line-clamp-3">
                  {description || 'No description available'}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!searchTerm && (
        <nav aria-label="Pokemon pagination" className="flex items-center justify-center gap-2">
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
