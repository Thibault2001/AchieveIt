import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
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
    setShowMainForm(false);
    setFirebaseError(null);
  };

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success('Password reset email sent successfully');
    } catch (error) {
      setFirebaseError(error);
      toast.error('Password reset failed');
    }
  };

  return (
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

      <ToastContainer autoClose={5000}/>
    </form>
  );
};

export default LoginPage;