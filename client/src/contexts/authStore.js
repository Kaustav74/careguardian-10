import { create } from 'zustand';

const demoPatient = { id: '', name: 'Riya Sharma', email: 'riya@example.com', subscription: 'free' };

export const useAuthStore = create((set) => ({
  user: demoPatient,
  role: 'patient',
  setAuth: (user, role) => set({ user, role }),
  setSubscription: (subscription) => set((state) => ({ user: { ...state.user, subscription } })),
  logout: () => set({ user: null, role: null }),
}));
