import React, { useEffect, useState } from "react";
//import { GetColour } from "./Event";
import { Box, Typography, Card } from "@mui/material";
import { auth, db, ref, onValue, set } from "./firebase";
import { EditEvent } from "./editEvent"


const reminderTimeOptions = {

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
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [userID, setUserID] = useState(null);
  const [editEventData, setEditEventData] = useState(null);


  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);

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
      setUserID(userID);
      const eventRef = ref(db, `calendar/${userID}/events/${eventID}`);
      set(eventRef, null);
    });

    setSelectedEvents([]);
  };

  return (
    <Box>
      <Typography variant="h4">Events</Typography>
      <button onClick={handleDeleteSelectedEvents}>Delete Selected Events</button>
      <div>
        {events.length > 0 ? (
          <div className="event-display-container">
            {events.map((event) => (
              <Card
                className={`event-display-card ${selectedEvents.includes(event.eventID) ? 'selected' : ''}`}

                style={{ backgroundColor: `#${event.colour}` }}
                key={event.eventID}
                onClick={() => handleEventSelect(event)}
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
                  <br />
                  <br />
                </p>
                <p>
                  <b>Details:</b>
                  <br />
                  {event.eventDescription}
                </p>
                <button
                  className="editEventButton"
                  onClick={() => {
                    setIsEditEventModalOpen(true);
                    setEditEventData(event);
                  }}
                >
                  Customise
                </button>
                <EditEvent
                  isOpen={isEditEventModalOpen}
                  title={editEventData && editEventData.eventTitle}
                  type={editEventData && editEventData.eventType}
                  date={editEventData && editEventData.eventDate}
                  time={editEventData && editEventData.eventTime}
                  reminderTime={editEventData && editEventData.reminderTime}
                  desc={editEventData && editEventData.eventDescription}
                  colour = {editEventData && editEventData.colour}
                  userID={userID}
                  handleClose={() => {
                    setIsEditEventModalOpen(false);
                    setEditEventData(null); // clear event data after modal is closed
                  }}
                />


              </Card>
            ))}
          </div>
        ) : (
          <p>No events to display.</p>
        )}
      </div>
    </Box>
  );
};

export default EventDisplay;