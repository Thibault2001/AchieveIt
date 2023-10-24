import React, { useState, useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import Appointment from "./Appointment";
import GoalDisplay2 from "./GoalDisplay2";
import Goal from './Goals';
import EventDisplay2 from "./eventDisplay2";
import CalendarDisplay from "./dataBaseTest";
import { auth, db } from './firebase'; // Import Firebase module for authentication
import { getDatabase, ref, onValue } from 'firebase/database'; // Import Firebase modules for the database
import { CSSTransition } from 'react-transition-group';
import './CSS_files/userWelcome.css';
import './CSS_files/databaseTest.css';
import AddNewEvent from "./AddNewEvent";
import Reminders from "./Reminder.js";
import { ToastContainer } from 'react-toastify';

const WelcomeUser = () => {
  const [currentView, setCurrentView] = useState("calendar");
  const [userName, setUserName] = useState(""); // State to store the user's name
  const [firstLoad, setFirstLoad] = useState(true); // State to track if it's the first load

  const [isNewEventTypeModalOpen, setIsNewEventTypeModalOpen] = useState(false);
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

  /*const handleAddEventTypeClick = () => 
  {
    setIsNewEventTypeModalOpen(true)
  }*/

  const [eventTypes, setEventTypes] = useState([

    {id: 1, name: 'Appointment'},
    {id: 2, name: 'Sports'},
    {id: 3, name: 'Birthday'},
    {id: 4, name: 'University'},
  ]);

  //Function to add new event type to state.
  const addNewEventType = (newEventType) => 
  {
    setEventTypes(prevEventTypes => [...prevEventTypes, {id: prevEventTypes.length + 1, name: newEventType}])
  };

  //Checks reminders based on the current calendar view
  const handleCheckReminders = () =>
  {
    if(currentView === "calendar" || currentView === "events" || currentView === "goals")
    {
      const user = auth.currentUser;
    if (user) {
      const userID = user.uid;
      const eventRef = ref(db, `calendar/${userID}/events`);

      //Listens for changes in the events data.
      onValue(eventRef, (snapshot) => {
        const events = snapshot.val();
        if (events) {
          const currentTime = new Date();

          //Loops through all events checking for reminders
          Object.keys(events).forEach((eventID) => {
            const eventData = events[eventID];
            const { eventDate, eventTime, reminderTime, eventTitle } = eventData;

            const eventDateTime = new Date(`${eventDate} ${eventTime}`);
            const reminderDateTime = new Date(
              eventDateTime.getTime() - reminderTime * 60000
            );
          });
        }
      });
    }
  }
};
  //Effect to check reminders on component and schedule checks
  useEffect(() =>
  {
    handleCheckReminders();

    //Setting interval to check every 60 seconds
    const interval = setInterval(() =>
    {
      handleCheckReminders();
    }, 60000);

    //Clearing interval
    return () => clearInterval(interval);
  }, []);


  return (
    <CSSTransition in={true} appear={true} timeout={500} classNames="page">
      <Box className="main-container" p={4}>
        <ToastContainer/>
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
            {currentView === "goals" && <GoalDisplay2 />}
          </div>
          <Reminders onCheckReminders={handleCheckReminders}/>
        </div>
      </Box>
    </CSSTransition>
  );
};

export default WelcomeUser;