// Subgoals.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from "@mui/material";
import { db, ref, onValue } from "./firebase";
import { auth } from "./firebase";

const Subgoals = () => {
  const { userID, goalTitle } = useParams();
  const [subgoals, setSubgoals] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userID = user.uid;
        const subgoalsRef = ref(db, `calendar/${userID}/goals/${goalTitle}/subgoals`);

        onValue(subgoalsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const subgoalsArray = Object.values(data);
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
      {subgoals.map((subgoal) => (
        <Card key={subgoal.id} className="subgoal-card">
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
      ))}
    </div>
  );
};

export default Subgoals;
