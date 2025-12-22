import axiosClient from '../api/axiosClient';

export const optimizationService = {
  // Simülasyon (DB'ye yazmaz, sonucu döner)
  runSimulation: async (payload) => {
    // payload: { planName, mode, objective, isSimulation: true }
    return await axiosClient.post('/Optimization/run', payload);
  },

  // Gerçek İşlem (DB'ye yazar)
  confirmOperation: async (payload) => {
    // payload: { ..., isSimulation: false }
    return await axiosClient.post('/Optimization/run', payload);
  },
  activeOperation: async () => {
    // payload: { ..., isSimulation: false }
    return await axiosClient.get('/Optimization/active');
  },
  completeOperation : async (id) => {
    const response = await axiosClient.post(`/Optimization/complete/${id}`);
    return response.data;
  }
};