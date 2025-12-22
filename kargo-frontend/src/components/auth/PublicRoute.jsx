import { Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();

  // Initialize sürecini bekle
  if (isLoading) {
    return null; // Veya küçük bir loading spinner
  }

  if (isAuthenticated && user) {
    // Giriş yapmışsa rolüne göre yönlendir
    const userRole = (user.role || user.Role || "").toLowerCase();
    return <Navigate to={userRole === 'admin' ? '/admin/operations' : '/user/create-request'} replace />;
  }

  // Giriş yapmamışsa login sayfasını göster
  return children;
};

export default PublicRoute;