import { create } from 'zustand';
import { api } from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  role: null,
  token: localStorage.getItem('cg_token') || '',
  isAuthenticated: false,
  loadingUser: false,
  hydrateAuth: async () => {
    const token = localStorage.getItem('cg_token');
    if (!token) return set({ user: null, role: null, token: '', isAuthenticated: false });
    set({ token, loadingUser: true });
    try {
      const { data } = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      set({ user: data.user, role: data.user.role, isAuthenticated: true, loadingUser: false });
    } catch (_e) {
      localStorage.removeItem('cg_token');
      set({ user: null, role: null, token: '', isAuthenticated: false, loadingUser: false });
    }
  },
  setAuth: async (token) => {
    localStorage.setItem('cg_token', token);
    set({ token });
    await get().hydrateAuth();
  },
  logout: () => {
    localStorage.removeItem('cg_token');
    set({ user: null, role: null, token: '', isAuthenticated: false });
  },
}));
