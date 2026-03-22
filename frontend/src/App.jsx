import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Kundali from './pages/Kundali';
import Horoscope from './pages/Horoscope';
import Numerology from './pages/Numerology';
import PalmReading from './pages/PalmReading';
import FaceReading from './pages/FaceReading';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const InfoPage = ({ title, content }) => (
  <div style={{
    minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '5rem 1.5rem',
  }}>
    <div style={{
      background: '#0f0f14', border: '1px solid rgba(212,175,55,0.15)',
      borderRadius: 24, padding: '3.5rem', maxWidth: 640, width: '100%',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>✦</div>
      <h1 style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#d4af37' }}>{title}</h1>
      <p style={{ color: '#8a8aa8', lineHeight: 1.8, fontSize: '0.9rem', marginBottom: '2rem' }}>
        {content}
      </p>
      <Link to="/" style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.75rem 1.75rem',
        background: 'linear-gradient(135deg, #d4af37, #b8860b)',
        color: '#07070a', borderRadius: 10, fontWeight: 700, fontSize: '0.9rem',
        textDecoration: 'none',
      }}>
        ← Back to Home
      </Link>
    </div>
  </div>
);

const PAGES = {
  privacy: {
    title: 'Privacy Policy',
    content: 'Quantum Within is committed to protecting your privacy. We collect only the information necessary to provide our services (name, email, birth details for readings). Your personal data and uploaded images are encrypted in transit, stored securely, and never sold or shared with third parties. You may request deletion of your data at any time by contacting us. By using our platform, you consent to the collection and use of information as described here.',
  },
  terms: {
    title: 'Terms & Conditions',
    content: 'By accessing Quantum Within, you agree that all astrological readings, numerology calculations, AI palm and face analyses are provided for entertainment and personal reflection purposes only. They do not constitute professional, legal, medical, or financial advice. Quantum Within is not responsible for any decisions made based on our content. Payments are non-refundable except within our 7-day satisfaction guarantee window. Misuse of the platform is strictly prohibited.',
  },
  contact: {
    title: 'Contact Us',
    content: 'We\'d love to hear from you! For support, billing inquiries, or feedback, reach out to us at support@quantumwithin.app or through our social media channels. Our support team typically responds within 24 hours on business days. For urgent premium support, subscribers can use the VIP chat in their dashboard.',
  },
};

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f0f14',
            color: '#f0f0f8',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: 12,
            fontSize: '0.875rem',
          },
          success: { iconTheme: { primary: '#d4af37', secondary: '#07070a' } },
        }}
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/horoscope" element={<Horoscope />} />
        <Route path="/kundali" element={<Kundali />} />
        <Route path="/numerology" element={<Numerology />} />
        <Route path="/palm-reading" element={<PalmReading />} />
        <Route path="/face-reading" element={<FaceReading />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        <Route path="/privacy" element={<InfoPage {...PAGES.privacy} />} />
        <Route path="/terms" element={<InfoPage {...PAGES.terms} />} />
        <Route path="/contact" element={<InfoPage {...PAGES.contact} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
