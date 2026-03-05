import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApiEndpoint } from '../utils/api';
import { Bell, MessageCircle, AlertTriangle, CheckCircle, Info, Trash2, CheckCheck, RefreshCw, Package, ShieldCheck, Inbox } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { gsap } from 'gsap';

interface NotificationItem {
  _id: string;
  userId: string;
  type: 'message' | 'request' | 'status_update' | 'system' | 'verification';
  title: string;
  content: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
}

type FilterTab = 'all' | 'unread' | 'request' | 'status_update' | 'system';

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [markingRead, setMarkingRead] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (listRef.current && notifications.length > 0) {
      gsap.fromTo(listRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out' }
      );
    }
  }, [notifications, activeFilter]);

  const fetchNotifications = async () => {
    if (!currentUser) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      const response = await fetch(getApiEndpoint('/api/notifications'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to fetch notifications');

      const data = await response.json();
      const items: NotificationItem[] = data.notifications || [];
      setNotifications(items);
      setUnreadCount(items.filter(n => !n.read).length);
    } catch (err) {
      setError('Failed to load notifications. Please try again.');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    setMarkingRead(id);
    try {
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      const response = await fetch(getApiEndpoint(`/api/notifications/${id}/read`), {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed');

      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
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
      const response = await fetch(getApiEndpoint('/api/notifications/read-all'), {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed');

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      await fetch(getApiEndpoint(`/api/notifications/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const deleted = notifications.find(n => n._id === id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (deleted && !deleted.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'request': return <Package className="h-5 w-5 text-orange-500" />;
      case 'status_update': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'verification': return <ShieldCheck className="h-5 w-5 text-yellow-500" />;
      default: return <Info className="h-5 w-5 text-teal-500" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'message': return 'bg-blue-100 dark:bg-blue-900/40';
      case 'request': return 'bg-orange-100 dark:bg-orange-900/40';
      case 'status_update': return 'bg-green-100 dark:bg-green-900/40';
      case 'verification': return 'bg-yellow-100 dark:bg-yellow-900/40';
      default: return 'bg-teal-100 dark:bg-teal-900/40';
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !n.read;
    return n.type === activeFilter;
  });

  const filterTabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'request', label: 'Requests' },
    { key: 'status_update', label: 'Updates' },
    { key: 'system', label: 'System' },
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl p-8 text-center">
          <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-4">Please log in to view notifications.</p>
          <Link to="/login" className="inline-block bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-2 rounded-xl font-medium">Log In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500">
                <Bell className="h-6 w-6 text-white" />
              </div>
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2.5 py-0.5 text-sm font-bold text-white bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 rounded-lg transition-colors"
              >
                <CheckCheck size={16} />
                Mark all read
              </button>
            )}
            <button
              onClick={fetchNotifications}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeFilter === tab.key
                ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeFilter === tab.key
                  ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading notifications...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-red-400 mb-3" />
            <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
            <button onClick={fetchNotifications} className="mt-4 text-sm text-red-600 dark:text-red-400 underline">Try again</button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 inline-block mb-4">
              <Inbox className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {activeFilter === 'unread' ? 'All caught up!' : 'No notifications'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {activeFilter === 'unread'
                ? 'You have no unread notifications.'
                : 'You don\'t have any notifications yet. When someone sends you a parcel request or your trip gets an update, you\'ll see it here.'}
            </p>
          </div>
        ) : (
          <div ref={listRef} className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-sm border transition-all duration-300 hover:shadow-md group
                  ${notification.read
                    ? 'border-gray-100 dark:border-gray-700'
                    : 'border-teal-200 dark:border-teal-700 ring-1 ring-teal-100 dark:ring-teal-900/30'
                  }
                  ${markingRead === notification._id ? 'animate-pulse' : ''}
                `}
              >
                {/* Unread indicator dot */}
                {!notification.read && (
                  <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-teal-500 rounded-full animate-pulse" />
                )}

                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`flex-shrink-0 p-2.5 rounded-xl ${getIconBg(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-sm font-semibold leading-snug ${notification.read ? 'text-gray-800 dark:text-gray-200' : 'text-gray-900 dark:text-white'}`}>
                          {notification.title}
                        </h3>
                        <span className="flex-shrink-0 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {notification.content}
                      </p>

                      {/* Actions */}
                      <div className="mt-3 flex items-center gap-3">
                        {notification.actionUrl && (
                          <Link
                            to={notification.actionUrl}
                            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-300 transition-colors"
                          >
                            View details →
                          </Link>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="ml-auto text-xs text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;