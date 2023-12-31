import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import './CSS_files/App.css';
import './CSS_files/login.css';
import './CSS_files/userWelcome.css'; 
import LoginPage from './loginPage';
import SignUpPage from './signUpPage';
import WelcomeUser from './welcomeUsers';
import WelcomeAdmin from './adminPages/welcomeAdmin';
import Test from './dataBaseTest';
import UserDisplayPage from './adminPages/userDisplay';
import { auth } from './firebase';
import Cookies from 'js-cookie';
import useAutoLogout from './useAutoLogout';
import Subgoals from './Subgoals';

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
          <Route path="/calendar/:userId/goals/:goalTitle/subgoals" element={<Subgoals />} />
        </Routes>
        <div className="logo-text">AchieveIt</div>
      </div>
    </Router>
  );
}

function Navigation() {
  const Navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const inactivityTime = 60 * 60 * 1000; // 1 hour in milliseconds.
  // NOTE FOR TESTER: Change time to 10 * 1000; to test on a 10 sec timer.

  useAutoLogout(inactivityTime, isLoggedIn); // Calls AutoLogout to start checking user activity.

  useEffect(() => {
    const initialRedirectDone = localStorage.getItem('initialRedirect');

    // Check if the user has an "admin" cookie when the page loads
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('admin='));

    if (cookieValue) {
      // If the "admin" cookie exists, consider the user as an administrator
      setIsAdmin(true);
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      // When the user's authentication state changes, user will contain the logged-in user or null
      const userIsLoggedIn = !!user; // Determine if the user is logged in

      // Set isLoggedIn based on the authentication state
      setIsLoggedIn(userIsLoggedIn);
      // >>

      if (userIsLoggedIn && !initialRedirectDone) {
        if (isAdmin) {
          // If the user is an admin, navigate to the admin welcome page
          Navigate('/welcomeAdmin');
        } else {
          // If the user is not an admin, navigate to the regular welcome page
          Navigate('/welcome');
        }

        // Mark that the initial redirection has occurred
        localStorage.setItem('initialRedirect', 'done');
      }
    });

    // Make sure to unsubscribe when the component is unmounted
    return () => unsubscribe();
  }, [Navigate, isAdmin]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      // Delete all the cookies
      Object.keys(Cookies.get()).forEach((cookieName) => {
        Cookies.remove(cookieName);
      });

      // Log out the user and navigate them to the home page
      Navigate('/login');
    });
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {isLoggedIn ? (
          // If connected, display "Log Out" as a link
          <li className="nav-item">
            <Link to="/login" onClick={handleLogout}>Log Out</Link>
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