// This component defines a sign-up page that allows users to create new accounts.
// It provides a form for entering email and password, handles form submission,
// and displays error messages if the sign-up process fails.

// Import necessary libraries and functions
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { getDatabase, ref, set } from 'firebase/database';

// Define the SignUpPage component
function SignUpPage() {
  // State variables for form input, password, and error handling
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Attempt to create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Get user ID and email
      const userId = userCredential.user.uid;

      // Store ID in the real time Database
      const db = getDatabase();
      const usersRef = ref(db, 'users/' + userId);
      set(usersRef, email);
    } catch (err) {
      // Handle specific error codes and display appropriate error messages
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already used');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError('Error signing up');
      }
    }
  };

  // Render the SignUpPage component
  return (
    <div>
      {/* Display error message if an error exists */}
      {error && <p>{error}</p>}
      {/* Form for signing up */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

// Export the SignUpPage component
export default SignUpPage;