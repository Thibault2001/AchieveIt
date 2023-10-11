import React, { useState, useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import Appointment from "./Appointment";
import GoalDisplay2 from "./GoalDisplay2";
import Goal from './Goals';
import EventDisplay2 from "./eventDisplay2";
import CalendarDisplay from "./calendarDisplay";
import { auth } from './firebase'; // Import Firebase module for authentication
import { getDatabase, ref, onValue } from 'firebase/database'; // Import Firebase modules for the database
import { CSSTransition } from 'react-transition-group';
import './CSS_files/userWelcome.css';

const WelcomeUser = () => {
  const [currentView, setCurrentView] = useState("calendar");
  const [userName, setUserName] = useState(""); // State to store the user's name
  const [firstLoad, setFirstLoad] = useState(true); // State to track if it's the first load

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  useEffect(() => {
    if (firstLoad) {
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

          // Store the user name in localStorage on the first load
          localStorage.setItem('userName', userNameFromDB);
        });

        // Set firstLoad to false to prevent re-storing the name
        setFirstLoad(false);
      }
    }
  }, [firstLoad]);

  return (
    <CSSTransition in={true} appear={true} timeout={500} classNames="page">
      <Box className="main-container" p={4}>
        <Typography variant="h4" fontSize={50} gutterBottom>
          Welcome {userName ? userName : localStorage.getItem('userName')}! Here is your day
        </Typography>
        <div className="grid-container">
          <div className="title-column">
            <Box className="button-container" mb={3}>
              <Appointment />
              <br />
              <Goal />
            </Box>
          </div>
          <div className="content-column">
            <Box className="content-container" display="flex" justifyContent="center" mb={3}>
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
            {currentView === "goals" && <GoalDisplay2 />}
          </div>
        </div>
      </Box>
    </CSSTransition>
  );
};

export default WelcomeUser;