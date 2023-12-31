import React, { useState, useEffect } from 'react';
import { db, ref, onValue, set } from '../firebase';
import '../CSS_files/userDisplay.css';

function UsersPage() {
  // State variables for user data, loading status, selected users, and deletion errors
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deletionErrors, setDeletionErrors] = useState([]);

  useEffect(() => {
    // Reference to the 'users' node in Realtime Database
    const databaseRef = ref(db, 'users'); // Mettez à jour le chemin vers le nouveau chemin de base de données.

    // Fetch user data from Realtime Database and update state
    onValue(databaseRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersArray = Object.keys(data).map((userId) => ({
          uid: userId,
          email: data[userId].email,
        }));
        setUsers(usersArray);
      }
      setLoading(false);
    });
  }, []);

  const handleUserSelection = (userId) => {
    // Toggle the selected user based on their UID
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleDeleteSelectedUsers = async () => {
    const deletionErrors = [];

    // Loop through selected users and delete their entire accounts
    for (const userId of selectedUsers) {
      // Step 1: Remove user's data from the Realtime Database
      const userRef = ref(db, 'users/' + userId);
      try {
        await set(userRef, null);
        console.log(`User data for ${userId} deleted from Realtime Database`);
      } catch (error) {
        console.error(`Error deleting user data for ${userId} from Realtime Database:`, error);
        deletionErrors.push(`Error deleting user data for ${userId} from Realtime Database: ${error.message}`);
      }

      // Step 2: Send a POST request to the server to delete the user from Firebase Authentication
      try {
        const response = await fetch('http://localhost:3001/delete-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid: userId }),
        });

        if (response.ok) {
          console.log(`User ${userId} deleted successfully from the Accounting.`);
        } else {
          const errorMessage = await response.text();
          console.error(`Error deleting user ${userId}: ${errorMessage}`);
          deletionErrors.push(`Error deleting user ${userId}: ${errorMessage}`);
        }
      } catch (error) {
        console.error(`Error deleting user ${userId}:`, error);
        deletionErrors.push(`Error deleting user ${userId}: ${error.message}`);
      }
    }

    // Clear the selection and update deletion errors
    setSelectedUsers([]);
    setDeletionErrors(deletionErrors);
  };

  return (
    <div className="users-page"> {/* Appliquez la classe CSS pour centrer le contenu */}
      <h1>Users</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="users-table"> {/* Appliquez la classe CSS pour le tableau */}
          <thead>
            <tr>
              <th>Select</th>
              <th>UID</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.uid}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => handleUserSelection(user.uid)}
                    checked={selectedUsers.includes(user.uid)}
                  />
                </td>
                <td>{user.uid}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {deletionErrors.length > 0 && (
        <div>
          <h2>Deletion Errors:</h2>
          <ul>
            {deletionErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleDeleteSelectedUsers} className="delete-button">Delete Selected Users</button> {/* Appliquez la classe CSS pour le bouton */}
    </div>
  );
}

export default UsersPage;