import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Mail, Phone, User, Edit, LogOut, ShieldCheck, MapPin, Calendar, Package, Plane, Settings, Camera } from 'lucide-react';
import { getApiEndpoint, getUploadUrl } from '../utils/api';
import { gsap } from 'gsap';

const ProfilePage: React.FC = () => {
  const { currentUser, setCurrentUser, logout } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (cardRef.current) {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 40, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
    if (detailsRef.current) {
      gsap.fromTo(detailsRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, delay: 0.3, ease: 'power3.out' }
      );
    }
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser) return;
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const localUrl = URL.createObjectURL(file);
      setAvatarPreview(localUrl);

      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const response = await fetch(getApiEndpoint('/api/users/avatar'), {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('tagalong-token')}`
          },
          body: formData
        });
        const data = await response.json();
        if (data.avatarUrl && data.user) {
          setCurrentUser(data.user);
        }
      } catch (err) {
        console.error('Avatar upload failed:', err);
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="bg-white/90 dark:bg-gray-800/90 shadow-2xl rounded-3xl p-10 text-center border border-teal-100 dark:border-gray-700">
          <User className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">You need to log in to view your profile.</p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-teal-600 hover:to-blue-600 transition"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  const avatarSrc = avatarPreview || (currentUser.avatar ? currentUser.avatar : getUploadUrl(`/uploads/avatars/${currentUser.id}.jpg`));
  const memberSince = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-200 dark:bg-teal-900 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] bg-blue-200 dark:bg-blue-900 rounded-full opacity-15 blur-3xl" />
      </div>

      <div ref={cardRef} className="max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Gradient banner */}
          <div className="h-40 bg-gradient-to-r from-teal-500 via-blue-500 to-teal-400 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
          </div>

          {/* Avatar - positioned to overlap banner */}
          <div className="flex flex-col items-center -mt-20 relative z-10 px-6">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 opacity-60 blur group-hover:opacity-80 transition-opacity" />
              <img
                src={avatarSrc}
                alt={currentUser.name}
                className="relative w-36 h-36 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl"
              />
              {/* Camera overlay on hover */}
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Camera size={28} className="text-white" />
              </label>
              {currentUser.isVerified && (
                <span className="absolute bottom-1 right-1 bg-teal-500 text-white rounded-full p-1.5 shadow-lg border-2 border-white dark:border-gray-800" title="Verified User">
                  <ShieldCheck size={18} />
                </span>
              )}
            </div>

            {/* Name & Role */}
            <h1 className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">{currentUser.name}</h1>
            <span className="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-teal-100 to-blue-100 dark:from-teal-900/50 dark:to-blue-900/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
              <ShieldCheck size={14} />
              {currentUser.role || 'Member'}
            </span>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 mb-8 justify-center">
              <Link
                to="/settings"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl font-medium shadow-lg hover:from-teal-600 hover:to-blue-600 hover:shadow-xl transition-all duration-200"
              >
                <Settings size={18} />
                Edit Profile
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium shadow hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div ref={detailsRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Contact Info Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/50">
                <User size={18} className="text-teal-600 dark:text-teal-400" />
              </div>
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 min-w-0">
                <Mail size={18} className="text-teal-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium truncate" title={currentUser.email}>
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-teal-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {currentUser.phone || 'Not provided'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-teal-500 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Member Since</p>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {memberSince}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg dark:shadow-gray-900/30 border border-gray-100 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <MapPin size={18} className="text-blue-600 dark:text-blue-400" />
              </div>
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                to="/mytrips"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-900/50 group-hover:bg-teal-200 dark:group-hover:bg-teal-800/50 transition-colors">
                  <Plane size={18} className="text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">My Trips</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">View and manage your trips</p>
                </div>
              </Link>
              <Link
                to="/myparcel"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                  <Package size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">My Parcels</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Track your shipments</p>
                </div>
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                  <Settings size={18} className="text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Settings</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Account preferences & security</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;