import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from "@mui/material"; // Import the Card component
import { db, ref, onValue } from "./firebase"; // Import necessary Firebase functions
import './CSS_files/Subgoals.css';

const Subgoals = () => {
  const { userID, goalTitle } = useParams();
  const [subgoals, setSubgoals] = useState([]);

  // Use useEffect to fetch subgoals when the component mounts
  useEffect(() => {
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
  }, [userID, goalTitle]);

  return (
    <div>
      <h1>Subgoals for {goalTitle}</h1>
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
