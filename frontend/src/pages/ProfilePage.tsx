import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Mail, Phone, User, Edit, LogOut, ShieldCheck } from 'lucide-react';
import { getApiEndpoint, getUploadUrl } from '../utils/api';

const ProfilePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
  }, []);
  const { currentUser, setCurrentUser, logout } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Handler for image change
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser) return;
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Show local preview immediately
      const localUrl = URL.createObjectURL(file);
      setAvatarPreview(localUrl);

      const formData = new FormData();
      formData.append('avatar', file);

      // Upload to backend
      const response = await fetch(getApiEndpoint('/api/users/avatar'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tagalong-token')}`
        },
        body: formData
      });
      const data = await response.json();
      if (data.avatarUrl && data.user) {
        setCurrentUser(data.user); // Use the updated user object from backend
        // setAvatarPreview(null); // Clear preview after upload
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="bg-white/90 shadow-2xl rounded-3xl p-10 text-center border border-teal-100">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">You are not logged in.</p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-2 rounded-xl font-semibold shadow-lg hover:from-teal-600 hover:to-blue-600 transition"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-teal-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-3xl w-full">
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-teal-400 via-blue-400 to-teal-200 opacity-60 blur-lg animate-pulse z-0"></div>
        {/* Glassmorphic Card */}
        <div className="relative bg-white/80 backdrop-blur-2xl shadow-2xl rounded-3xl p-10 flex flex-col md:flex-row gap-10 border border-teal-100 z-10">
          {/* Avatar and Actions */}
          <div className="flex flex-col items-center md:w-1/3 relative">
            <div className="relative">
              <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-teal-400 to-blue-400 opacity-30 blur"></span>
              <img
                src={avatarPreview || (currentUser.avatar ? currentUser.avatar : getUploadUrl(`/uploads/avatars/${currentUser.id}.jpg`))}
                alt={currentUser.name}
                className="w-36 h-36 rounded-full object-cover border-4 border-teal-200 shadow-xl relative z-10"
              />
              {/* Edit Image Button */}
              <label className="absolute bottom-2 left-2 bg-white/80 rounded-full p-2 shadow cursor-pointer hover:bg-teal-100 transition z-20">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Edit size={18} className="text-teal-600" />
              </label>
              {currentUser.isVerified && (
                <span className="absolute bottom-2 right-2 bg-teal-500 text-white rounded-full p-1 shadow-lg" title="Verified">
                  <ShieldCheck size={20} />
                </span>
              )}
            </div>
            <h2 className="mt-5 text-3xl font-extrabold text-gray-900 dark:text-white">{currentUser.name}</h2>
            <span className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-teal-100 to-blue-100 text-teal-700 border border-teal-200 shadow">
              {currentUser.role || 'User'}
            </span>
            <div className="flex gap-3 mt-7">
              <Link
                to="/settings"
                className="flex items-center px-5 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-medium shadow hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              >
                <Edit size={18} className="mr-2" />
                Edit Profile
              </Link>
              <button
                onClick={logout}
                className="flex items-center px-5 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              >
                <LogOut size={18} className="mr-2" />
                Sign Out
              </button>
            </div>
          </div>
          {/* Profile Details */}
          <div className="md:w-2/3 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Profile Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
              <div className="flex items-center">
                <User size={20} className="text-teal-500 mr-3" />
                <span className="font-semibold text-gray-600">Full Name:</span>
                <span className="ml-2 text-gray-900">{currentUser.name}</span>
              </div>
              <div className="flex items-center">
                <Mail size={20} className="text-teal-500 mr-3" />
                <span className="font-semibold text-gray-600">Email:</span>
                <span className="ml-2 text-gray-900">{currentUser.email}</span>
              </div>
              <div className="flex items-center">
                <Phone size={20} className="text-teal-500 mr-3" />
                <span className="font-semibold text-gray-600">Phone:</span>
                <span className="ml-2 text-gray-900">{currentUser.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-gray-600 mr-3">Member Since:</span>
                <span className="text-gray-900">{currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
              {/* Add more fields as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;