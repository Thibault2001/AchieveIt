import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const userCookie = Cookies.get('user');

    if (!userCookie) {
      navigate('/login');
    } else {
      const user = JSON.parse(userCookie);
      setAdminEmail(user.email); // Set the admin's email from the cookie
    }
  }, [navigate]);

  const handleExecuteScript = async () => {
    try {
      const response = await fetch('http://localhost:3001/execute-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error executing script:', error);
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Welcome, Admin {adminEmail} !</p>
      <p>Add admin role to user:</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleExecuteScript}>Execute Script</button>
    </div>
  );
};

export default AdminPage;