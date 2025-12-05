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
          <a className="text-sm font-medium hover:text-primary transition-colors" href="#">About</a>
        </div>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>account_circle</span>
              <span className="font-medium">{user?.username}</span>
            </div>
            <button 
              onClick={() => navigate('/submit')}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-background-dark text-sm font-bold tracking-wide hover:bg-primary/90 transition-colors"
            >
              <span className="truncate">Submit Run</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center rounded-lg h-10 px-4 border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark transition-colors"
            >
              <span className="material-symbols-outlined text-accent-red" style={{ fontSize: 20 }}>logout</span>
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
