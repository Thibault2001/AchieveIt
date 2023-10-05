import React, { useState, useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import Appointment from "./Appointment";
import GoalDisplay from "./GoalDisplay";
import Goal from './Goals';
import EventDisplay2 from "./eventDisplay2";
import CalendarDisplay from "./calendarDisplay";
import { auth } from './firebase'; // Import Firebase module for authentication
import { getDatabase, ref, onValue } from 'firebase/database'; // Import Firebase modules for the database
import { CSSTransition } from 'react-transition-group';

const WelcomeUser = () => {
  const [currentView, setCurrentView] = useState("calendar");
  const [userName, setUserName] = useState(""); // State to store the user's name

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  useEffect(() => {
    // Use the auth object to get the ID of the currently logged-in user
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;

      // Use the user's ID to access user data in the Firebase Realtime Database
      const db = getDatabase();
      const userRef = ref(db, `users/${userId}/name`);

      // Listen for changes to the user's name in the database
      onValue(userRef, (snapshot) => {
        const userNameFromDB = snapshot.val();
        setUserName(userNameFromDB);
      });
    }
  }, []);

  return (
    <CSSTransition in={true} appear={true} timeout={500} classNames="page">
      <Box p={4}>
        <Typography variant="h4" fontSize={50} gutterBottom>
          Welcome {userName}! Here is your day
        </Typography>
        <Appointment />
        <br />
        <Goal/>
        <Box display="flex" justifyContent="center" mb={3}>
          <Button
            variant={currentView === "calendar" ? "contained" : "outlined"}
            onClick={() => handleViewChange("calendar")}
            style={{ marginRight: "10px" }}
          >
            Calendar
          </Button>
          <Button
            variant={currentView === "events" ? "contained" : "outlined"}
            onClick={() => handleViewChange("events")}
            style={{ marginRight: "10px" }}
          >
            Display Events
          </Button>
          <Button
            variant={currentView === "goals" ? "contained" : "outlined"}
            onClick={() => handleViewChange("goals")}
          >
            Display Goals
          </Button>
        </Box>

        {currentView === "calendar" && <CalendarDisplay />}

        {currentView === "events" && <EventDisplay2 />}
        {currentView === "goals" && <GoalDisplay />}
      </Box>
    </CSSTransition>
  );
};

export default WelcomeUser;