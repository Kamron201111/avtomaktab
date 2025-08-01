import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./AuthContext.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Admin from "./pages/Admin.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminDarsliklar from "./pages/AdminDarsliklar.jsx";
import AdminSorovlar from "./pages/AdminSorovlar.jsx";
import Test from "./pages/Test.jsx";
import Stats from "./pages/Stats.jsx";
import Darsliklar from "./pages/Darsliklar.jsx";
import Contact from "./pages/Contact.jsx";
import { useAuth } from "./AuthContext.jsx";

// Protected Route komponenti
function ProtectedRoute({ children, requireAuth = false, requireAdmin = false }) {
  const { user, isAdmin } = useAuth();
  
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Barcha foydalanuvchilar uchun */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/test" element={<Test />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Login qilgan foydalanuvchilar uchun */}
      <Route 
        path="/darsliklar" 
        element={
          <ProtectedRoute requireAuth={true}>
            <Darsliklar />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/stats" 
        element={
          <ProtectedRoute requireAuth={true}>
            <Stats />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin uchun */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <Admin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-users" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminUsers />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-darsliklar" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDarsliklar />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-sorovlar" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminSorovlar />
          </ProtectedRoute>
        } 
      />
      
      {/* Noto'g'ri yo'l uchun */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App; 