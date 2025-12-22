import { create } from 'zustand';
import { vehicleService } from '../services/vehicleService';
const useVehicleStore = create((set, get) => ({
  vehicles: [],
  isLoading: false,
  error: null,
  updatingId : null,
  // Tüm araçları çek
  fetchVehicles: async () => {
    set({ isLoading: true });
    try {
      const data = await vehicleService.getAll();
      console.log(data);
      
      set({ vehicles: data, isLoading: false });
    } catch (error) {
      set({ error: "Araçlar yüklenirken bir hata oluştu", isLoading: false });
    }
  },

  // Yeni araç ekle
  addVehicle: async (vehicleData) => {
    set({ isLoading: true });
    try {
      await vehicleService.create(vehicleData);
      // Listeyi yeniden çekmek yerine mevcut listeyi güncellemek performansı artırır
      await get().fetchVehicles(); 
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.message };
    }
  },

  // Araç aktiflik durumunu değiştir
  toggleVehicleStatus: async (id) => {
    set({ updatingId: id });
    try {
      await vehicleService.toggleActive(id);
      await get().fetchVehicles();
    } catch (error) {
      console.error("Durum değiştirilemedi", error);
    }   finally {
      set({ updatingId: null });
    }
  },

  // Araç güncelle
  updateVehicle: async (vehicleData) => {
    set({ isLoading: true });
    try {
      await vehicleService.update(vehicleData);
      await get().fetchVehicles();
      set({ isLoading: false });
    } catch (error) {
      set({ error: "Güncelleme hatası", isLoading: false });
    }
  }
}));

export default useVehicleStore;