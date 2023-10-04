/* 

Preston: My code in this file contains the main screen the user sees once they log in. It displays a calendar interface showing
the dates of the current month, with a few dates from the previous and next month. Users are able to select
the month and year they want to view. The current date is highlighted and displayed to the user. 
*/

// Importing required components.
import React, { useState } from "react";
import { Button, Typography, Box, Grid, Select, MenuItem } from "@mui/material";
import Appointment from "./Appointment";
import Goal from './Goals';

/* 
    In this section, we are setting up state and utility variables to manage and interact with dates:
    - `currentDate`: stores the current date, allowing us to perform various operations related to the date throughout the component.
    - `daysInMonth`: calculates the number of days in the current month.
    - `daysInPrevMonth`: finds out the number of days in the previous month.
    - `daysOfWeek`: an array holding the names of all the days of the week to aid in calendar-related operations.
    - `firstDayOfMonth` and `adjustedFirstDay`: work together to determine the day of the week that the current month starts on, which is essential for setting up a calendar view.
    */
const WelcomeUser = () => {
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const [currentDate, setCurrentDate] = useState(new Date());
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const daysInPrevMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0
  ).getDate();
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  /*
    This function manages changes in the month displayed in the calendar:
    - Receives a change parameter, which can be +1 or -1, indicating a month forward or a month backward, respectively.
    - `newMonth`: calculates the new month number based on the current month and the change parameter.
    - The following conditional structure handles the transition between years:
        - If `newMonth` equals -1, we are in January and moving back to December of the previous year.
        - If `newMonth` equals 12, we are in December and moving forward to January of the next year.
        - In any other case, we simply set the month to `newMonth`.
    - `setCurrentDate`: we update the `currentDate` state with the new calculated date.
    */
  const handleMonthChange = (change) => {
    const newMonth = currentDate.getMonth() + change;
    if (newMonth === -1) {
      // It's January and we're going to previous month
      setCurrentDate((prevDate) => new Date(prevDate.getFullYear() - 1, 11, 1));
    } else if (newMonth === 12) {
      // It's December and we're going to next month
      setCurrentDate((prevDate) => new Date(prevDate.getFullYear() + 1, 0, 1));
    } else {
      setCurrentDate((prevDate) => new Date(prevDate.setMonth(newMonth)));
    }
  };

  // Determine the current year using the getFullYear method on a new Date object
  const currentYear = new Date().getFullYear();

  // Set the start year for a range of years, in this case, 10 years before the current year
  const startYear = currentYear - 10;

  // Create an array of 21 years starting from 10 years before the current year
  // (i.e., it creates a range of years with the current year in the middle)

  const years = Array.from({ length: 21 }, (_, index) => startYear + index);

  // Create an array of month names using toLocaleString to get the full month name
  // Here we iteratively create new Date objects for each month of the year 2000 (a leap year to ensure February has 29 days) and extract the full month name

  const months = Array.from({ length: 12 }, (_, index) =>
    new Date(2000, index).toLocaleString("default", { month: "long" })
  );

  return (
    <Box p={4}>
      {/* Small welcome message to the user */}

      <Typography variant="h4" fontSize={50} gutterBottom>
        Welcome, here is your day

      </Typography>
      <div className="addEventButton">
        <Button> Add New Event Type </Button>
      </div>

      <Appointment /> {/* Calls the dropdown of the event creation method. */}
      <Goal/>
      {/* Main container for the grid system, setting margins, and justifying content to center to ensure it appears centered vertically and horizontally */}
      <Grid
        container
        spacing={4}
        mt={10}
        justifyContent="center"
        alignItems="center"
        style={{ height: "80vh" }}
      >
        {/* Dates Section */}
        <Grid item xs={6}>
          {/* Grid item holding the date selection controls, taking up half of the grid's width (6/12) */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            {/* Button to decrease the current month by 1, uses the handleMonthChange function with -1 as an argument to go to the previous month */}
            <Button onClick={() => handleMonthChange(-1)}>&lt;</Button>
            <Select
              value={currentDate.getMonth()}
              onChange={(e) =>
                setCurrentDate(new Date(currentDate.setMonth(e.target.value)))
              }
            >
              {/* Mapping over the months array to create a menu item for each month, setting the month name as the key and the index as the value */}
              {months.map((month, index) => (
                <MenuItem key={month} value={index}>
                  {month}
                </MenuItem>
              ))}
            </Select>
            <Select
              value={currentDate.getFullYear()}
              onChange={(e) =>
                setCurrentDate(
                  new Date(currentDate.setFullYear(e.target.value))
                )
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    width: 100,
                  },
                },
              }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
            {/* Button to increase the current month by 1, uses the handleMonthChange function with 1 as an argument to go to the next month */}
            <Button onClick={() => handleMonthChange(1)}>&gt;</Button>
          </Box>

          {/* Day Headers */}
          <Box display="flex" mb={2}>
            {daysOfWeek.map((day) => (
              <Box flexGrow={1} flexBasis="14.28%" textAlign="center" key={day}>
                <Typography>{day}</Typography>
              </Box>
            ))}
          </Box>

          {/* Dates */}
          <Box display="flex" flexWrap="wrap" justifyContent="center">
            {/* Render days from the previous month */}
            {Array.from({ length: adjustedFirstDay }).map((_, index) => (
              <Box
                flexGrow={1}
                flexBasis="14.28%"
                textAlign="center"
                key={"prevMonth-" + index}
              >
                <Button
                  variant="outlined"
                  style={{
                    margin: "5px",
                    width: "70px",
                    height: "70px",
                    lineHeight: "50px",
                    borderRadius: "50%",
                    color: "lightgray",
                    borderColor: "#9BBDF9",
                  }}
                >
                  {daysInPrevMonth - adjustedFirstDay + index + 1}
                </Button>
              </Box>
            ))}

            {/* Render days of the current month */}
            {Array.from({ length: daysInMonth }).map((_, index) => (
              <Box
                flexGrow={1}
                flexBasis="14.28%"
                textAlign="center"
                key={"currentMonth-" + index}
              >
                <Button
                  variant="outlined"
                  style={{
                    margin: "5px",
                    width: "70px",
                    height: "70px",
                    lineHeight: "50px",
                    borderRadius: "50%",
                    color: "#000",
                    borderColor: "#9BBDF9",
                    backgroundColor:
                      index + 1 === todayDate &&
                      currentDate.getMonth() === todayMonth &&
                      currentDate.getFullYear() === todayYear
                        ? "#9BBDF9"
                        : "white",
                  }}
                >
                  {index + 1}
                </Button>
              </Box>
            ))}

            {/* Render days from the next month */}
            {Array.from({ length: 42 - daysInMonth - adjustedFirstDay }).map(
              (_, index) => (
                <Box
                  flexGrow={1}
                  flexBasis="14.28%"
                  textAlign="center"
                  key={"nextMonth-" + index}
                >
                  <Button
                    variant="outlined"
                    style={{
                      margin: "5px",
                      width: "70px",
                      height: "70px",
                      lineHeight: "50px",
                      borderRadius: "50%",
                      color: "lightgray",
                      borderColor: "#9BBDF9",
                    }}
                  >
                    {index + 1}
                  </Button>
                </Box>
              )
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WelcomeUser;