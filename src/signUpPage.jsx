import './CSS_files/App.css';
import { useState } from 'react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { getDatabase, ref, set } from 'firebase/database';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [passwordConditions, setPasswordConditions] = useState({
    uppercase: false,
    number: false,
    specialChar: false,
    length: false,
  });

  const navigate = useNavigate();

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);

    const conditions = {
      uppercase: /[A-Z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      specialChar: /[!@#$%^&*()_+{}[\]:;<>,°.?~\\-]/.test(newPassword),
      length: newPassword.length >= 8,
    };

    setPasswordConditions(conditions);
  };

  const isPasswordValid = () => {
    return Object.values(passwordConditions).every((condition) => condition);
  };

  const getPasswordConditionClass = (condition) => {
    return passwordConditions[condition] ? 'valid' : 'invalid';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isPasswordValid()) {
      toast.error('Password does not meet the required conditions');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      await signOut(auth);

      const db = getDatabase();
      const usersRef = ref(db, 'users/' + userId);
      set(usersRef, {
        email: email,
        name: name,
      });

      toast.success('Registration successful!');

      // Redirect the user to the /login page after successful registration and 5s
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      // Handle specific error codes and display appropriate error messages
      if (err.code === 'auth/email-already-in-use') {
        toast.error('This email is already used');
      } 
      else if (err.code === 'auth/invalid-email') {
        toast.error('This email is invalid');
      }
        else {
        toast.error('Error signing up');
      }
    }
  };

  return (
    <div>
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
          onChange={handlePasswordChange}
        />

        <div className="password-conditions">
          <div className={`password-condition uppercase ${getPasswordConditionClass('uppercase')}`}>
            Uppercase
          </div>
          <div className={`password-condition number ${getPasswordConditionClass('number')}`}>
            Number
          </div>
          <div className={`password-condition specialChar ${getPasswordConditionClass('specialChar')}`}>
            Special Char
          </div>
          <div className={`password-condition length ${getPasswordConditionClass('length')}`}>
            Length (8+)
          </div>
        </div>

        <button type="submit">Sign Up</button>
      </form>

      {/* ToastContainer to display notifications */}
      <ToastContainer autoClose={5000} />
    </div>
  );
}

// Export the SignUpPage component
export default SignUpPage;