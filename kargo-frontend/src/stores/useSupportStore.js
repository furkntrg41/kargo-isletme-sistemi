import { supportService } from "../services/supportService";
import { create } from "zustand";
import { toast } from "react-toastify";

const useSupportStore = create((set, get) => ({
  myTickets: [],      // Kullanıcının kendi biletleri
  allTickets: [],     // Admin için tüm biletler
  isLoading: false,

  // --- KULLANICI İŞLEMLERİ ---
  fetchMyTickets: async () => {
    set({ isLoading: true });
    try {
      const data = await supportService.getMyTickets();
      set({ myTickets: data, isLoading: false });
    } catch (error) {
      toast.error("Destek geçmişi yüklenemedi.");
      set({ isLoading: false });
    }
  },

  createNewTicket: async (ticketData) => {
    set({ isLoading: true });
    try {
      await supportService.createTicket(ticketData);
      set({ isLoading: false });
      return true;
    } catch (error) {
      toast.error("Talep gönderilemedi.");
      set({ isLoading: false });
      return false;
    }
  },

  reopenTicket: async (ticketId, newMessage) => {
    set({ isLoading: true });
    try {
      await supportService.reOpenTicket(ticketId, newMessage);
      await get().fetchMyTickets();
      set({ isLoading: false });
      return true;
    } catch (error) {
      const errorMsg = typeof error.response?.data === 'string' ? error.response.data : "Mesaj gönderilemedi.";
      toast.error(errorMsg);
      set({ isLoading: false });
      return false;
    }
  },

  // --- ADMİN İŞLEMLERİ ---
  fetchAllTickets: async () => {
    set({ isLoading: true });
    try {
      const data = await supportService.getAllTickets(); // Serviste bu metod olmalı
      set({ allTickets: data, isLoading: false });
    } catch (error) {
      toast.error("Tüm talepler yüklenemedi.");
      set({ isLoading: false });
    }
  },

  replyTicket: async (ticketId, replyMessage) => {
    set({ isLoading: true });
    try {
      await supportService.replyTicket(ticketId, replyMessage); // Serviste bu metod olmalı
      await get().fetchAllTickets(); // Admin listesini tazele
      set({ isLoading: false });
      return true;
    } catch (error) {
      toast.error("Cevap gönderilemedi.");
      set({ isLoading: false });
      return false;
    }
  },

  closeTicket: async (ticketId) => {
    set({ isLoading: true });
    try {
      await supportService.closeTicket(ticketId);
      toast.info("Talep kapatıldı.");
      
      // Hem admin listesini hem kullanıcı listesini (hangisi gerekliyse) tazele
      await get().fetchAllTickets(); 
      await get().fetchMyTickets(); 

      set({ isLoading: false });
    } catch (error) {
      toast.error("Hata oluştu.");
      set({ isLoading: false });
    }
  },
}));

export default useSupportStore;