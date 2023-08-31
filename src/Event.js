import React from "react";
import './App.js';
import { useState } from "react";

function Event({ title, type, date, description }) {

    return (
        <div className="event" style={{ backgroundColor: GetColour(type) }}>
            <h2>{title}</h2>
            <h3>{date}</h3>
            <h4>{type}</h4>
            <p>{description}</p>
        </div>
    );
}

//This function will return a hexadecimal colour based on the type of event the user chooses.
function GetColour(type) {
    switch (type) {
        case "University":
            return "#ffaa00c7"
        case "Sports":
            return "#13bb0ac7"
        case "Birthday":
            return "#0ab5bbc7"
        default:
            return "#6200ffc7"
    }

}

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
  
  
export { Event, EventDisplayFunction };
