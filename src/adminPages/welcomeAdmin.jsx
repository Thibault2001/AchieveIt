import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Add state to check if the user is an admin
  const navigate = useNavigate();

  // Effect to check if the user is an admin when the page loads
  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('admin='));

    if (cookieValue) {
      // If the "admin" cookie exists, consider the user as an administrator
      setIsAdmin(true);
    }
  }, []);

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

  // If the user is not an admin, redirect them to the login page
  if (!isAdmin) {
    navigate('/login');
    return null;
  }

  return (
    <div>
      <h1>Admin Page</h1>
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