import axiosClient from "../api/axiosClient";

export const dashboardService = {
    getSummary : async () => {
        const response = await axiosClient.get('/dashboard/summary');        
        return response;
    },
    getWeeklyActivity : async () => {
        const response =  await axiosClient.get('/dashboard/weekly-activity');
        return response;
    },
    getHeatMapData : async () => {
        const response =  await axiosClient.get('/dashboard/heatmap');        
        return response;
    },
    getStatusDistribution : async () => {
        const response =   await axiosClient.get('/dashboard/status-distribution');
        return response;
    },
    getAlerts : async () => {
        const response =  await axiosClient.get('/dashboard/alerts');

        return response;
    }
}