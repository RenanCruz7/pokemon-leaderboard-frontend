import { useAuthStore } from '../stores/authStore';

/**
 * Hook customizado para acessar o estado de autenticação
 * 
 * ANTES (Context API):
 * - Precisava de useContext + validação de undefined
 * - Dependia do AuthProvider estar no topo da árvore
 * 
 * AGORA (Zustand):
 * - Simplesmente retorna a store
 * - Funciona em qualquer lugar sem Provider
 * - Auto-completa no TypeScript funciona perfeitamente
 * 
 * USO:
 * const { user, login, logout, isAuthenticated } = useAuth();
 */
export function useAuth() {
  return useAuthStore();
}
