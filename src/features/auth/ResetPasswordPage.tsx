import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      showToast('Token de reset inválido ou ausente', 'error');
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [token, navigate, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      showToast('Token de reset inválido', 'error');
      return;
    }

    if (formData.newPassword.length < 6) {
      showToast('A senha deve ter no mínimo 6 caracteres', 'error');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showToast('As senhas não coincidem', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword(token, formData.newPassword);
      showToast(response.message || 'Senha redefinida com sucesso! 🎉', 'success');
      
      // Redirecionar para login após 2s
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      let errorMessage = apiError.response?.data?.message || apiError.message || 'Erro ao redefinir senha';
      
      // Mensagens mais amigáveis para erros comuns
      if (errorMessage.includes('Token inválido')) {
        errorMessage = 'Token inválido ou expirado. Solicite um novo link de recuperação.';
      } else if (errorMessage.includes('expirado')) {
        errorMessage = 'Este link de recuperação expirou. Solicite um novo.';
      } else if (errorMessage.includes('já utilizado')) {
        errorMessage = 'Este link já foi utilizado. Solicite um novo se necessário.';
      }
      
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <span className="material-symbols-outlined text-accent-red text-6xl">error</span>
          <p className="mt-4 text-text-light dark:text-text-dark">Token inválido ou ausente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary/10">
            <span className="material-symbols-outlined text-primary text-4xl">lock_open</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-text-light dark:text-text-dark">
            Redefinir Senha
          </h2>
          <p className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
            Digite sua nova senha abaixo
          </p>
        </div>

        <div className="bg-component-light dark:bg-component-dark rounded-lg shadow-xl border border-border-light dark:border-border-dark p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                Nova Senha
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark" style={{ fontSize: 20 }}>
                    lock
                  </span>
                </div>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="form-input block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark pl-10 pr-3 py-2.5 text-sm focus:border-primary focus:ring-primary/50"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark" style={{ fontSize: 20 }}>
                    check_circle
                  </span>
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input block w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark pl-10 pr-3 py-2.5 text-sm focus:border-primary focus:ring-primary/50"
                  placeholder="Repita a nova senha"
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
                  <span>Redefinindo...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">save</span>
                  <span>Redefinir Senha</span>
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
                  <strong>Dica:</strong> Use uma senha forte com letras, números e caracteres especiais.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
