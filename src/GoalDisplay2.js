import React, { useEffect, useState } from "react";
import { auth, db, ref, onValue, set } from "./firebase";
import { Box, Typography, Card } from "@mui/material";
import { GetColour } from "./Event";

/*
  This component displays a list of goals from a user's database.
  Users can select and delete goals.

  It fetches goal data from Firebase Realtime Database and provides
  functionality to select and delete goals.
*/
const GoalDisplay = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userID = user.uid;

      const eventsRef = ref(db, `calendar/${userID}/goals`);

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

  const handleEventSelect = (event) => {
    if (selectedEvents.includes(event.eventID)) {
      setSelectedEvents(selectedEvents.filter((id) => id !== event.eventID));
    } else {
      setSelectedEvents([...selectedEvents, event.eventID]);
    }
  };

  const handleDeleteSelectedEvents = () => {
    selectedEvents.forEach((eventID) => {
      const user = auth.currentUser;
      const userID = user.uid;

      const eventRef = ref(db, `calendar/${userID}/goals/${eventID}`);
      set(eventRef, null);
    });

    setSelectedEvents([]);
  };

  return (
    <Box>
      <Typography variant="h4">Goals</Typography>
      <button onClick={handleDeleteSelectedEvents}>Delete Selected Goals</button>
      <div>
        {events.length > 0 ? (
          <div className="event-display-container">
            {events.map((event) => (
              <Card
                className={`event-display-card ${selectedEvents.includes(event.eventID) ? 'selected' : ''}`}
                style={{ backgroundColor: GetColour(event.eventType) }}
                key={event.eventID}
                onClick={() => handleEventSelect(event)}
              >
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(event.eventID)}
                  onChange={() => handleEventSelect(event)}
                />
                <h2>
                  <u>{event.title}</u>
                </h2>
                <br />
                <h3>
                  Date: <u>{event.date}</u>
                </h3>
                <br />
                <p>
                  <b>Details:</b>
                  <br />
                  {event.description}
                </p>
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

export default GoalDisplay;