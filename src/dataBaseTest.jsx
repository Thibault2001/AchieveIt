import React, { useState, useEffect,useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { db, ref, onValue } from './firebase'; // Assurez-vous que le chemin vers votre fichier firebase.js est correct

function MyCalendar() {
  const [events, setEvents] = useState([]);
  const calendarRef = useRef(null);

  useEffect(() => {
    // Référence à la table (nœud) des événements dans la base de données Firebase (adaptez le chemin)
    const eventsRef = ref(db, 'events');

    // Écouter les changements en temps réel dans les événements
    onValue(eventsRef, (snapshot) => {
      const eventData = snapshot.val();
      if (eventData) {
        const eventArray = Object.entries(eventData).map(([key, value]) => ({
          id: key,
          title: value.title,
          start: value.start,
          end: value.end,
        }));
        setEvents(eventArray);
      }
    });
  }, []);

  return (
    <div>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events} // Utilisation des données d'événements depuis Firebase
      />
    </div>
  );
}

export default MyCalendar;