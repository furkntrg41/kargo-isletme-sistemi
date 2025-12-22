import { create } from 'zustand';
import { dashboardService } from '../services/dashboardService';
const useDashboardStore = create((set) => ({
  summary: null,
  weeklyStats: [],
  heatmapData: [],
  statusDistribution: [],
  alerts: [],
  
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [summary, weeklyStats, heatmapData, statusDistribution, alerts] = await Promise.all([
        dashboardService.getSummary(),
        dashboardService.getWeeklyActivity(),
        dashboardService.getHeatMapData(),
        dashboardService.getStatusDistribution(),
        dashboardService.getAlerts()
      ]);
      
      set({
        summary,
        weeklyStats,
        heatmapData,
        statusDistribution,
        alerts,
        isLoading: false
      });

    } catch (error) {
      console.error("Dashboard verileri alınamadı:", error);
      set({ error: error.message, isLoading: false });
    }
  }
}));

export default useDashboardStore;