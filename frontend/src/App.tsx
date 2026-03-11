import { useEffect } from 'react';
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
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/mytrips" element={<MyTripsPage />} />
                <Route path="/myparcel" element={<MyParcelPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/messages" element={<ChatPage />} />
                <Route path="/notifications" element={<Notification />} />
                <Route path="/admin" element={<AdminDashboard />} />
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