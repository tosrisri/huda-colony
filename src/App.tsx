import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import News from './pages/News';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';
import { supabase } from './lib/supabase';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null); // Define user state

  useEffect(() => {
    // Check if the user is already logged in
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      setIsLoggedIn(!!session);
      if (session) {
        setUser(session.user); // Set user data
      }
    };

    getSession();

    // Subscribe to auth state changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        setUser(session.user); // Set user data on auth state change
      } else {
        setUser(null); // Clear user data on logout
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null); // Clear user data on logout
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          {isLoggedIn ? (
            <>
              <Navbar />
              <main className="flex-grow">
                <div className=''>
                  <nav className="login-info">
                    <span>Hi, {user?.email} </span> {/* Use optional chaining */}
                    <Link to="/" onClick={handleLogout}>Logout</Link>
                  </nav>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/news" element={<News />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin" element={<Admin />} />
                  </Routes>
                </div>
              </main>
              <Footer />
            </>
          ) : (
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          )}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;