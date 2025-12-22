import axiosClient from "../api/axiosClient";

export const stationService = {
    getAllStations : () => {
        return axiosClient.get('/station',{silent:true});
    },
    create : async (stationData) => {
        return axiosClient.post('/station',stationData);
    },
    update : async (stationData) => {
        return axiosClient.put(`/station`,stationData);
    },
    toggleActive : async (id) => {
        return axiosClient.patch(`/station/${id}/toggle-active`);
    },
    toggleDepot : async (id) => {
        return axiosClient.patch(`/station/${id}/toggle-depot`);
    },
    delete : async (id) => {
        return axiosClient.delete(`/station/${id}`);
    }

 }
