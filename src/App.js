import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import LoginPage from './loginPage';
import SignUpPage from './signUpPage';
import WelcomeUser from './welcomeUsers';
import WelcomeAdmin from './adminPages/welcomeAdmin'

//changing comment 
function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/login">Log In</Link>
            </li>
            <li>
              <Link to="/signUp">Sign Up</Link>
            </li>
            <li>
              
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/welcome" element={<WelcomeUser />} />
          <Route path="welcomeAdmin" element={<WelcomeAdmin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
