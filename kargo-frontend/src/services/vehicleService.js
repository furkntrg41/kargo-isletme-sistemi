import axiosClient from "../api/axiosClient";

export const vehicleService = {
    getAll : async () => {
        const response = await axiosClient.get('/vehicle');
        return response;
    },
    create : async (vehicleData) => {
        const response = await axiosClient.post('/vehicle', vehicleData);
        return response;
    },
    update : async (vehicleData) => {
        const response = await axiosClient.put(`/vehicle`, vehicleData);
        return response;
    },
    toggleActive : async (id) => {
        const response = await axiosClient.patch(`/vehicle/${id}/toggle-active`);
        return response;
    }
}
