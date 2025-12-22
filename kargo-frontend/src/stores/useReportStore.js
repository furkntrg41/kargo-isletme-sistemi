import { create } from 'zustand';
import { reportService } from '../services/reportService';
export const useReportStore = create((set) => ({
  history: [],
  selectedPlan: null, // Tıklanan planın detayları burada tutulacak
  isLoading: false,
  isDetailLoading: false,

  fetchHistory: async () => {
    set({ isLoading: true });
    try {
      const data = await reportService.getPlanningHistory();
      console.log(data);
      
      set({ history: data, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  // YENİ: Tek bir planın detaylarını çek
  fetchPlanDetails: async (id) => {
    set({ isDetailLoading: true, selectedPlan: null });
    try {
      const data = await reportService.getPlanDetails(id);
      console.log(data);
      
      set({ selectedPlan: data, isDetailLoading: false });
    } catch (err) {
      set({ isDetailLoading: false });
    }
  },

  // Detay panelini kapatmak için
  clearSelectedPlan: () => set({ selectedPlan: null })
}));