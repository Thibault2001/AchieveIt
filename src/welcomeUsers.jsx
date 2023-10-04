import React, { useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import Appointment from "./Appointment";
import GoalDisplay from "./GoalDisplay";
import Goal from './Goals';
import EventDisplay2 from "./eventDisplay2";
import CalendarDisplay from "./calendarDisplay";

const WelcomeUser = () => {
  const [currentView, setCurrentView] = useState("calendar");

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" fontSize={50} gutterBottom>
        Welcome, here is your day
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
  );
};

export default WelcomeUser;