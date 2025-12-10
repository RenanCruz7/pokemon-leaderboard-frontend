import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export const NavBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast('Logout realizado com sucesso! Até logo! 👋', 'info');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark bg-component-light/80 dark:bg-component-dark/80 px-4 sm:px-6 lg:px-8 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-text-light dark:text-text-dark hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-primary text-3xl">trophy</span>
          <h2 className="text-xl font-bold tracking-tighter">Pokémon Runs DB</h2>
        </button>
      </div>
      <div className="hidden md:flex flex-1 justify-center px-8" />
      <div className="flex flex-1 justify-end gap-4 sm:gap-6">
        <div className="hidden sm:flex items-center gap-6">
          <button 
            onClick={() => navigate('/')}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Leaderboard
          </button>
          <button 
            onClick={() => navigate('/pokemon')}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Pokémon
          </button>
          <button 
            onClick={() => navigate('/moves')}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Moves
          </button>
          {isAuthenticated && (
            <>
              <button 
                onClick={() => navigate('/my-runs')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Minhas Runs
              </button>
              <button 
                onClick={() => navigate('/stats')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Estatísticas
              </button>
            </>
          )}
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#">About</a>
        </div>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            {/* User Menu Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 24 }}>account_circle</span>
                <span className="hidden md:block font-medium text-sm">{user?.username}</span>
                <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark" style={{ fontSize: 16 }}>
                  expand_more
                </span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 bg-component-light dark:bg-component-dark rounded-lg shadow-xl border border-border-light dark:border-border-dark opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-border-light dark:border-border-dark">
                  <p className="text-sm font-semibold text-text-light dark:text-text-dark">{user?.username}</p>
                  <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">{user?.email}</p>
                </div>
                
                <div className="py-2">
                  <button
                    onClick={() => navigate('/pokemon')}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                  >
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>pets</span>
                    <span>Pokémon</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/moves')}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                  >
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>swords</span>
                    <span>Moves</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/my-runs')}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                  >
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>list_alt</span>
                    <span>Minhas Runs</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/stats')}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                  >
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>analytics</span>
                    <span>Estatísticas</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/profile')}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors"
                  >
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>edit</span>
                    <span>Editar Perfil</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/submit')}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors md:hidden"
                  >
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>add_circle</span>
                    <span>Submit Run</span>
                  </button>
                </div>
                
                <div className="border-t border-border-light dark:border-border-dark py-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-accent-red hover:bg-accent-red/10 transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Run Button (desktop only) */}
            <button 
              onClick={() => navigate('/submit')}
              className="hidden md:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-background-dark text-sm font-bold tracking-wide hover:bg-primary/90 transition-colors"
            >
              <span className="truncate">Submit Run</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center justify-center rounded-lg h-10 px-5 border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors text-sm font-medium"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-background-dark text-sm font-bold tracking-wide hover:bg-primary/90 transition-colors"
            >
              <span className="truncate">Registrar</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
