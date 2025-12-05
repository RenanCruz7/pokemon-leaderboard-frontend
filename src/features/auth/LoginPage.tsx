import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import type { ApiError } from '../../types/api.types';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      await login({
        username: formData.get('username') as string,
        password: formData.get('password') as string,
      });
      showToast('Login realizado com sucesso! 👋', 'success');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      const apiError = err as { response?: { data?: ApiError } };
      setError(apiError.response?.data?.detalhes || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-2 text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary text-5xl">trophy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">Login</h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-base">
            Entre para submeter suas runs
          </p>
        </div>

        <div className="w-full bg-component-light dark:bg-component-dark p-6 sm:p-8 rounded-xl border border-border-light dark:border-border-dark">
          {error && (
            <div className="mb-6 p-4 bg-accent-red/10 border border-accent-red rounded-lg">
              <p className="text-accent-red text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                Username <span className="text-accent-red">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="form-input block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm focus:border-primary focus:ring-primary/50"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-light dark:text-text-dark mb-1">
                Password <span className="text-accent-red">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                className="form-input block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-sm focus:border-primary focus:ring-primary/50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary text-background-dark text-base font-bold tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-background-dark border-t-transparent"></div>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Registrar-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
