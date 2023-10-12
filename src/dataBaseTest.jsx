import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { auth, db, ref, onValue } from './firebase';
import moment from 'moment';
import { GetColour } from './Event';
import databaseTest from './CSS_files/databaseTest.css';

function MyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [selectedEvent, setSelectedEvent] = useState(null); // État pour stocker l'événement sélectionné
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
              description: eventData.eventDescription, // Ajoutez la description de l'événement
            }));
            setEvents(eventArray);
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Fonction pour afficher les informations de l'événement sélectionné en popup
  function displayEventInfo(eventData, position) {
    setSelectedEvent(eventData);
    setPopupPosition(position);
  }

  // Fonction pour fermer le popup d'informations de l'événement
  function closeEventInfo() {
    setSelectedEvent(null);
  }

  // Gestion du clic sur un événement
  function handleEventClick(info) {
    const eventData = info.event.extendedProps;
    const elementRect = info.jsEvent.target.getBoundingClientRect();
    const position = {
      top: elementRect.bottom + window.scrollY + 10, // Ajustez la position pour l'affichage du popup
      left: elementRect.left + window.scrollX,
    };
    displayEventInfo(eventData, position);
  }

  return (
    <div>
      <input
        type="date"
        value={currentDate ? moment(currentDate).format('YYYY-MM-DD') : ''}
        onChange={(e) => setCurrentDate(e.target.value ? new Date(e.target.value) : null)}
      />

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
      />

      {/* Affichage des informations de l'événement sélectionné en popup */}
      {selectedEvent && (
        <div className="event-popup" style={{ top: popupPosition.top, left: popupPosition.left }}>
          <h2>{selectedEvent.title}</h2>
          <p>Date: {selectedEvent.start}</p>
          <p>Description: {selectedEvent.description}</p> {/* Affichez la description de l'événement */}
          <button onClick={closeEventInfo}>Fermer</button>
        </div>
      )}
    </div>
  );
}

export default MyCalendar;