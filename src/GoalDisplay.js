import React, { useState } from 'react';
import { Event } from './Event.js';
import './CSS_files/App.css';
import './CSS_files/Event.css';

function GoalDisplay({ selectedItem, closeModal }) {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState(selectedItem ? selectedItem.name : '');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [descrip, setDescrip] = useState('');
  const [showSubgoalsCheckbox, setShowSubgoalsCheckbox] = useState(false); // Initially hidden
  const [showSubgoals, setShowSubgoals] = useState(false); // To control subgoals visibility
  const [subgoalTitle, setSubgoalTitle] = useState('');
  const [subgoalDate, setSubgoalDate] = useState('');
  const [subgoalTime, setSubgoalTime] = useState('');
  const [subGoalDesc, setSubGoalDesc] = useState('');

  const titleChange = (event) => {
    setTitle(event.target.value);
  };

  const dateChange = (event) => {
    const selectedDate = new Date(event.target.value);
    const currentDate = new Date();
    const threeMonthsFromNow = new Date(currentDate);
    threeMonthsFromNow.setMonth(currentDate.getMonth() + 3);

    setDate(event.target.value);
    setShowSubgoalsCheckbox(selectedDate > threeMonthsFromNow);
  };

  const descChange = (event) => {
    setDescrip(event.target.value);
  };

  const handleCreateEvent = () => {
    const currentDate = new Date();
    const selectedDate = new Date(date);

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
      setShowSubgoals(false); // Hide subgoals after creating the main goal
    } else {
      alert('Please select a date in the future.');
    }
  };

  const handleCreateSubgoal = () => {
    const newSubgoal = {
      id: events.length + 1, // Use the same ID counter for subgoals
      title: subgoalTitle,
      date: subgoalDate,
      desc: subGoalDesc,
      time: subgoalTime,
    };

    setEvents([...events, newSubgoal]); // Add subgoal to events
    setSubgoalTitle('');
    setSubgoalDate('');
    setSubgoalTime('');
    setSubGoalDesc('');
  };

  return (
    <div className="createGoal">
  <div className="left-align">
    <p>{selectedItem ? selectedItem.name : ''} Title:</p>
    <textarea
      id="textAreaTitle"
      rows='2'
      cols = '50'
      onChange={titleChange}
      placeholder="Enter Title"
      className="enter-title"
    ></textarea>
  </div>

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
    onChange={setSubGoalDesc}
  ></textarea>
<p> </p>
<button onClick={handleCreateEvent}>Create Goal</button>

  {showSubgoalsCheckbox && (
    <label>
      <input
        type="checkbox"
        onChange={() => setShowSubgoals(!showSubgoals)}
        checked={showSubgoals}
      />
      Show Subgoals
    </label>
  )}

  {showSubgoals && (
    <div>
      <h3>Create Subgoals</h3>
      <p>Title: </p>
       <textarea
          id="textAreaTitle"
          rows='2'
          cols = '50'
          placeholder="Subgoal Title"
          value={subgoalTitle}
          onChange={(e) => setSubgoalTitle(e.target.value)}
          className='enter-title'
        />
      <p>Date:</p>
  <input
    type="date"
    value={date}
    onChange={setSubgoalDate}
  />

  <p>{selectedItem ? selectedItem.name : ''} Description:</p>
  <textarea
    id="textAreaDescription"
    rows="5"
    cols="50"
    placeholder="Enter your description here..."
    onChange={descChange}
  ></textarea>
      <p></p>
      <button onClick={handleCreateSubgoal}>Create Subgoal</button>
    </div>
  )}

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
</div>

  );
}

export default GoalDisplay;
