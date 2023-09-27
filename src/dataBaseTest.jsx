import React, { useEffect, useState } from 'react';
import { db, ref, onValue } from './firebase';

function MyComponent() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reference to the Firebase Realtime Database
    const databaseRef = ref(db, '/eventCalendar');

    // Using onValue to get real-time updates of the data
    onValue(databaseRef, (snapshot) => {
      const data = snapshot.val();
      setData(data);
      setLoading(false); // Mark loading as complete once the data is received
    });
  }, []);

  return (
    <div>
      <h1>Real-Time Database Data</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}

export default MyComponent;