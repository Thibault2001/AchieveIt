import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { setPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Set browser session persistence for Firebase authentication
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log('Authentication persistence successfully set');
  })
  .catch((error) => {
    console.error("Error setting authentication persistence", error);
  });

const LoginPage = () => {
  // Function to get an error message based on the authentication error code
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
      default:
        return 'Error';
    }
  };

  // State variables
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [, setFirebaseError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [resetEmail, setResetEmail] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [showMainForm, setShowMainForm] = useState(true);

  const navigate = useNavigate();

  // Use effect to check if Firebase auth is ready
  useEffect(() => {
    if (auth) {
      setIsReady(true);
    }
  }, []);

  // Handle the submission of the login form
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting || !isReady) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (!showReset) {
        // Submit the main form
        signInWithEmailAndPassword(auth, formData.username, formData.password)
          .then((userCredential) => {
            const user = userCredential.user;

            user.getIdTokenResult().then((idTokenResult) => {
              const { admin } = idTokenResult.claims;

              const userJSON = JSON.stringify(user);
              const cookieName = admin ? 'admin' : 'user';
              document.cookie = `${cookieName}=${userJSON}; path=/`;

              if (admin) {
                navigate('/welcomeAdmin');
              } else {
                console.log(document.cookie);
                navigate('/welcome');
              }

              toast.success('Login Successful');
            });
          })
          .catch((error) => {
            setFirebaseError(error);
            toast.error(getErrorMessage(error.code));
          });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input changes in the form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to switch to the password reset view
  const resetPassword = () => {
    setShowReset(true);
    setShowMainForm(false);
    setFirebaseError(null);
  };

  // Handle the submission of the password reset form
  const handleReset = async (event) => {
    event.preventDefault();

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success('Password reset email sent successfully');
    } catch (error) {
      setFirebaseError(error);
      toast.error('Password reset failed');
    }
  };

  // Function to go back to the main form view
  const goBackToMainForm = () => {
    setShowReset(false);
    setShowMainForm(true);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {showMainForm && (
          <>
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
          </>
        )}
      </form>

      {showReset && (
        <form onSubmit={handleReset}>
          <input
            type="email"
            placeholder="Email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
          <br />
          <button type="submit">
            Confirm Reset
          </button>
          <br />
          <button className = "link-button" onClick={goBackToMainForm}>
            Go Back
          </button>
        </form>
      )}

      <ToastContainer autoClose={5000} />
    </div>
  );
};

export default LoginPage;