import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Appointment from './Appointment';

const WelcomeUser = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userCookie = Cookies.get('user');

    if (!userCookie) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div>
      <h1>Welcome User!</h1>
      {/* ... (The rest of the welcome page content) */}
      <Appointment />
    </div>
  );
};

export default WelcomeUser;