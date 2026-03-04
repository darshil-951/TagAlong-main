import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { Bell, Lock, Trash, Mail, Phone, Edit, Check, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getApiEndpoint } from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const SettingsPage: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { isDark, toggleTheme } = useTheme();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const { currentUser, setCurrentUser, logout } = useAuth();

  // Use backend data as initial state
  const [email, setEmail] = useState(currentUser?.email || '');
  const [editingEmail, setEditingEmail] = useState(false);
  const [tempEmail, setTempEmail] = useState(email);

  const [phoneNumber, setPhoneNumber] = useState(currentUser?.phone || '');
  const [editingPhone, setEditingPhone] = useState(false);
  const [tempPhone, setTempPhone] = useState(phoneNumber);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  // Update email in backend
  const handleSaveEmail = async () => {
    try {
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      const response = await fetch(getApiEndpoint('/api/users/update-email'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email: tempEmail }),
      });
      if (!response.ok) throw new Error('Failed to update email');
      const data = await response.json();
      setEmail(data.user.email);
      setCurrentUser((prev: any) => prev ? { ...prev, email: data.user.email } : prev);
      setEditingEmail(false);
    } catch (err) {
      alert('Failed to update email');
    }
  };

  // Update phone in backend
  const handleSavePhone = async () => {
    try {
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      const response = await fetch(getApiEndpoint('/api/users/update-phone'), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ phone: tempPhone }),
      });
      if (!response.ok) throw new Error('Failed to update phone');
      const data = await response.json();
      setPhoneNumber(data.user.phone);
      setCurrentUser((prev: any) => prev ? { ...prev, phone: data.user.phone } : prev);
      setEditingPhone(false);
    } catch (err) {
      alert('Failed to update phone');
    }
  };

  // Change password in backend
  const handlePasswordChange = async () => {
    try {
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      const response = await fetch(getApiEndpoint('/api/users/change-password'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (!response.ok) throw new Error('Password change failed');
      alert('Password changed successfully');
    } catch (err) {
      alert('Old password is incorrect or change failed');
    }
  };

  // Delete account in backend
  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      const response = await fetch(getApiEndpoint('/api/users/delete-account'), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ password: deletePassword }),
      });
      if (!response.ok) throw new Error('Delete failed');
      logout();
      alert('Account deleted');
    } catch (err) {
      alert('Incorrect password. Account not deleted.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center font-sans"><u>Settings</u></h1>

        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
          <div className="space-y-6">
            {/* Email */}
            <div className="flex justify-between items-center">
              <span className="flex items-center text-lg font-medium text-gray-700 dark:text-gray-300">
                <Mail className="mr-2" /> Email
              </span>
              <div className="flex items-center">
                {editingEmail ? (
                  <>
                    <input
                      type="email"
                      value={tempEmail}
                      onChange={e => setTempEmail(e.target.value)}
                      className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-teal-500 focus:border-teal-500 p-2 mr-2"
                    />
                    <button
                      onClick={handleSaveEmail}
                      className="text-green-600 hover:text-green-800 mr-1"
                      title="Save"
                    >
                      <Check />
                    </button>
                    <button
                      onClick={() => {
                        setTempEmail(email);
                        setEditingEmail(false);
                      }}
                      className="text-red-500 hover:text-red-700"
                      title="Cancel"
                    >
                      <X />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-gray-700 dark:text-gray-300 mr-2">{email}</span>
                    <button
                      onClick={() => setEditingEmail(true)}
                      className="text-teal-500 hover:text-teal-600 transition"
                      title="Edit Email"
                    >
                      <Edit />
                    </button>
                  </>
                )}
              </div>
            </div>
            {/* Phone */}
            <div className="flex justify-between items-center">
              <span className="flex items-center text-lg font-medium text-gray-700 dark:text-gray-300">
                <Phone className="mr-2" /> Phone Number
              </span>
              <div className="flex items-center">
                {editingPhone ? (
                  <>
                    <input
                      type="tel"
                      value={tempPhone}
                      onChange={e => setTempPhone(e.target.value)}
                      className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-teal-500 focus:border-teal-500 p-2 mr-2"
                    />
                    <button
                      onClick={handleSavePhone}
                      className="text-green-600 hover:text-green-800 mr-1"
                      title="Save"
                    >
                      <Check />
                    </button>
                    <button
                      onClick={() => {
                        setTempPhone(phoneNumber);
                        setEditingPhone(false);
                      }}
                      className="text-red-500 hover:text-red-700"
                      title="Cancel"
                    >
                      <X />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-gray-700 dark:text-gray-300 mr-2">{phoneNumber}</span>
                    <button
                      onClick={() => setEditingPhone(true)}
                      className="text-teal-500 hover:text-teal-600 transition"
                      title="Edit Phone"
                    >
                      <Edit />
                    </button>
                  </>
                )}
              </div>
            </div>
            {/* Change Password */}
            <div className="flex justify-between items-center">
              <span className="flex items-center text-lg font-medium text-gray-700 dark:text-gray-300">
                <Lock className="mr-2" /> Change Password
              </span>
              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className={`px-4 py-2 rounded-md transition ${showPasswordChange ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'
                  } text-white`}
              >
                {showPasswordChange ? 'Hide' : 'Show'} Change Password
              </button>
            </div>
            {showPasswordChange && (
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow-inner">
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-md focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 mb-2"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-md focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5 mb-2"
                />
                <button
                  onClick={handlePasswordChange}
                  className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition w-full"
                >
                  Change Password
                </button>
              </div>
            )}
            {/* Notifications */}
            <div className="flex justify-between items-center">
              <span className="flex items-center text-lg font-medium text-gray-700">
                <Bell className="mr-2" /> Enable Notifications
              </span>
              <Switch
                checked={notificationsEnabled}
                onChange={setNotificationsEnabled}
                className={`${notificationsEnabled ? 'bg-teal-500' : 'bg-gray-200'
                  } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
              >
                <span
                  className={`${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
            </div>
            {/* Dark Mode */}
            <div className="flex justify-between items-center">
              <span className="flex items-center text-lg font-medium text-gray-700 dark:text-gray-300">
                {isDark ? <Moon className="mr-2" /> : <Sun className="mr-2" />} Dark Mode
              </span>
              <Switch
                checked={isDark}
                onChange={toggleTheme}
                className={`${isDark ? 'bg-teal-500' : 'bg-gray-200'
                  } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
              >
                <span
                  className={`${isDark ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
            </div>
            {/* Language
            <div className="flex justify-between items-center">
              <span className="flex items-center text-lg font-medium text-gray-700">
                <Globe className="mr-2" /> Language Preferences
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-teal-500 focus:border-teal-500 block w-32 p-2.5"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Gujarati</option>
                <option>French</option>
              </select>
            </div> */}
            {/* Delete Account */}
            <div className="flex justify-between items-center">
              <span className="flex items-center text-lg font-medium text-red-700">
                <Trash className="mr-2" /> Delete Account
              </span>
              <button
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Delete Account
              </button>
            </div>
            {showDeleteConfirm && (
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md shadow-inner flex flex-col items-center">
                <input
                  type="password"
                  placeholder="Enter your password to confirm"
                  value={deletePassword}
                  onChange={e => setDeletePassword(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-red-500 focus:border-red-500 block w-full p-2.5 mb-2"
                />
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition w-full"
                >
                  Confirm Delete Account
                </button>
              </div>
            )}
          </div>
          <div className="mt-8 text-center">
            <Link
              to="/profile"
              className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-teal-500 to-blue-500 shadow-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300"
            >
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;