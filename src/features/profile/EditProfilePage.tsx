import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
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

export const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.username.trim()) {
      showToast('Username não pode estar vazio', 'error');
      return;
    }

    if (!formData.email.trim()) {
      showToast('Email não pode estar vazio', 'error');
      return;
    }

    if (showPasswordFields) {
      if (!formData.currentPassword) {
        showToast('Senha atual é obrigatória para alteração', 'error');
        return;
      }

      if (!formData.newPassword) {
        showToast('Nova senha não pode estar vazia', 'error');
        return;
      }

      if (formData.newPassword.length < 6) {
        showToast('Nova senha deve ter no mínimo 6 caracteres', 'error');
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        showToast('As senhas não coincidem', 'error');
        return;
      }
    }

    setIsLoading(true);

    try {
      const updateData: {
        username?: string;
        email?: string;
      } = {};

      // Adicionar apenas campos que mudaram (username e email)
      if (formData.username !== user?.username) {
        updateData.username = formData.username;
      }

      if (formData.email !== user?.email) {
        updateData.email = formData.email;
      }

      // Se houver alteração de senha, usar endpoint específico
      if (showPasswordFields && formData.currentPassword && formData.newPassword) {
        await authService.changePassword(formData.currentPassword, formData.newPassword);
        showToast('Senha alterada com sucesso! 🔒', 'success');
      }

      // Se houver alteração de username ou email, atualizar perfil
      if (Object.keys(updateData).length > 0) {
        const updatedUser = await authService.updateProfile(updateData);
        setUser(updatedUser);
        showToast('Perfil atualizado com sucesso! ✨', 'success');
      }

      // Se nada mudou
      if (Object.keys(updateData).length === 0 && !showPasswordFields) {
        showToast('Nenhuma alteração detectada', 'info');
        return;
      }
      
      // Limpar campos de senha
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
      setShowPasswordFields(false);

      // Redirecionar após 1.5s
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || apiError.message || 'Erro ao atualizar perfil';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsLoading(true);

    try {
      await authService.deleteAccount();
      showToast('Conta excluída com sucesso', 'success');
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = apiError.response?.data?.message || apiError.message || 'Erro ao excluir conta';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-component-light dark:bg-component-dark rounded-lg shadow-xl border border-border-light dark:border-border-dark overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-background-dark/20 p-3 rounded-full">
                  <span className="material-symbols-outlined text-background-dark text-3xl">
                    account_circle
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-background-dark">Editar Perfil</h1>
                  <p className="text-background-dark/80 text-sm mt-1">
                    Atualize suas informações pessoais
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-background-dark/80 hover:text-background-dark transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* User Info Card */}
            <div className="bg-background-light dark:bg-background-dark rounded-lg p-4 border border-border-light dark:border-border-dark">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-primary">badge</span>
                <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">
                  Informações Pessoais
                </h2>
              </div>
              
              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark" style={{ fontSize: 20 }}>
                        person
                      </span>
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="form-input block w-full rounded-lg border-border-light dark:border-border-dark bg-component-light dark:bg-component-dark pl-10 pr-3 py-2.5 text-sm focus:border-primary focus:ring-primary/50"
                      placeholder="Seu username"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
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
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input block w-full rounded-lg border-border-light dark:border-border-dark bg-component-light dark:bg-component-dark pl-10 pr-3 py-2.5 text-sm focus:border-primary focus:ring-primary/50"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Role (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                    Tipo de Conta
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>
                      {user.role === 'ADMIN' ? 'admin_panel_settings' : 'person'}
                    </span>
                    <span className="text-sm font-medium text-text-light dark:text-text-dark">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="bg-background-light dark:bg-background-dark rounded-lg p-4 border border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">lock</span>
                  <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">
                    Segurança
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordFields(!showPasswordFields)}
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {showPasswordFields ? 'Cancelar' : 'Alterar Senha'}
                </button>
              </div>

              {showPasswordFields && (
                <div className="space-y-4 mt-4">
                  {/* Current Password */}
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Senha Atual
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark" style={{ fontSize: 20 }}>
                          key
                        </span>
                      </div>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="form-input block w-full rounded-lg border-border-light dark:border-border-dark bg-component-light dark:bg-component-dark pl-10 pr-3 py-2.5 text-sm focus:border-primary focus:ring-primary/50"
                        placeholder="Digite sua senha atual"
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark" style={{ fontSize: 20 }}>
                          lock_reset
                        </span>
                      </div>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="form-input block w-full rounded-lg border-border-light dark:border-border-dark bg-component-light dark:bg-component-dark pl-10 pr-3 py-2.5 text-sm focus:border-primary focus:ring-primary/50"
                        placeholder="Mínimo 6 caracteres"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
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
                        onChange={handleInputChange}
                        className="form-input block w-full rounded-lg border-border-light dark:border-border-dark bg-component-light dark:bg-component-dark pl-10 pr-3 py-2.5 text-sm focus:border-primary focus:ring-primary/50"
                        placeholder="Repita a nova senha"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-background-dark border-t-transparent"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">save</span>
                    <span>Salvar Alterações</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                disabled={isLoading}
                className="px-6 py-3 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark rounded-lg font-medium hover:bg-component-light dark:hover:bg-component-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Cancelar
              </button>
            </div>

            {/* Danger Zone */}
            <div className="border-t border-border-light dark:border-border-dark pt-6 mt-8">
              <div className="bg-accent-red/10 rounded-lg p-4 border border-accent-red/30">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-accent-red text-2xl">
                    warning
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-accent-red mb-2">
                      Zona de Perigo
                    </h3>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-4">
                      Excluir sua conta é uma ação permanente e não pode ser desfeita. Todas as suas runs e dados serão perdidos.
                    </p>
                    
                    {showDeleteConfirm && (
                      <div className="bg-accent-red/20 rounded-lg p-3 mb-3 border border-accent-red/50">
                        <p className="text-sm font-semibold text-accent-red mb-2">
                          ⚠️ Tem certeza absoluta? Esta ação não pode ser desfeita!
                        </p>
                        <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                          Clique novamente no botão para confirmar a exclusão.
                        </p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      disabled={isLoading}
                      className={`px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        showDeleteConfirm
                          ? 'bg-accent-red text-white hover:bg-accent-red/90 shadow-lg'
                          : 'bg-accent-red/20 text-accent-red hover:bg-accent-red/30 border border-accent-red/50'
                      }`}
                    >
                      {showDeleteConfirm ? 'Confirmar Exclusão' : 'Excluir Conta'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
