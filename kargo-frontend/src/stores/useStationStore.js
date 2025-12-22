import { create } from "zustand";
import {stationService} from "../services/stationService";
const useStationStore = create((set,get) => ({
  stations: [],
  isLoading: false,
  updatingId: null,
  fetchStations: async () => {
    set({ isLoading: true });
    try {
      const data = await stationService.getAllStations();

      set({ stations: data, isLoading: false });
    } catch (error) {
      console.error("İstasyonlar yüklenemedi:", error);
      set({ isLoading: false });
    }
  },
  addStation: async (stationData) => {
    set({ isLoading: true });
    try {
      await stationService.create(stationData);
      await get().fetchStations();
      set({ success: true });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },
  toggleActive: async (id) => {
    set({ updatingId: id });
    try {
      await stationService.toggleActive(id);
      await get().fetchStations();
    } finally {
      set({ updatingId: null });
    }
  },
  toggleDepot: async (id) => {
    set({ updatingId: id });
    try {
      await stationService.toggleDepot(id);
      await get().fetchStations();
    }
    finally {
      set({ updatingId: null });
    }
  }
}));

export default useStationStore;
