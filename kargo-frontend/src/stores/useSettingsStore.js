import { create } from 'zustand';
import { settingsService } from '../services/settingsService';
import { toast } from 'react-hot-toast'; // Opsiyonel bildirim kütüphanesi

const useSettingsStore = create((set, get) => ({
    config: {
        costPerKm: 1.0,
        rentalVehicleCost: 200.0,
        defaultRentalCapacityKg: 500.0,
        maxStopsPerRoute: 15,
        updatedAt: null
    },
    isLoading: false,

    // Veritabanından mevcut ayarları yükle
    fetchSettings: async () => {
        set({ isLoading: true });
        try {
            const data = await settingsService.getSettings();
            
            set({ config: data, isLoading: false });
        } catch (error) {
            console.error("Ayarlar yüklenemedi:", error);
            set({ isLoading: false });
        }
    },

    // Formdaki değişiklikleri yerel state'e işle
    updateLocalConfig: (newConfig) => {
        set((state) => ({
            config: { ...state.config, ...newConfig }
        }));
    },

    // Değişiklikleri veritabanına kaydet
    saveSettings: async () => {
        set({ isLoading: true });
        try {
            const currentConfig = get().config;
            const updatedData = await settingsService.updateSettings(currentConfig);
            set({ config: updatedData, isLoading: false });
            toast.success("Sistem ayarları başarıyla güncellendi!");
        } catch (error) {
            toast.error("Ayarlar kaydedilirken bir hata oluştu.");
            set({ isLoading: false });
        }
    }
}));

export default useSettingsStore;