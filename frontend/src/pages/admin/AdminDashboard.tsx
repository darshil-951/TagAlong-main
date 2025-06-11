import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import UserAnalytics from '../../components/admin/UserAnalytics';
import ParcelAnalytics from '../../components/admin/ParcelAnalytics';
import TripAnalytics from '../../components/admin/TripAnalytics';
import PaymentAnalytics from '../../components/admin/PaymentAnalytics';
import LocationAnalytics from '../../components/admin/LocationAnalytics';
import AIAssistant from '../../components/admin/AIAssistant';
import TableauDashboard from '../../components/admin/TableauDashboard';

const AdminDashboard: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  
  // Check if user is admin
  if (!isAuthenticated || currentUser?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {activeTab === 'users' && <UserAnalytics />}
        {activeTab === 'parcels' && <ParcelAnalytics />}
        {activeTab === 'trips' && <TripAnalytics />}
        {activeTab === 'payments' && <PaymentAnalytics />}
        {activeTab === 'locations' && <LocationAnalytics />}
        {activeTab === 'tableau' && <TableauDashboard />}
        {activeTab === 'ai-assistant' && <AIAssistant />}
      </div>
    </div>
  );
};

export default AdminDashboard;