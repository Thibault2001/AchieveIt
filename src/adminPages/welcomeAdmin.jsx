import React, { useState, useEffect } from 'react';

// Admin Page Component
// This component represents the admin page. It allows an administrator to execute a script
// by providing an email address. The user is considered an administrator if they have a
// "admin" cookie. If the user is not an admin, they will see an "Access Denied" message.

const AdminPage = () => {
  // State variables
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [ setAccessDenied] = useState(false); // State to track access denied

  // Check if the user has an "admin" cookie when the page loads
  useEffect(() => {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('admin='));

    if (cookieValue) {
      // If the "admin" cookie exists, consider the user as an administrator
      setIsAdmin(true);
    }
  }, []);

  // Function to handle script execution
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

  // Check if the user is not an admin and set the accessDenied state
  useEffect(() => {
    if (!isAdmin) {
      setAccessDenied(true);
    }
  }, [isAdmin]);

  // Function to close the access denied message
  const handleCloseAccessDenied = () => {
    setAccessDenied(false);
  };

  return (
    <div>
      {isAdmin ? (
        // If the user is an admin, display the admin page content
        <>
          <h1>Admin Page</h1>
          <p>Add admin role to user:</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleExecuteScript}>Execute Script</button>
        </>
      ) : (
        // If the user is not an admin, display the "Access Denied" message
        <div style={styles.accessDenied}>
          <input
            type="text"
            value="Access Denied. You are not authorized to view this page."
            readOnly
            style={styles.accessDeniedInput}
          />
        </div>
      )}
    </div>
  );
};

// Styles for the "Access Denied" message and close button
const styles = {
  accessDenied: {
    backgroundColor: '#f2f2f2',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  accessDeniedInput: {
    flex: '1',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'red',
    fontSize: '16px',
  },
  closeButton: {
    backgroundColor: '#ccc',
    border: 'none',
    borderRadius: '5px',
    marginLeft: '10px',
    cursor: 'pointer',
  },
};

export default AdminPage;