import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for creating a button link
import '../CSS_files/welcomeAdmin.css'; // Importez le fichier CSS pour les styles

const AdminPage = () => {
  // State variables
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [, setAccessDenied] = useState(false); // State to track access denied

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

  // Function to close the access denied message
  const handleCloseAccessDenied = () => {
    setAccessDenied(false);
  };

  // Check if the user is not an admin and set the accessDenied state
  useEffect(() => {
    if (!isAdmin) {
      setAccessDenied(true);
    }
  }, [isAdmin]);

  return (
    <div>
      {isAdmin ? (
        // If the user is an admin, display the admin page content
        <>
          <h1>Admin Page</h1>
          <p>Convert a user to an administrator :</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleExecuteScript}>Convert the user</button>
          <div className="user-list-button">
        <Link to="/userDisplay">
          <button>User List</button>
        </Link>
      </div>
        </>
      ) : (
        // If the user is not an admin, display the "Access Denied" message
        <div className="access-denied">
          <input
            type="text"
            value="Accès refusé. Vous n'êtes pas autorisé à afficher cette page."
            readOnly
          />
          <button onClick={handleCloseAccessDenied}>Fermer</button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;