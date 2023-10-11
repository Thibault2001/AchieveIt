import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import './CSS_files/App.css';
import './CSS_files/login.css';
import LoginPage from './loginPage';
import SignUpPage from './signUpPage';
import WelcomeUser from './welcomeUsers';
import WelcomeAdmin from './adminPages/welcomeAdmin';
import Test from './dataBaseTest';
import UserDisplayPage from './adminPages/userDisplay';
import { auth } from './firebase';
import Cookies from 'js-cookie';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/welcome" element={<WelcomeUser />} />
          <Route path="/welcomeAdmin" element={<WelcomeAdmin />} />
          <Route path="/test" element={<Test />} />
          <Route path="/userDisplay" element={<UserDisplayPage />} />
        </Routes>
        <div className="logo-text">AchieveIt</div>
      </div>
    </Router>
  );
}

function Navigation() {
  const Navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // When the user's authentication state changes, user will contain the logged-in user or null
      setIsLoggedIn(!!user); // Set isLoggedIn based on the authentication state
    });

    // Make sure to unsubscribe when the component is unmounted
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => {
      // Delete all the cookies
      Object.keys(Cookies.get()).forEach((cookieName) => {
        Cookies.remove(cookieName);
      });

      // Log out the user and navigate them to the home page
      Navigate('/');
    });
  };

  // Conditionally navigate based on isLoggedIn
  useEffect(() => {
    if (isLoggedIn) {
      Navigate('/welcome');
    }
  }, [isLoggedIn, Navigate]);

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {isLoggedIn ? (
          // If connected, display "Log Out" as a link
          <li className="nav-item">
            <Link to="/" onClick={handleLogout}>Log Out</Link>
          </li>
        ) : (
          // If not connected, display "Log in" and "Sign Up" as links
          <>
            <li className="nav-item">
              <Link to="/login">Log in</Link>
            </li>
            <li className="nav-item">
              <Link to="/signUp">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
    
  );
}

export default App;