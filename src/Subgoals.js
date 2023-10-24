import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from "@mui/material";
import { db, ref, onValue } from "./firebase";
import { auth } from "./firebase";

/**
 * The `Subgoals` component displays a list of subgoals for a specific main goal.
 * Subgoals are fetched from the Firebase Realtime Database and sorted by date,
 * with the soonest due appearing first in the list.
 * Users can navigate back to the welcome page and view details of each subgoal.
 */
const Subgoals = () => {
  const { userID, goalTitle } = useParams();
  const [subgoals, setSubgoals] = useState([]);

  useEffect(() => {
    //set up a listener for changes in the user's aunthentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userID = user.uid;

        //create a reference to the subgoals in the user's database
        const subgoalsRef = ref(db, `calendar/${userID}/goals/${goalTitle}/subgoals`);

        //listen for changes in subgoals data
        onValue(subgoalsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const subgoalsArray = Object.values(data);

            // Sort subgoals by date (ascending order)
            subgoalsArray.sort((a, b) => new Date(a.date) - new Date(b.date));

            setSubgoals(subgoalsArray);
          } else {
            setSubgoals([]); // Handle no subgoals case
          }
        });
      }
    }, [goalTitle]);

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1>Subgoals for {goalTitle}</h1>
      <Link to="/welcome">Back to Welcome</Link> {/* Add the link to return to /welcome */}
      {subgoals.map((subgoal, index) => (
        <div key={subgoal.id}>
          {index !== 0 && <hr /> /* Add a horizontal line (divider) except for the first subgoal */}
          <Card className="subgoal-card">
            <h2>
              <u>{subgoal.title}</u>
            </h2>
            <br />
            <h3>
              Date: <u>{subgoal.date}</u>
            </h3>
            <br />
            <p>
              <b>Details:</b>
              <br />
              {subgoal.description}
            </p>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Subgoals;
