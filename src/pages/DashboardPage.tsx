import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import DashboardHome from '../components/dashboard/DashboardHome';
import SkinAssessment from '../components/assessment/SkinAssessment';
import { useAuth } from '../context/AuthContext';
import FacialAnalysis from '../components/dashboard/FacialAnalysis';
import IngredientChecker from '../components/dashboard/IngredientChecker';
import RoutineGenerator from '../components/dashboard/RoutineGenerator';
import ProgressTracker from '../components/dashboard/ProgressTracker';
import Settings from '../components/dashboard/Settings';

const DashboardPage: React.FC = () => {
  const { isAuthenticated, loading, hasCompletedAssessment, user } = useAuth();
  const location = useLocation();
  
  // Debug logging
  useEffect(() => {
    console.log('DashboardPage render:', {
      isAuthenticated,
      loading,
      hasCompletedAssessment,
      user: user?.email,
      pathname: location.pathname
    });
  }, [isAuthenticated, loading, hasCompletedAssessment, user, location.pathname]);
  
  // Show loading state with timeout
  if (loading) {
    console.log('DashboardPage: Showing loading state');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">This should only take a moment</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('DashboardPage: User not authenticated, redirecting to login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Show the dashboard with assessment as the first feature
  console.log('DashboardPage: Showing dashboard with assessment status:', hasCompletedAssessment);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 ml-64">
        <main className="pt-6">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/assessment" element={<SkinAssessment />} />
            <Route path="/analysis" element={<FacialAnalysis />} />
            <Route path="/ingredients" element={<IngredientChecker />} />
            <Route path="/routine" element={<RoutineGenerator />} />
            <Route path="/progress" element={<ProgressTracker />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;