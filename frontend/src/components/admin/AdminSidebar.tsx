import React from 'react';
import { Link } from 'react-router-dom';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'users', label: 'Users', icon: 'users' },
    { id: 'parcels', label: 'Parcels', icon: 'package' },
    { id: 'trips', label: 'Trips', icon: 'map' },
    { id: 'payments', label: 'Payments', icon: 'credit-card' },
    { id: 'locations', label: 'Locations', icon: 'map-pin' },
    { id: 'tableau', label: 'Tableau', icon: 'bar-chart-2' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: 'message-circle' },
  ];
  
  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">TagAlong Admin</h2>
      </div>
      
      <nav>
        <ul>
          {tabs.map((tab) => (
            <li key={tab.id} className="mb-2">
              <button
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === tab.id ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
              >
                <i className={`lucide-${tab.icon} mr-3`}></i>
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto pt-8">
        <Link to="/" className="flex items-center p-3 text-gray-400 hover:text-white">
          <i className="lucide-log-out mr-3"></i>
          Back to Site
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;