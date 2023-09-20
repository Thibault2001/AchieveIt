// Import necessary libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth'; // Modified import

import { auth } from './firebase'; // Import your Firebase configuration

// Define a component for the login page
const LoginPage = () => {
  // Define a function to get error messages based on error codes
  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'User not found';
      case 'auth/wrong-password':
        return 'Invalid password';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/email-already-in-use':
        return 'This email is already used';
      // Add more cases for other error codes
      default:
        return 'Error signing in';
    }
  };

  // State variables for form input and error handling
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firebaseError, setFirebaseError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Get navigation function from react-router-dom
  const navigate = useNavigate();

  // Effect to check if authentication is ready
  useEffect(() => {
    if (auth) { // Check if auth is ready
      setIsReady(true);
    }
  }, []);

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting || !isReady) {
      return; // Prevent multiple submissions or submissions while loading
    }

    try {
      setIsSubmitting(true);

    // Use signInWithEmailAndPassword function to attempt login
    signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
      // Login successful
      const user = userCredential.user;

      user.getIdTokenResult().then((idTokenResult) => {
        const { admin } = idTokenResult.claims; // Get user's claims

        // Convert user in a JSON chain
      const userJSON = JSON.stringify(user);
      // Définissez le nom du cookie en fonction du rôle de l'utilisateur
      const cookieName = admin ? 'admin' : 'user';
      document.cookie = `${cookieName}=${userJSON}; path=/`;
        if (admin) {
          navigate('/welcomeAdmin');
        } else{
        console.log(document.cookie);
        navigate('/welcome'); // Navigate to welcome page on success
        }
      });
    })
    .catch((error) => {
      // Handle login error
      setFirebaseError(error);
    });

    } finally {
      setIsSubmitting(false);
    }
  };

  // State variables and functions for password reset
  const [resetEmail, setResetEmail] = useState('');
  const [showReset, setShowReset] = useState(false);

  const resetPassword = () => {
    setShowReset(true);
    setFirebaseError(null); // Clear any previous error messages
  };

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
    } catch (error) {
      setFirebaseError(error); // Set the error object
    }
  };

  // Render the form
  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields for email and password */}
      <input 
        type="email"
        placeholder="Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)} 
      />

      {/* Button for form submission */}
      <button type="submit" disabled={!isReady || isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
      <br />

      {/* Button to trigger password reset */}
      <button onClick={resetPassword}>
        Reset Password
      </button>

      {/* Display password reset input and button if showReset is true */}
      {showReset && (
        <>
          <input
            type="email"
            placeholder="Email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}  
          />
          <br />
          <button onClick={handleReset}>
            Confirm Reset
          </button>
        </>
      )}

      {/* Display error message if firebaseError exists */}
      {firebaseError && (
        <p className="error-message">
          {getErrorMessage(firebaseError.code)}
        </p>
      )}
    </form>
  );
}

export default LoginPage; // Export the component