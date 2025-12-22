import axiosClient from "../api/axiosClient";

export const reportService = {
  getPlanningHistory: async (startDate, endDate) => {
    const response = await axiosClient.get(`/Optimization/history`, {
      params: { startDate, endDate },
    });
    
    return response;
  },
  // Belirli bir planın detaylı rota analizini getirir
  getPlanDetails: async (id) => {
    const response = await axiosClient.get(`/Optimization/run-details/${id}`);
    return response;
  },
};
