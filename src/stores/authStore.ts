import { create } from 'zustand';
import { authService } from '../services/auth.service';
import type { User, LoginRequest, RegisterRequest } from '../types/api.types';


interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: authService.getStoredUser(),
  isAuthenticated: !!authService.getStoredUser(),
  isLoading: false,

  login: async (credentials: LoginRequest) => {
    try {
      set({ isLoading: true });
      
      const response = await authService.login(credentials);

      set({
        user: {
          id: response.id,
          username: response.username,
          email: response.email,
          role: response.role,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data: RegisterRequest) => {
    try {
      set({ isLoading: true });
      
      await authService.register(data);
      
      await useAuthStore.getState().login({
        username: data.username,
        password: data.password,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },
}));
