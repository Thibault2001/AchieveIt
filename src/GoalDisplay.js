import React, { useState } from 'react';
import { Event } from './Event.js';
import './CSS_files/App.css';
import './CSS_files/Event.css';
import { auth, ref, set, db } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Get UserID
const user = auth.currentUser;
const userID = user ? user.uid : '';

/*
This function creates all the details and fields needed for the goal details pop
up modal. 
*/

function GoalDisplay({ selectedItem, closeModal }) {
  // Create all the state variables
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState(selectedItem ? selectedItem.name : '');
  const [date, setDate] = useState('');
  const [descrip, setDescrip] = useState('');

  // Allows a user to enter a Title for the goal
  const titleChange = (event) => {
    setTitle(event.target.value);
  };

  // Allows the user to set the due date for the goal
  const dateChange = (event) => {
    setDate(event.target.value);
  };

  // Allows the user to add a description for the goal
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
        date: date,
        description: descrip,
      };

      const goalRef = ref(db, `calendar/${userID}/goals/${title}`);
      console.log(goalRef)
      set(goalRef, newEvent)
        .then(() => {
          toast.success('Goal Created Successfully!');
          // Clear the fields for the user to add another goal
          setEvents([...events, newEvent]);
          setTitle('');
          setDate('');
          setDescrip('');
        })
        .catch((error) => {
          toast.error('Failed to Create Goal. Please try again later.'); // Display an error notification on failure
        });
    } else {
      toast.error('Please select a date in the future.'); // Display an error notification if the date is not valid
    }
  };

  return (
    <div className="createEvent">
      <p>{selectedItem ? selectedItem.name : ''} Title:</p>
      <input
        type="text"
        onChange={titleChange}
        placeholder="Enter Title"
        value={title}
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
        value={descrip}
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
      <ToastContainer autoClose={5000} />
    </div>
  );
}

export default GoalDisplay;