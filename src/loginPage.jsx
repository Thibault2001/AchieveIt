import React, { useState } from 'react';

// Import Firebase hooks 
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';  

// Import Firebase auth instance
import { app, auth } from './firebase';

const LoginPage = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Use Firebase hook
  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);  

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    
    // Call Firebase method on click
    signInWithEmailAndPassword(username, password);
  };

  return (
    <div>
      <h2>Login Page</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label> 
          <input 
            type="text"
            value={username}
            onChange={handleUsernameChange}  
          />
        </div>

        <div>
          <label>Password:</label>
          <input 
            type="password"
            value={password} 
            onChange={handlePasswordChange} 
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;