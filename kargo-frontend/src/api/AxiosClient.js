import axios from 'axios';
import { toast } from 'react-toastify';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5225/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// REQUEST INTERCEPTOR
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// RESPONSE INTERCEPTOR
axiosClient.interceptors.response.use(
  (response) => {
    const { silent, successMessage } = response.config;

    // Sadece başarılı ve silent olmayan, veri değiştiren (POST, PUT, DELETE, PATCH) isteklerde toast göster
    if (!silent && ['post', 'put', 'delete', 'patch'].includes(response.config.method)) {
      toast.success(successMessage || 'İşlem başarıyla tamamlandı.', {
        icon: "🚀" // İstersen özel ikon ekleyebilirsin
      });
    }

    return response.data; 
  },
  (error) => {
    const { silent } = error.config || {};

    // 1. OTURUM HATASI (401)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        toast.warn("Oturum süreniz doldu, yönlendiriliyorsunuz...");
        setTimeout(() => { window.location.href = '/login'; }, 1500);
      }
      return Promise.reject(error);
    }

    // 2. SESSİZ MOD DEĞİLSE HATA MESAJINI BUL VE GÖSTER
    if (!silent) {
      let errorMessage = "Beklenmedik bir hata oluştu.";

      // Backend'den gelen hata mesajını ayıklama (String, Obje veya Liste olabilir)
      const data = error.response?.data;
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data?.message) {
        errorMessage = data.message;
      } else if (data?.errors) {
        // Validation hataları varsa ilkini al
        errorMessage = Object.values(data.errors)[0][0];
      } else if (Array.isArray(data)) {
        errorMessage = data[0];
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000
      });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;