import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Team } from './pages/Team';
import { Contact } from './pages/Contact';
import { Opportunities } from './pages/Opportunities';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { Notifications } from './pages/Notifications';

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar onAuthClick={() => setAuthModalOpen(true)} />
          <Routes>
            <Route path="/" element={<Home onAuthClick={() => setAuthModalOpen(true)} />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/opportunities" element={<Opportunities onAuthClick={() => setAuthModalOpen(true)} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
          <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
