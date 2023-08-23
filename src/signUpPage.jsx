
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';  
import { auth } from './firebase';


function SignUpPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log(error);
      
    } catch (err) {
      console.log(err);
      // error management 
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already used'); 
      }
      if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters'); 
      } 
      else {
        setError('Error signing up');
      }
    }

  };

  return (
    <div>
      {error && <p>{error}</p>}
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

export default SignUpPage;