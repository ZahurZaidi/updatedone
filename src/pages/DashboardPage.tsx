import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import DashboardHome from '../components/dashboard/DashboardHome';
import { useAuth } from '../context/AuthContext';
import ProgressTracker from '../components/dashboard/ProgressTracker';
import FacialAnalysis from '../components/dashboard/FacialAnalysis';
import IngredientChecker from '../components/dashboard/IngredientChecker';
import RoutineGenerator from '../components/dashboard/RoutineGenerator';
import QuickFix from '../components/dashboard/QuickFix';
import Settings from '../components/dashboard/Settings';

const DashboardPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <main className="pt-6">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/progress" element={<ProgressTracker />} />
            <Route path="/analysis" element={<FacialAnalysis />} />
            <Route path="/ingredients" element={<IngredientChecker />} />
            <Route path="/routine" element={<RoutineGenerator />} />
            <Route path="/quickfix" element={<QuickFix />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;