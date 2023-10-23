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
  const [goals, setGoals] = useState([]);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
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
              eventType: eventData.eventType,
              reminder: eventData.reminderTime,
            }));
            setEvents(eventArray);
          }
        });

        const goalsRef = ref(db, `calendar/${userID}/goals`);
        onValue(goalsRef, (snapshot) => {
          const goalData = snapshot.val();
          if (goalData) {
            const goalArray = Object.entries(goalData).map(([goalID, goalData]) => ({
              id: goalID,
              title: goalData.title,
              start: moment(goalData.date).format('YYYY-MM-DD'),
              backgroundColor: GetColour('goalsColor'), // PUT THE RIGHT COLOR!
              description: goalData.description,
            }));
            setGoals(goalArray);
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  function displayEventInfo(eventData, position) {
    setSelectedEvent(eventData);
    setPopupPosition(position);
  }

  function closeEventInfo() {
    setSelectedEvent(null);
  }

  function displayGoalInfo(goalData, position) {
    setSelectedGoal(goalData);
    setPopupPosition(position);
  }

  function closeGoalInfo() {
    setSelectedGoal(null);
  }

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
        events={[...events, ...goals]}
        eventClick={(info) => {
          if (info.event.extendedProps.description) {
            displayEventInfo(info.event.extendedProps, {
              top: info.jsEvent.clientY + window.scrollY + 10,
              left: info.jsEvent.clientX + window.scrollX,
            });
          } else {
            displayGoalInfo(info.goal.extendedProps, {
              top: info.jsEvent.clientY + window.scrollY + 10,
              left: info.jsEvent.clientX + window.scrollX,
            });
          }
        }}
        selectable={true}
        select={(info) => {
          handleDateChange(info.startStr);
        }}
      />

      {selectedEvent && (
        <div className="event-popup" style={{ top: popupPosition.top, left: popupPosition.left }}>
          <h2>{selectedEvent.title}</h2>
          <p>Event Type: {selectedEvent.eventType}</p>
          <p>Reminder Time: {selectedEvent.reminder}</p>
          <p>Description: {selectedEvent.description}</p>
          <button onClick={closeEventInfo}>Close</button>
        </div>
      )}

      {selectedGoal && (
        <div className="goal-popup" style={{ top: popupPosition.top, left: popupPosition.left }}>
          <h2>{selectedGoal.title}</h2>
          <p>Date: {selectedGoal.start}</p>
          <p>Description: {selectedGoal.description}</p>
          <button onClick={closeGoalInfo}>Close</button>
        </div>
      )}
    </div>
  );
}

export default MyCalendar;