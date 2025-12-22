import axiosClient from '../api/axiosClient';

export const authService = {
  // GİRİŞ YAP (Sadece UserName ve Password)
  login: async (userName, password) => {
    return await axiosClient.post('/Auth/login', { 
        UserName: userName, 
        Password: password 
    });
  },

  // KAYIT OL (Detaylı DTO)
  register: async (registerData) => {
    // registerData içinden parçalayıp Backend formatına çeviriyoruz
    return await axiosClient.post('/Auth/register', { 
        FirstName: registerData.firstName,
        LastName: registerData.lastName,
        UserName: registerData.userName,
        Email: registerData.email,
        Password: registerData.password
    });
  },
  changePassword: async (passwordData) => {
      const response = await axiosClient.post('/Auth/change-password', passwordData);
      return response.data;
  },  
  getCurrentUser : async () => {
    const response = await axiosClient.get('/Auth/me');
    return response;
  }
};