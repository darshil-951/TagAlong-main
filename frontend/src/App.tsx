import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
import FAQPage from './pages/FAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import HelpCenterPage from './pages/HelpCenterPage';
import { LoginPage, SignupPage } from './pages/AuthPages';
import ListTripPage from './pages/ListTripPage';
import { mockMessages } from './data/mockData';
import { Message } from './types';
import SettingsPage from './pages/SettingsPage';
import MyParcelPage from './pages/MyParcelPage';
import MyTripsPage from './pages/MyTripsPage';
import Notification from './pages/Notification';
import ChatPage from './pages/ChatPage';
import PaymentPage from './pages/PaymentPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import DebugUserPage from './pages/DebugUserPage';




// In the App component
function App() {
  useEffect(() => {
    // Set up page transitions or global animations here
    gsap.config({
      nullTargetWarn: false,
    });
  }, []);

  const handleSendMessage = (
    content: string,
    type: Message['type'],
    metadata?: Message['metadata']
  ) => {
    // Implement your message sending logic here
    // For demo, you can just log or update state
    console.log('Send message:', { content, type, metadata });
  };
  const handleTypingStart = () => { };
  const handleTypingEnd = () => { };

  // Initialize selectedUserId from localStorage or default to empty string
  const [selectedUserId, setSelectedUserId] = useState(() => {
    const savedChat = localStorage.getItem('tagalong-selected-chat');
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        return parsed.partnerId;
      } catch (e) {
        console.error('Error parsing saved chat:', e);
      }
    }
    return '';
  });

  // Update selectedUserId when localStorage changes
  // Update the storage event listener to handle changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'tagalong-selected-chat') {
        const savedChat = event.newValue;
        if (savedChat) {
          try {
            const parsed = JSON.parse(savedChat);
            setSelectedUserId(parsed.partnerId);
          } catch (e) {
            console.error('Error parsing saved chat:', e);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const filteredMessages = mockMessages.filter(msg =>
    (msg.senderId === selectedUserId || msg.receiverId === selectedUserId)
  );

  return (
    <ThemeProvider>
      <AuthProvider>
        <ChatProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/listings/create" element={<ListTripPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/help" element={<HelpCenterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/mytrips" element={<MyTripsPage />} />
                <Route path="/myparcel" element={<MyParcelPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/messages" element={<ChatPage />} />
                <Route path="/notifications" element={<Notification />} />
                <Route path="/admin" element={<AdminDashboard />} />
              // Add this route in your Routes component (around line 100)
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/debug-user" element={<DebugUserPage />} />
              </Routes>
            </Layout>
          </Router>
        </ChatProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;