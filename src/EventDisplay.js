import React, { useState, useEffect } from 'react';
import './CSS_files/App.css';
import './CSS_files/Event.css';
import './CSS_files/EventDisplay.css';
import { Event } from './Event.js';
import { auth, ref, set, db } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetColour } from './Event.js';
//import Appointment from './Appointment';

function EventDisplay({ selectedItem, closeModal }) {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState(selectedItem ? selectedItem.name : '');
  const [, setType] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [colour, setColour] = useState('');
  const [selectedTime, setSelectedTime] = useState('00:00');
  const [selectedReminderTime, setSelectedReminderTime] = useState('at_event');
  const [, setIsEventAdded] = useState(null); // initialisation

  const user = auth.currentUser;
  const userID = user ? user.uid : '';

  const titleChange = (event) => {
    setTitle(event.target.value);
  };

  const dateChange = (event) => {
    setDate(event.target.value);
  };

  const descChange = (event) => {
    setDesc(event.target.value);
  };

  const colourChange = (event) => {
    const newColour = event.target.value;
    setColour(newColour.substring(1));
  }
   
  
  const handleCreateEvent = () => {
    const newEvent = {
      eventID: title,
      eventTitle: title,
      eventType: selectedItem.name,
      eventDate: date,
      eventTime: selectedTime,
      eventDescription: desc,
      reminderTime: selectedReminderTime,
      colour: colour
    };

    const eventRef = ref(db, `calendar/${userID}/events/${title}`);
    set(eventRef, newEvent)
      .then(() => {
        // Event added with success
        setIsEventAdded(true);
        toast.success('Adding Event Successfully!');
      })
      .catch((error) => {
        // Event not added
        setIsEventAdded(false);
        toast.error('Failed to Add Event.');
        console.error('Error adding event: ', error);
      });

    setEvents([...events, newEvent]);

    // Clear input fields
    setTitle('');
    setType('');
    setDate('');
    setSelectedTime('00:00');
    setDesc('');
    setSelectedReminderTime('at_event');
  };

  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 15) {
      const formattedHour = String(hour).padStart(2, '0');
      const formattedMinute = String(min).padStart(2, '0');
      const timeOption = `${formattedHour}:${formattedMinute}`;
      timeOptions.push(timeOption);
    }
  }

  useEffect(() => {
    if (GetColour(selectedItem.name) === "CUSTOMCOLOUR") {
      
      setColour(colour);
    } else {

      setColour(GetColour(selectedItem.name).substring(1));
    }
  }, [selectedItem.name]);

  return (
    <body>
      <div className='createEvent'>
        <p>{selectedItem ? selectedItem.name : ''} Title:</p>
        <input
          type="text"
          onChange={titleChange}
          placeholder='Enter Event Title'
        />

        <p>Date:</p>
        <input
          type="date"
          value={date}
          onChange={dateChange}
        />

        <p>{selectedItem ? selectedItem.name : ''} Time (24 Hour Time):</p>
        <select
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          {timeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <p>{selectedItem ? selectedItem.name : ''} Description:</p>
        <textarea
          id="textAreaDescription"
          rows="5"
          cols="50"
          placeholder='Enter your event description here...'
          onChange={descChange}
        ></textarea>
        <br></br>

        <p>Set Reminder Time:</p>
        <select
          value={selectedReminderTime}
          onChange={(e) => setSelectedReminderTime(e.target.value)}
        >
          <option value="at_event">At Time of Event</option>
          <option value="5">5 Minutes</option>
          <option value="10">10 Minutes</option>
        </select>


        {GetColour(selectedItem.name) === "CUSTOMCOLOUR" && (
          <div>
            <p>Choose a color:</p>
            <input
              type="color"
              id="colourPick"
              onChange={colourChange}
            />
        
          </div>
          
        )}

        <br />
        <div className='eventHolder'>
          {events.map((event) => (
            <Event
              key={event.eventID}
              title={event.eventTitle}
              type={selectedItem.name}
              date={event.eventDate}
              time={event.eventTime}
              reminderTime={event.reminderTime}
              description={event.eventDescription}
              colour={colour}
            />
          ))}
        </div>

        <button className='createEventButton' onClick={handleCreateEvent}>
          Create Event
        </button>
      </div>
      <ToastContainer autoClose={5000} />
    </body>
  );
}

export default EventDisplay;