import axiosClient from "../api/axiosClient";

export const cargoService = {
  // Yeni talep oluştur
  createRequest: async (cargoData) => {
    const response = await axiosClient.post('/CargoRequest', cargoData);
    return response.data;
  },
  // Kullanıcının kendi taleplerini getir
  getMyRequests: async () => {
    const response = await axiosClient.get('/CargoRequest/my-requests');
    
    return response;
  }
};