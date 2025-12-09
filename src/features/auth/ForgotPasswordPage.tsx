import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { authService } from '../../services/auth.service';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast('Por favor, digite seu email', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.requestPasswordReset(email);
      showToast(response.message || 'Se o email existir, você receberá instruções de recuperação', 'success');
      setEmail('');
      
      // Redirecionar após 3s
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || apiError.message || 'Erro ao solicitar reset de senha';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary/10">
            <span className="material-symbols-outlined text-primary text-4xl">lock_reset</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-text-light dark:text-text-dark">
            Esqueceu sua senha?
          </h2>
          <p className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Digite seu email e enviaremos instruções para redefinir sua senha
          </p>
        </div>

        <div className="bg-component-light dark:bg-component-dark rounded-lg shadow-xl border border-border-light dark:border-border-dark p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark" style={{ fontSize: 20 }}>
                    mail
                  </span>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark pl-10 pr-3 py-2.5 text-sm focus:border-primary focus:ring-primary/50"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-background-dark border-t-transparent"></div>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">send</span>
                  <span>Enviar Link de Recuperação</span>
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                ← Voltar para Login
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-xl mt-0.5">info</span>
              <div>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  <strong>Nota:</strong> Por segurança, sempre informamos que o email foi enviado, 
                  mesmo que o endereço não esteja cadastrado. Verifique sua caixa de entrada e spam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
