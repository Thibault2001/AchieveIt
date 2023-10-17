import React, { useState, useEffect } from "react";
import { Button, Typography, Box, Grid, Select, MenuItem } from "@mui/material";
import { auth, ref, db } from './firebase';
import { get } from "firebase/database";
import './CSS_files/App.css';
import './CSS_files/calendarDisplay.css';


const CalendarDisplay = () => {
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

  const handleMonthChange = (change) => {
    const newMonth = currentDate.getMonth() + change;
    if (newMonth === -1) {
      setCurrentDate((prevDate) => new Date(prevDate.getFullYear() - 1, 11, 1));
    } else if (newMonth === 12) {
      setCurrentDate((prevDate) => new Date(prevDate.getFullYear() + 1, 0, 1));
    } else {
      setCurrentDate((prevDate) => new Date(prevDate.setMonth(newMonth)));
    }
  };

  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 10;
  const years = Array.from({ length: 21 }, (_, index) => startYear + index);

  const months = Array.from({ length: 12 }, (_, index) =>
    new Date(2000, index).toLocaleString("default", { month: "long" })
  );

  const [selectedEvents, setSelectedEvents] = useState([]);
  const user = auth.currentUser;
  const userID = user ? user.uid : '';

  const handleDateClick = (year, month, day) => {
    const eventRef = ref(db, `calendar/${userID}/events`);
    get(eventRef).then((snapshot) => {
      if (snapshot.exists()) {
        const allEvents = snapshot.val();
        const eventsForSelectedDate = Object.values(allEvents).filter(
          (event) => event.eventDate === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        );
        setSelectedEvents(eventsForSelectedDate);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  };

  const [eventsForMonth, setEventsForMonth] = useState({});

  useEffect(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const eventRef = ref(db, `calendar/${userID}/events`);
    get(eventRef).then((snapshot) => {
      if (snapshot.exists()) {
        const allEvents = snapshot.val();
        const eventsThisMonth = Object.values(allEvents).filter(
          (event) => new Date(event.eventDate) >= startOfMonth && new Date(event.eventDate) <= endOfMonth
        );

        const organizedEvents = {};
        eventsThisMonth.forEach((event) => {
          const eventDay = new Date(event.eventDate).getDate();
          if (!organizedEvents[eventDay]) {
            organizedEvents[eventDay] = [];
          }
          organizedEvents[eventDay].push(event);
        });

        setEventsForMonth(organizedEvents);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, [currentDate, userID]);

  const getEventInfoForDay = (day) => {
    const events = eventsForMonth[day];
    if (events && events.length > 0) {
      return {
        title: events[0].eventTitle,
        more: events.length > 1,
      };
    }
    return null;
  };

  return (
    <Box p={4}>
      <Grid container spacing={4} mt={10} justifyContent="center" alignItems="center">
        {selectedEvents.length > 0 && (
          <Grid item xs={6}>
            <Typography variant="h5">Events for {`${currentDate.getMonth() + 1}/${todayDate}/${currentDate.getFullYear()}`}</Typography>
            {selectedEvents.map((event, index) => (
              <div key={index}>
                <Typography variant="h6">{event.eventTitle}</Typography>
                <Typography>{event.eventTime}</Typography>
                <Typography>{event.eventDescription}</Typography>
                <hr />
              </div>
            ))}
          </Grid>
        )}

        <Grid item xs={12}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Button onClick={() => handleMonthChange(-1)}>&lt;</Button>
            <Select
              value={currentDate.getMonth()}
              onChange={(e) =>
                setCurrentDate(new Date(currentDate.setMonth(e.target.value)))
              }
            >
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
            <Button onClick={() => handleMonthChange(1)}>&gt;</Button>
          </Box>

          <Box display="flex" justifyContent="space-around" mt={2} mb={2}>
            {daysOfWeek.map((day) => (
              <Box flexBasis="14%" textAlign="center" key={day}>
                <Typography>{day}</Typography>
              </Box>
            ))}
          </Box>

          <Box display="flex" flexWrap="wrap" justifyContent="center">
            {Array.from({ length: adjustedFirstDay }).map((_, index) => (
              <Box
                flexGrow={1}
                flexBasis="14.28%"
                textAlign="center"
                key={"prevMonth-" + index}
              >
                <Button
                  variant="outlined"
                  onClick={() => handleDateClick(currentDate.getFullYear(), currentDate.getMonth(), index + 1)} 
                  style={{
                    margin: "5px",
                    width: "7vw",  // Adjusted the size based on viewport
                    height: "7vw",
                    lineHeight: "7vw",
                    borderRadius: "50%",
                    color: "#000",
                    borderColor: "#9BBDF9",
                  }}
                >
                  {daysInPrevMonth - adjustedFirstDay + index + 1}
                </Button>
              </Box>
            ))}

            {Array.from({ length: daysInMonth }).map((_, index) => {
              const eventInfo = getEventInfoForDay(index + 1);
              return (
                <Box
                  flexGrow={1}
                  flexBasis="14.28%"
                  textAlign="center"
                  key={"currentMonth-" + index}
                >
                  <Button
                    variant="outlined"
                    onClick={() => handleDateClick(currentDate.getFullYear(), currentDate.getMonth(), index + 1)} 
                    style={{
                      margin: "5px",
                      width: "7vw",
                      height: "7vw",
                      lineHeight: "7vw",
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
                    {eventInfo && <span>{eventInfo.title}{eventInfo.more && "+"}</span>}
                  </Button>
                </Box>
              );
            })}

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
                    onClick={() => handleDateClick(currentDate.getFullYear(), currentDate.getMonth(), index + 1)} 
                    style={{
                      margin: "5px",
                      width: "7vw",
                      height: "7vw",
                      lineHeight: "7vw",
                      borderRadius: "50%",
                      color: "#000",
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

export default CalendarDisplay;
