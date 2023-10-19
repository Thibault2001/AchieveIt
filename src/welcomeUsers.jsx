import React, { useState, useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import Appointment from "./Appointment";
import Goal from './Goals';
import GoalDisplay from "./GoalDisplay";
import EventDisplay2 from "./eventDisplay2";
import CalendarDisplay from "./dataBaseTest";
import { auth } from './firebase'; // Import Firebase module for authentication
import { getDatabase, ref, onValue } from 'firebase/database'; // Import Firebase modules for the database
import { CSSTransition } from 'react-transition-group';
import './CSS_files/userWelcome.css';
import './CSS_files/databaseTest.css';
import AddNewEvent from "./AddNewEvent";

const WelcomeUser = () => {
  const [currentView, setCurrentView] = useState("calendar");
  const [userName, setUserName] = useState(""); // State to store the user's name
  const [firstLoad, setFirstLoad] = useState(true); // State to track if it's the first load

  const [isNewEventTypeModalOpen, setIsNewEventTypeModalOpen] = useState(false);
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  useEffect(() => {
    // Use the auth object to get the ID of the currently logged-in user
    const userId = auth.currentUser.uid;

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
  }, [firstLoad]);

  /*const handleAddEventTypeClick = () => 
  {
    setIsNewEventTypeModalOpen(true)
  }*/

  const [eventTypes, setEventTypes] = useState([

    { id: 1, name: 'Appointment' },
    { id: 2, name: 'Sports' },
    { id: 3, name: 'Birthday' },
    { id: 4, name: 'University' },
  ]);

  const addNewEventType = (newEventType) => {
    setEventTypes(prevEventTypes => [...prevEventTypes, { id: prevEventTypes.length + 1, name: newEventType }])
  };

  return (
    <CSSTransition in={true} appear={true} timeout={500} classNames="page">
      <Box className="main-container" p={4}>
        <Typography variant="h4" fontSize={50} gutterBottom>
          Welcome {userName ? userName : localStorage.getItem('userName')}! Here is your day
          <div className="addEventButton">
            <button onClick={() => setIsNewEventTypeModalOpen(true)}> Custom Event Type Settings </button>

            <AddNewEvent
              isNewEventTypeModalOpen={isNewEventTypeModalOpen}
              setIsNewEventTypeModalOpen={setIsNewEventTypeModalOpen}
              addNewEventType={addNewEventType}
            />
          </div>
        </Typography>

        <div className="grid-container">
          <div className="title-column">
            <Box className="button-container" mb={3}>

              <AddNewEvent
                isNewEventTypeModalOpen={isNewEventTypeModalOpen}
                setIsNewEventTypeModalOpen={setIsNewEventTypeModalOpen}
                addNewEventType={addNewEventType}
              />
              <Appointment
                isNewEventTypeModalOpen={isNewEventTypeModalOpen}
                setIsNewEventTypeModalOpen={setIsNewEventTypeModalOpen}
                eventTypes={eventTypes}
              />
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
            {currentView === "goals" && <GoalDisplay />}
          </div>
        </div>
      </Box>
    </CSSTransition>
  );
};

export default WelcomeUser;