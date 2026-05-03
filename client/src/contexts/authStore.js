import { create } from 'zustand';

const demoPatient = { name: 'Riya Sharma', email: 'riya@example.com' };

export const useAuthStore = create((set) => ({
  user: demoPatient,
  role: 'patient',
  setAuth: (user, role) => set({ user, role }),
  logout: () => set({ user: null, role: null }),
}));
