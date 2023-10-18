//import React, { useEffect } from "react";
import './App.js';
import './CSS_files/Event.css';
import { useState, React } from "react";
//import { SketchPicker } from 'react-color';
//import { auth, db, ref, onValue, set } from "./firebase";

/*
This file contains the logic of creating an event, as well as the reminder times, it also contains the display of an event, and some example events
*/

function Event({ title, type, date, time, reminderTime, description, colour }) {

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
  //display for the event:
  return (
    <div className="event" style={{ backgroundColor: `#${colour}`}}> {/*Will display background colour for card based on event type*/}
      <h2><u>{title}</u></h2><br />
      <h3>Event Type: <u>{type}</u></h3> <br />
      <h3>Date: <u>{date}</u></h3>
      <br />
      <h3>Time: <u>{time}</u></h3>
      <br />
      <h3>Reminder will be sent {' '}
        <u>
          {reminderTime === 'at_event'
            ? `${reminderTimeOptions[reminderTime]}.`
            : `${reminderTimeOptions[reminderTime]} before event.`} {/* Ternary statement so sentence makes logical sense.*/}
        </u>
      </h3>
      <p><b>Details:</b><br />{description}</p> {/* Prints event description based on user input */}
    </div>
  );
}

//This function will return a hexadecimal colour based on the type of event the user chooses.
function GetColour(type) {

  switch (type) {
    case "University":
      return "#ffaa00c7" //Orange
    case "Sports":
      return "#13bb0ac7" //Green
    case "Birthday":
      return "#0ab5bbc7" //Turquoise
    case "Appointment":
      return "#d4ff00" //Yellow
    default:
      return "CUSTOMCOLOUR"
  }

}

function EventDisplayFunction() {
  const [events, setEvents] = useState([

  ]);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');

  //Set methods used for accessing user inputs
  const titleChange = (event) => {
    setTitle(event.target.value);
  };

  const typeChange = (event) => {
    setType(event.target.value);
  };

  const dateChange = (event) => {
    setDate(event.target.value);
  };

  const descChange = (event) => {
    setDesc(event.target.value);
  };

  //create an event with the inputs
  const handleCreateEvent = () => {
    const newEvent = {
      id: events.length + 1,
      title: title,
      type: type,
      date: date,
      description: desc
    };

    setEvents([...events, newEvent]);
    //createEvent(title, type, date, desc);

    // Clear input fields
    setTitle('');
    setType('');
    setDate('');
    setDesc('');
  };

  //display input fields
  return (
    <body>
      <div className='createEvent'>
        <p>title:</p>
        <input
          type="text"
          value={title}
          onChange={titleChange}
        />

        <p>type:</p>
        <input
          type="text"
          value={type}
          onChange={typeChange}
        />

        <p>date:</p>
        <input
          type="date"
          value={date}
          onChange={dateChange}
        />

        <p>description:</p>
        <input
          type="text"
          value={desc}
          onChange={descChange}
        />

        {/*Button to create event*/}
        <button onClick={handleCreateEvent}>Create Event</button>

        <div className='eventHolder'>
          {/* Map through the events and display Event component for each one */}
{/*
          {events.map((event) => (
            <Event
              key={event.id}
              title={event.title}
              type={event.type}
              date={event.date}
              time={event.time}
              description={event.description}
              colour={GetColour(event.type)}
            />
          ))}
          */}
        </div>
      </div>
    </body>
  );
}


export { Event, EventDisplayFunction, GetColour };
