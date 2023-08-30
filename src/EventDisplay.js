import React, { useState } from 'react';
import './App.css';
import './Event.css';
import { Event } from './Event.js';

function EventDisplayFunction() {
  const [events, setEvents] = useState([
    //example events
    {
      id: 1,
      title: "Event 1",
      type: "University",
      date: "2023-08-18",
      description: "Today I have an assignment to do"
    },
    {
      id: 2,
      title: "Event 2",
      type: "Birthday",
      date: "2023-09-21",
      description: "Someone's birthday"
    },
    {
      id: 3,
      title: "Event 3",
      type: "Sports",
      date: "2023-09-21",
      description: "Today I really want to play some football"
    }
  ]);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');

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
        <button onClick={handleCreateEvent}>Create Event</button>

        <div className='eventHolder'>
          {events.map((event) => (
            <Event
              key={event.id}
              title={event.title}
              type={event.type}
              date={event.date}
              description={event.description}
            />
          ))}
        </div>
      </div>
    </body>
  );
}

export default EventDisplayFunction;
