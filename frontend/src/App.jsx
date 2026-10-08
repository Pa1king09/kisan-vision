import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// UI Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Recommend from './pages/Recommend';
import MyFarm from './pages/MyFarm';
import History from './pages/History';
import FarmIntelligence from './pages/FarmIntelligence';
import DiseaseDetection from './pages/DiseaseDetection';
import FarmCalendar from './pages/FarmCalendar';
import LoanEligibility from './pages/LoanEligibility';
import MarketForecast from './pages/MarketForecast';
import Forum from './pages/Forum';
import SatelliteFieldMapping from './pages/SatelliteFieldMapping';
import Marketplace from './pages/Marketplace';
import WeatherAlerts from './pages/WeatherAlerts';
import EquipmentRental from './pages/EquipmentRental';
import OrganicRecipes from './pages/OrganicRecipes';
import PmfbyClaim from './pages/PmfbyClaim';
import LandLease from './pages/LandLease';
import Login from './pages/Login';
import Register from './pages/Register';
import LanguageSelect from './pages/LanguageSelect';
import DownloadApp from './pages/DownloadApp';
import { AnimatePresence } from 'framer-motion';
import ScrollProgress from './components/effects/ScrollProgress';
import BackToTop from './components/effects/BackToTop';
import { AuthProvider } from './context/AuthContext';
import { RecommendationProvider } from './context/RecommendationContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AgroChatbot from './components/AgroChatbot';
import ErrorBoundary from './components/ErrorBoundary';
import AppUpdateModal from './components/AppUpdateModal';


const AppContent = () => {
  const location = useLocation();
  const isAuthRoute = ['/login', '/register', '/language', '/download', '/get-app', '/apk'].includes(location.pathname);
  const isHomePage = location.pathname === '/';

  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen bg-brand-bg">
        <ScrollProgress />
        <BackToTop />
        <Toaster
          position="top-center"
          gutter={8}
          containerStyle={{
            top: 54,
            left: 16,
            right: 16,
          }}
          toastOptions={{
            duration: 3500,
            style: {
              background: 'rgba(15, 23, 42, 0.95)',
              color: '#f8fafc',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5), 0 0 15px rgba(16, 185, 129, 0.1)',
              padding: '12px 18px',
              fontSize: '13px',
              fontWeight: '600',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              maxWidth: '90vw',
            },
            success: {
              style: {
                background: 'rgba(10, 26, 20, 0.96)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.25)',
                color: '#ecfdf5',
              },
              iconTheme: {
                primary: '#10b981',
                secondary: '#064e3b',
              },
            },
            error: {
              style: {
                background: 'rgba(26, 15, 20, 0.96)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(239, 68, 68, 0.25)',
                color: '#fee2e2',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#450a0a',
              },
            },
          }}
        />
        {!isAuthRoute && <Navbar />}
        <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/download" element={<DownloadApp />} />
            <Route path="/get-app" element={<DownloadApp />} />
            <Route path="/apk" element={<DownloadApp />} />

            {/* Language selection page — protected, shown after login */}
            <Route path="/language" element={
              <ProtectedRoute>
                <LanguageSelect />
              </ProtectedRoute>
            } />

            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />

            <Route path="/recommend" element={
              <ProtectedRoute>
                <Recommend />
              </ProtectedRoute>
            } />

            <Route path="/my-farm" element={
              <ProtectedRoute>
                <MyFarm />
              </ProtectedRoute>
            } />

            <Route path="/history" element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />

            <Route path="/intelligence" element={
              <ProtectedRoute>
                <FarmIntelligence />
              </ProtectedRoute>
            } />

            <Route path="/disease-detection" element={
              <ProtectedRoute>
                <DiseaseDetection />
              </ProtectedRoute>
            } />

            <Route path="/farm-calendar" element={
              <ProtectedRoute>
                <FarmCalendar />
              </ProtectedRoute>
            } />

            <Route path="/loan-eligibility" element={
              <ProtectedRoute>
                <LoanEligibility />
              </ProtectedRoute>
            } />

            <Route path="/market-forecast" element={
              <ProtectedRoute>
                <MarketForecast />
              </ProtectedRoute>
            } />

            <Route path="/forum" element={
              <ProtectedRoute>
                <Forum />
              </ProtectedRoute>
            } />

            <Route path="/satellite-mapping" element={
              <ProtectedRoute>
                <SatelliteFieldMapping />
              </ProtectedRoute>
            } />

            <Route path="/marketplace" element={
              <ProtectedRoute>
                <Marketplace />
              </ProtectedRoute>
            } />

            <Route path="/weather-alerts" element={
              <ProtectedRoute>
                <WeatherAlerts />
              </ProtectedRoute>
            } />

            <Route path="/equipment" element={
              <ProtectedRoute>
                <EquipmentRental />
              </ProtectedRoute>
            } />

            <Route path="/organic-recipes" element={
              <ProtectedRoute>
                <OrganicRecipes />
              </ProtectedRoute>
            } />

            <Route path="/pmfby-claim" element={
              <ProtectedRoute>
                <PmfbyClaim />
              </ProtectedRoute>
            } />

            <Route path="/land-lease" element={
              <ProtectedRoute>
                <LandLease />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {!isAuthRoute && <AgroChatbot />}
        {!isAuthRoute && !isHomePage && <Footer />}
        <AppUpdateModal />
      </div>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <RecommendationProvider>
              <AppContent />
            </RecommendationProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}


export default App;
