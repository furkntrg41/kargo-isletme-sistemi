import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/auth/ProtectedRoute";
// --- LAYOUTS ---
import AdminLayout from "./layouts/Admin/AdminLayout";
import UserLayout from "./layouts/User/UserLayout";

// --- PAGES ---
import Login from "./pages/auth/Login";
import Operations from "./pages/admin/Operations";
import VehicleManagement from "./pages/admin/VehicleManagement";
import ActiveOperations from "./pages/admin/ActiveOperations";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Stations from "./pages/admin/Stations";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import { useEffect } from "react";

import useAuthStore from "./stores/useAuthStore";
import CreateRequest from "./pages/user/CreateRequest";
import MyRequests from "./pages/user/MyRequests";
import Profile from "./pages/user/Profile";
import Support from "./pages/user/Support";
import MySupportTickets from "./pages/user/MySupportTickets";
import SupportManagement from "./pages/admin/SupportManagement";
import NotFound from "./pages/other/NotFound";
import PublicRoute from "./components/auth/PublicRoute";

function App() {
  const initialize = useAuthStore((state) => state.initialize);
  useEffect(() => {
    initialize();
  }, [initialize]);
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* PUBLIC: Herkese Açık */}
       <Route path="/" element={<Navigate to="/login" replace />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        {/* ADMIN ROUTES: Sadece "Admin" rolü girebilir */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/operations" replace />} />
          <Route path="operations" element={<Operations />} />
          <Route path="active-operation" element={<ActiveOperations />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="vehicles" element={<VehicleManagement />} />
          <Route path="station" element={<Stations />} />
          <Route path="settings" element={<Settings />} />
          <Route path="reports" element={<Reports />} />
          <Route path="support-tickets" element={<SupportManagement />} />
        </Route>
        {/* USER ROUTES: Sadece "Customer" rolü girebilir */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRole="Customer">
              <UserLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={<Navigate to="/user/create-request" replace />}
          />
          <Route path="create-request" element={<CreateRequest />} />
          <Route path="my-requests" element={<MyRequests />} />
          <Route path="profile" element={<Profile />} />
          <Route path="support" element={<Support />} />
          <Route path="my-tickets" element={<MySupportTickets />} />
        </Route>
        {/* CATCH ALL */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />{" "}
      </Routes>
    </>
  );
}

export default App;
