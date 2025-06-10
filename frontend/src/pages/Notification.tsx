import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Notification as NotificationType } from '../types';
import { Bell, MessageCircle, AlertTriangle, CheckCircle, Info, ExternalLink, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      setNotifications(data.notifications || []);
      
      // Count unread notifications
      const unread = (data.notifications || []).filter((n: NotificationType) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      setError('Failed to load notifications. Please try again later.');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add this to your component's state
  const [markingRead, setMarkingRead] = useState<string | null>(null);
  
  // Then update the markAsRead function
  const markAsRead = async (notificationId: string) => {
    setMarkingRead(notificationId);
    try {
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    } finally {
      setMarkingRead(null);
    }
  };
  
  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    try {
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      const response = await fetch('/api/notifications/read-all', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Update unread count
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };
  
  const deleteNotification = async (notificationId: string | undefined) => {
    if (!notificationId) {
      console.error('Cannot delete notification: ID is undefined');
      return;
    }
    
    try {
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update local state
      const updatedNotifications = notifications.filter(n => n.id !== notificationId);
      setNotifications(updatedNotifications);
      
      // Update unread count if needed
      const deletedNotification = notifications.find(n => n.id === notificationId);
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-6 w-6 text-blue-500" />;
      case 'request':
        return <Bell className="h-6 w-6 text-orange-500" />;
      case 'status_update':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'verification':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Info className="h-6 w-6 text-teal-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <div className="flex space-x-4">
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-teal-600 hover:text-teal-800 font-medium text-sm"
              >
                Mark all as read
              </button>
            )}
            <button 
              onClick={fetchNotifications}
              className="text-teal-600 hover:text-teal-800 font-medium text-sm"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Bell className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">You don't have any notifications at the moment.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <li 
                  key={notification.id}
                  className={`${notification.read ? 'bg-white' : 'bg-teal-50'} 
                    ${markingRead === notification.id ? 'animate-pulse' : ''} 
                    hover:bg-gray-50 transition-colors`}
                >
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
                          <p className="text-sm text-gray-500">
                            {format(new Date(notification.createdAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{notification.content}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex space-x-4">
                            {notification.actionUrl && (
                              <Link 
                                to={notification.actionUrl} 
                                className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-800"
                              >
                                <span>View details</span>
                                <ExternalLink className="ml-1 h-4 w-4" />
                              </Link>
                            )}
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-sm text-gray-500 hover:text-gray-700"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-sm text-red-500 hover:text-red-700 flex items-center"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;