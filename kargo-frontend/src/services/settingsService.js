import axiosClient from "../api/axiosClient";

export const settingsService = {
    // Mevcut ayarları getirir
    getSettings: async () => {
        const response = await axiosClient.get('/Settings');
        return response;
      },
    
    // Ayarları günceller (UpdateSettingsDto bekler)
    updateSettings: async (settingsData) => {
        const response = await axiosClient.put('/Settings', settingsData);
        return response;
    }
};