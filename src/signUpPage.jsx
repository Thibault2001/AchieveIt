// This component defines a sign-up page that allows users to create new accounts.
// It provides a form for entering email and password, handles form submission,
// and displays error messages if the sign-up process fails.

// Import necessary libraries and functions
import './CSS_files/App.css';
import { useState } from 'react';
import { createUserWithEmailAndPassword,signOut } from 'firebase/auth';
import { auth } from './firebase';
import { getDatabase, ref, set } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

// Define the SignUpPage component
function SignUpPage() {
  // State variables for form input, password, name, and error handling
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  // Get the navigate function
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Attempt to create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Get user ID and email
      const userId = userCredential.user.uid;

      // Sign out the user immediately after registration
      await signOut(auth);

      // Store the user's name in the real-time Database along with other information
      const db = getDatabase();
      const usersRef = ref(db, 'users/' + userId);
      set(usersRef, {
        email: email,
        name: name,
      });

      // Display a success notification
      toast.success('Registration successful!');

      // Redirect the user to the /login page after successful registration and 5s
      setTimeout(() => {
        navigate('/login');
      }, 5000);
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
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

      {/* ToastContainer to display notifications */}
      <ToastContainer autoClose={5000} />
    </div>
  );
}

// Export the SignUpPage component
export default SignUpPage;