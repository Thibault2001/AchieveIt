import React, { useEffect, useState } from "react";
import { Box, Typography, Card } from "@mui/material";
import { auth, db, ref, onValue, set } from "./firebase";
import { GetColour } from "./Event";
import { Link } from "react-router-dom";

/*
  This component displays a list of goals from a user's database.
  Users can select and delete goals.

  It fetches goal data from Firebase Realtime Database and provides
  functionality to select and delete goals.
*/
const GoalDisplay2 = () => {
  const [goals, setGoals] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userID = user.uid;
      setUserID(userID);

      const goalsRef = ref(db, `calendar/${userID}/goals`);

      onValue(goalsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const goalsArray = Object.values(data);
          setGoals(goalsArray);
        } else {
          setGoals([]);
        }
      });
    }
  }, []);

  const handleGoalSelect = (goal) => {
    if (selectedGoals.includes(goal.title)) {
      setSelectedGoals(selectedGoals.filter((title) => title !== goal.title));
    } else {
      setSelectedGoals([...selectedGoals, goal.title]);
    }
  };

  const handleDeleteSelectedGoals = () => {
    selectedGoals.forEach((title) => {
      const user = auth.currentUser;
      const userID = user.uid;
      setUserID(userID);
      const goalRef = ref(db, `calendar/${userID}/goals/${title}`);
      set(goalRef, null);
    });

    setSelectedGoals([]);
  };

  return (
    <Box>
      <Typography variant="h4">Goals</Typography>
      <button onClick={handleDeleteSelectedGoals}>Delete Selected Goals</button>
      <div>
        {goals.length > 0 ? (
          <div className="event-display-container">
            {goals.map((goal) => (
              <Card
                className={`event-display-card ${selectedGoals.includes(goal.title) ? 'selected' : ''}`}
                style={{ backgroundColor: GetColour(goal.goalType) }}
                key={goal.title}
                onClick={() => handleGoalSelect(goal)}
              >
                <h2>
                  <u>{goal.title}</u>
                </h2>
                <br />
                <h3>
                  Date: <u>{goal.date}</u>
                </h3>
                <br />
                <p>
                  <b>Details:</b>
                  <br />
                  {goal.description}
                </p>
                {/* Add a Link to subgoals page with the specified path */}
                <Link to={`/calendar/${userID}/goals/${goal.title}/subgoals`}>
                  View Subgoals
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <p>No goals to display.</p>
        )}
      </div>
    </Box>
  );
};

export default GoalDisplay2;