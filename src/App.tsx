import React from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";

import MainLayout from "./components/Layout/MainLayout";

import SupplyFormRouteWrapper from "./components/Supplies/SupplyFormRouteWrapper";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Login from "./pages/Login";
import Materials from "./pages/Materials";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import Suppliers from "./pages/Suppliers";
import Supplies from "./pages/Supplies";
import UsageLog from "./pages/UsageLog";
import UserProfile from "./pages/UserProfile";

const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({
  element,
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isAdmin ? <>{element}</> : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="materials" element={<Materials />} />
            <Route path="usage-log" element={<UsageLog />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="supplies" element={<Supplies />} />
            <Route path="employees" element={<Employees />} />
            <Route path="reports" element={<Reports />} />
            <Route path="user" element={<UserProfile />} />
            <Route
              path="order/:materialId"
              element={<SupplyFormRouteWrapper />}
            />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
