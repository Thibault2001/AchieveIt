import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { auth, db, ref, onValue } from './firebase';
import moment from 'moment';
import { GetColour } from './Event';

function MyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const calendarRef = useRef(null);
  const [, setUserID] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const userID = user.uid;
        setUserID(userID);

        const eventsRef = ref(db, `calendar/${userID}/events`);
        onValue(eventsRef, (snapshot) => {
          const eventData = snapshot.val();
          if (eventData) {
            const eventArray = Object.entries(eventData).map(([eventID, eventData]) => ({
              id: eventID,
              title: eventData.eventTitle,
              start: moment(eventData.eventDate + 'T' + eventData.eventTime).format('YYYY-MM-DDTHH:mm:ss'),
              backgroundColor: GetColour(eventData.eventType),
              borderColor: GetColour(eventData.eventType),
              description: eventData.eventDescription,
            }));
            setEvents(eventArray);
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Display event in a popup
  function displayEventInfo(eventData, position) {
    setSelectedEvent(eventData);
    setPopupPosition(position);
  }

  // Close the popup
  function closeEventInfo() {
    setSelectedEvent(null);
  }

  // handle click on event
  function handleEventClick(info) {
    const eventData = info.event.extendedProps;
    const elementRect = info.jsEvent.target.getBoundingClientRect();
    const position = {
      top: elementRect.bottom + window.scrollY + 10, // Place of the popup
      left: elementRect.left + window.scrollX,
    };
    displayEventInfo(eventData, position);
  }

  // Handle date change from input
  function handleDateChange(date) {
    if (date) {
      setCurrentDate(date);
      if (calendarRef.current) {
        const calendar = calendarRef.current.getApi();
        calendar.gotoDate(date);
      }
    }
  }

  return (
    <div>
      <input
        type="date"
        value={currentDate ? moment(currentDate).format('YYYY-MM-DD') : ''}
        onChange={(e) => handleDateChange(e.target.value ? new Date(e.target.value) : null)}
      />

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        selectable={true}
        select={(info) => {
          handleDateChange(info.startStr);
        }}
      />

      {/*Display infos of the selected event */}
      {selectedEvent && (
        <div className="event-popup" style={{ top: popupPosition.top, left: popupPosition.left }}>
          <h2>{selectedEvent.title}</h2>
          <p>Reminder Time: {selectedEvent.start}</p>
          <p>Description: {selectedEvent.description}</p> {/* display description */}
          <button onClick={closeEventInfo}>Close</button>
        </div>
      )}
    </div>
  );
}

export default MyCalendar;