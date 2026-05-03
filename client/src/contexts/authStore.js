import { create } from 'zustand';
import { api } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  role: null,
  token: localStorage.getItem('cg_token') || '',
  loadingUser: false,
  setAuth: async (token) => {
    localStorage.setItem('cg_token', token);
    set({ token, loadingUser: true });
    const { data } = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    set({ user: data.user, role: data.user.role, loadingUser: false });
  },
  logout: () => {
    localStorage.removeItem('cg_token');
    set({ user: null, role: null, token: '' });
  },
}));
