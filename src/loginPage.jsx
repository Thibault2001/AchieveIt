import React, { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom'; 
import { sendPasswordResetEmail } from 'firebase/auth';

import { auth } from './firebase';

const LoginPage = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [signInWithEmailAndPassword, user, error] = useSignInWithEmailAndPassword(auth);
  
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    await signInWithEmailAndPassword(username, password);
    
    if (user) {
      navigate('/welcome');
    }
  };

  const [resetEmail, setResetEmail] = useState('');
  const [showReset, setShowReset] = useState(false);

  const resetPassword = () => {
    setShowReset(true);
  };

  const handleReset = () => {
    sendPasswordResetEmail(auth, resetEmail);
  };

  return (
    <form onSubmit={handleSubmit}>
      
      {error && <p>Error: {error.message}</p>} 

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

      <button type="submit">Login</button>
      <button onClick={resetPassword}>
        Réinitialiser le mot de passe
      </button>

      {showReset && (  
        <>
          <input
            type="email"
            placeholder="Email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}  
          />
          <button onClick={handleReset}>
            Confirmer réinitialisation
          </button>
        </>
      )}

    </form>
  );
}

export default LoginPage;