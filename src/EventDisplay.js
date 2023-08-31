import React, { useState } from 'react';
import './App.css';
import './Event.css';
import { Event } from './Event.js';

function EventDisplay({selectedItem, closeModal}) {
  const [events, setEvents] = useState([
    //example events
 
  ]);

  const [title, setTitle] = useState(selectedItem ? selectedItem.name : '');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');

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

  //
  return (
    <body>
      <div className='createEvent'>
      <p>{selectedItem ? selectedItem.name : ''} title:</p>
        <input
          type="text"
          value={title}
          onChange={titleChange}
        />

        {/*<p>type:</p>
        <input
          type="text"
          value={type}
          onChange={typeChange}
  />*/}

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
        <button onClick={handleCreateEvent}>Create Event</button>

        <div className='eventHolder'>
          {events.map((event) => (
            <Event
              key={event.id}
              title={event.title}
              type={selectedItem ? selectedItem.name : ''}
              date={event.date}
              description={event.description}
            />
          ))}
        </div>
      </div>
    </body>
  );
}

export default EventDisplay;