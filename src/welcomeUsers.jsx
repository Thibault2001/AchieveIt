import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const WelcomeUser = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const userCookie = Cookies.get('user');

    if (!userCookie) {
      navigate('/login');
    } else {
      // Parse the user data from the cookie
      const userData = JSON.parse(userCookie);
      setUserEmail(userData.email); // Set the user's email in the state
    }
  }, [navigate]);

  return (
    <div>
      <h1>Welcome User {userEmail}!</h1>
      {/* ... (The rest of the welcome page content) */}
    </div>
  );
};

export default WelcomeUser;