import React, { useState } from 'react';

const AdminPage = () => {
  const [email, setEmail] = useState('');

  const handleExecuteScript = async () => {
    try {
      const response = await fetch('http://localhost:3001/execute-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error executing script:', error);
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <p>Add admin role to user:</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleExecuteScript}>Execute Script</button>
    </div>
  );
};

export default AdminPage;