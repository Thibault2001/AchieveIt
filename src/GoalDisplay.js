import React, { useState } from 'react';
import { Event } from './Event.js';
import './App.css';
import './Event.css';

function GoalDisplay({ selectedItem, closeModal }) {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState(selectedItem ? selectedItem.name : '');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [descrip, setDescrip] = useState('');

  const titleChange = (event) => {
    setTitle(event.target.value);
  };

  const dateChange = (event) => {
    setDate(event.target.value);
  };

  const descChange = (event) => {
    setDescrip(event.target.value);
  };

  const handleCreateEvent = () => {
    // Get the current date as a JavaScript Date object
    const currentDate = new Date();

    // Parse the selected date as a JavaScript Date object
    const selectedDate = new Date(date);

    // Check if the selected date is in the future
    if (selectedDate > currentDate) {
      const newEvent = {
        id: events.length + 1,
        title: title,
        type: type,
        date: date,
        description: descrip,
      };

      setEvents([...events, newEvent]);
      setTitle('');
      setType('');
      setDate('');
      setDescrip('');
    } else {
      // Display an error message or handle the case when the date is not in the future
      alert('Please select a date in the future.');
    }
  };

  return (
    <div className="createEvent">
      <p>{selectedItem ? selectedItem.name : ''} Title:</p>
      <input
        type="text"
        onChange={titleChange}
        placeholder="Enter Title"
      />

      <p>Date:</p>
      <input
        type="date"
        value={date}
        onChange={dateChange}
      />

      <p>{selectedItem ? selectedItem.name : ''} Description:</p>
      <textarea
        id="textAreaDescription"
        rows="5"
        cols="50"
        placeholder="Enter your description here..."
        onChange={descChange}
      ></textarea>

      <div className="eventHolder">
        {events.map((event) => (
          <Event
            key={event.id}
            title={event.title}
            type={selectedItem ? selectedItem.name : ''}
            date={event.date}
            time={event.time}
            description={event.description}
          />
        ))}
      </div>
      <button onClick={handleCreateEvent}>Create Goal</button>
    </div>
  );
}

export default GoalDisplay;
