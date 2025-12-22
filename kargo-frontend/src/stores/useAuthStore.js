import { create } from 'zustand';
import { authService } from '../services/AuthService';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: true, // Uygulama ilk açıldığında HER ZAMAN true başlamalı

  // --- INITIALIZE ---
  initialize: async () => {
    // Sayfa yenilendiğinde veya ilk açılışta loading'i tekrar true yapalım ki koruma devreye girsin
    set({ isLoading: true });
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const userData = await authService.getCurrentUser(); 
      
      set({ 
        user: userData, 
        token, 
        isAuthenticated: true, 
        isLoading: false // Veri geldi, artık sayfaları gösterebilirsin
      });
    } catch (error) {
      console.error("Oturum doğrulanamadı:", error);
      // Hata olsa bile isLoading'i false yapmalıyız ki uygulama login'e düşebilsin
      set({ user: null, isAuthenticated: false, isLoading: false });
      localStorage.removeItem('token');
    }
  },

  // --- LOGIN (Mevcut mantık korundu) ---
  login: async (userName, password, navigate) => {
    set({ isLoading: true });
    try {
      const response = await authService.login(userName, password);
      const token = response.token || response.data?.token; 
      
      if (token) {
        localStorage.setItem('token', token);
        const userData = await authService.getCurrentUser();

        set({ 
          token, 
          user: userData, 
          isAuthenticated: true, 
          isLoading: false 
        });

        if (userData.role === 'Admin') {
          navigate('/admin/operations');
        } else {
          navigate('/user/create-request');
        }
      } else {
        throw new Error("Token alınamadı");
      }
    } catch (error) {
      set({ isLoading: false, isAuthenticated: false });
      throw error;
    }
  },

  // --- REGISTER (Mevcut mantık korundu) ---
  register: async (formData) => {
    set({ isLoading: true });
    try {
      await authService.register(formData);
      set({ isLoading: false });
      return true; 
    } catch (error) {
      set({ isLoading: false });
      return false;
    }
  },

  // --- CHANGE PASSWORD (Mevcut mantık korundu) ---
  changePassword: async (currentPassword, newPassword) => {
      set({ isLoading: true });
      try {
        await authService.changePassword({ currentPassword, newPassword });
        set({ isLoading: false });
        return { success: true };
      } catch (error) {
        set({ isLoading: false });
        const errorMessage = error.response?.data?.[0] || error.response?.data?.message || "Şifre değiştirilemedi.";
        return { success: false, error: errorMessage };
      }
    },  

  // --- LOGOUT ---
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    window.location.href = '/login';
  }
}));

export default useAuthStore;