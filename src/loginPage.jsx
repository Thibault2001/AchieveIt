// Import necessary libraries
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

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
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [firebaseError, setFirebaseError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // State variables and functions for password reset
  const [resetEmail, setResetEmail] = useState('');
  const [showReset, setShowReset] = useState(false);

  // Get navigation function from react-router-dom
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      setIsReady(true);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting || !isReady) {
      return;
    }

    try {
      setIsSubmitting(true);

      signInWithEmailAndPassword(auth, formData.username, formData.password)
        .then((userCredential) => {
          const user = userCredential.user;

          user.getIdTokenResult().then((idTokenResult) => {
            const { admin } = idTokenResult.claims;

            // Convert user in a JSON chain
            const userJSON = JSON.stringify(user);
            // Définissez le nom du cookie en fonction du rôle de l'utilisateur
            const cookieName = admin ? 'admin' : 'user';
            document.cookie = `${cookieName}=${userJSON}; path=/`;

            if (admin) {
              navigate('/welcomeAdmin');
            } else {
              console.log(document.cookie);
              navigate('/welcome');
            }
          });
        })
        .catch((error) => {
          setFirebaseError(error);
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="username"
        placeholder="Email"
        value={formData.username}
        onChange={handleInputChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
        required
      />

      <button type="submit" disabled={!isReady || isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
      <br />

      <button onClick={resetPassword}>
        Reset Password
      </button>

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

      {firebaseError && (
        <p className="error-message">
          {getErrorMessage(firebaseError.code)}
        </p>
      )}
    </form>
  );
};

export default LoginPage;