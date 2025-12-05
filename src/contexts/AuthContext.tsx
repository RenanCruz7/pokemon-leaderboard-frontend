import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/auth.service';
import type { User, LoginRequest, RegisterRequest } from '../types/api.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());
  const isLoading = false;

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    setUser({
      id: response.id,
      username: response.username,
      email: response.email,
      role: response.role,
    });
  };

  const register = async (data: RegisterRequest) => {
    await authService.register(data);
    // Após registrar, fazer login automaticamente
    await login({ username: data.username, password: data.password });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
}

export { AuthContext };
