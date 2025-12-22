import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  // 1. Yükleme Kontrolü
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 2. Kimlik Doğrulama Kontrolü
  if (!isAuthenticated || !user) {
    // ÖNEMLİ: Eğer login sayfasındaysak sonsuz döngüye girmemeli
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Rol Kontrolü (Daha Güvenli Hali)
  const userRole = (user.role || user.Role || "").toLowerCase();
  const requiredRole = (allowedRole || "").toLowerCase();

  if (allowedRole && userRole !== requiredRole) {
    // Yetkisi yoksa Admin'i admin paneline, User'ı user paneline at
    const fallbackPath = userRole === 'admin' ? '/admin/dashboard' : '/user/my-requests';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;