import React, { useState } from 'react';
import './App.css';
import './Event.css';
import './CSS files/EventDisplay.css';
import { Event } from './Event.js';

function EventDisplay({selectedItem, closeModal}) {
  const [events, setEvents] = useState([
    //example events
 
  ]);

  const [title, setTitle] = useState(selectedItem ? selectedItem.name : '');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedTime, setSelectedTime] = useState('00:00');
  const [selectedReminderTime, setSelectedReminderTime] = useState('at_event');

  const titleChange = (event) => {
    setTitle(event.target.value);
  };

  // const typeChange = (event) => {
  //   setType(event.target.value);
  // };

  const dateChange = (event) => {
    setDate(event.target.value);
  };

  const descChange = (event) => {
    setDesc(event.target.value);
  };

  const handleCreateEvent = () => {
    const newEvent = {
      id: events.length + 1,
      title: title,
      type: type,
      date: date,
      time: selectedTime,
      description: desc,
      reminderTime: selectedReminderTime,
    };

    setEvents([...events, newEvent]);
    //createEvent(title, type, date, desc);
    
    // Clear input fields
    setTitle('');
    setType('');
    setDate('');
    setSelectedTime('00:00')
    setDesc('');
    setSelectedReminderTime('at_event');
  };

  const timeOptions = [];
  for(let hour = 0; hour < 24; hour++)
  {
    for(let min = 0; min < 60; min +=15)
    {
      const formattedHour = String(hour).padStart(2, '0');
      const formattedMinute = String(min).padStart(2,'0')
      const timeOption = `${formattedHour}:${formattedMinute}`;
      timeOptions.push(timeOption);
    }
  }


    
  //
  return (
    <body>
      <div className='createEvent'>
      <p>{selectedItem ? selectedItem.name : ''} Title:</p>
        <input
          type="text"

          onChange={titleChange}
          placeholder='Enter Event Title'
        />

        {/*<p>type:</p>
        <input
          type="text"
          value={type}
          onChange={typeChange}
  />*/}

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
        {/* <input
          type="text"
          value={desc}
          onChange={descChange}
        /> */}

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
            <option value="15">15 Minutes</option>
            <option value="30">30 Minutes</option>
            <option value="60">1 Hour</option>
            <option value="120">2 Hours</option>
            <option value="360">6 Hours</option>
            <option value="720">12 Hours</option>
            <option value="1440">1 Day</option>
            <option value="2880">2 Days</option>
            <option value="4320">3 Days</option>
            <option value="10080">1 Week</option>
            <option value="20160">2 Weeks</option>
          </select>

        <br />
        <div className='eventHolder'>
          {events.map((event) => (
            <Event
              key={event.id}
              title={event.title}
              type={selectedItem ? selectedItem.name : ''}
              date={event.date}
              time={event.time}
              reminderTime={event.reminderTime}
              description={event.description}
            />
          ))}
        </div>
        <button className='createEventButton' onClick={handleCreateEvent}>Create Event</button>
            
      </div>
    </body>
  );
}

export default EventDisplay;