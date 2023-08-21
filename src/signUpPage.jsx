
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';  
import { auth } from './firebase';


function SignUpPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Successfully signed up!', userCredential.user);
    } catch(error) {
      console.log('Error signing up:', error);
    }

  }

  return (
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
  );
}

export default SignUpPage;