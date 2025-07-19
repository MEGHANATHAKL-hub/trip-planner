import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loading from './components/common/Loading';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import TripDetail from './pages/TripDetail';
import TripForm from './components/trip/TripForm';
import UserDirectory from './pages/UserDirectory';
import UserProfile from './pages/UserProfile';

const AppRoutes = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/trips/new" 
        element={
          <ProtectedRoute>
            <TripForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/trips/:id" 
        element={
          <ProtectedRoute>
            <TripDetail />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/trips/:id/edit" 
        element={
          <ProtectedRoute>
            <TripForm />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <ProtectedRoute>
            <UserDirectory />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/users/:userId" 
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Navbar />
          <main className="pb-safe">
            <AppRoutes />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
