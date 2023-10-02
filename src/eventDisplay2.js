import React, { useEffect, useState } from "react";
import { GetColour } from "./Event";
import { Box, Typography, Card } from "@mui/material"; // Import Card from MUI
import { db, ref, onValue } from "./firebase";
import { auth } from "./firebase";
import "./CSS_files/EventDisplay.css";

// Define reminder time options
const reminderTimeOptions = {
  //Defining options for the reminder time
  at_event: 'At Time of Event',
  '5': '5 Minutes',
  '10': '10 Minutes',
  '15': '15 Minutes',
  '30': '30 Minutes',
  '60': '1 Hour',
  '120': '2 Hours',
  '360': '6 Hours',
  '720': '12 Hours',
  '1440': '1 Day',
  '2880': '2 Days',
  '4320': '3 Days',
  '10080': '1 Week',
  '20160': '2 Weeks',
};

const EventDisplay = () => {
  const [events, setEvents] = useState([]);
  const [, setUserID] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userID = user.uid;
      setUserID(userID);

      const eventsRef = ref(db, `calendar/${userID}/events`);

      onValue(eventsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const eventsArray = Object.values(data);
          setEvents(eventsArray);
        } else {
          setEvents([]);
        }
      });
    }
  }, []);

  return (
    <Box>
      <Typography variant="h4">Events</Typography>
      <div className="events-container">
        {events.length > 0 ? (
          events.map((event) => (
            <Card
              className="event-card"
              style={{ backgroundColor: GetColour(event.eventType) }}
              key={event.eventID}
            >
              <h2>
                <u>{event.eventTitle}</u>
              </h2>
              <br />
              <h3>
                Event Type: <u>{event.eventType}</u>
              </h3>{" "}
              <br />
              <h3>
                Date: <u>{event.eventDate}</u>
              </h3>
              <br />
              <h3>
                Time: <u>{event.eventTime}</u>
              </h3>
              <br />
              <h3>
                Reminder will be sent{" "}
                <u>
                  {event.reminderTime === "at_event"
                    ? `${reminderTimeOptions[event.reminderTime]}.`
                    : `${reminderTimeOptions[event.reminderTime]} before event.`}
                </u>
              </h3>
              <p>
                <b>Details:</b>
                <br />
                {event.eventDescription}
              </p>
            </Card>
          ))
        ) : (
          <p>No events to display.</p>
        )}
      </div>
    </Box>
  );
};

export default EventDisplay;