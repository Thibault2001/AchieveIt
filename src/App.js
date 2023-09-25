import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import './CSS_files/App.css';
import LoginPage from './loginPage';
import SignUpPage from './signUpPage';
import WelcomeUser from './welcomeUsers';
import WelcomeAdmin from './adminPages/welcomeAdmin';
import Test from './dataBaseTest';
import UserDisplayPage from './adminPages/userDisplay';

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
      </div>
    </Router>
  );
}

function Navigation() {
  const location = useLocation();

  // Si le chemin actuel est '/welcome', ne pas rendre la navigation
  if (location.pathname === '/welcome') {
    return null;
  }

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <Link to="/login">Log in</Link>
        </li>
        <li className="nav-item">
          <Link to="/signUp">Sign Up</Link>
        </li>
      </ul>
    </nav>
  );
}

export default App;