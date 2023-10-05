import React, { useState } from 'react';
import './CSS_files/App.css';
import './CSS_files/Event.css';
import { Event } from './Event.js';
import { auth, ref, set, db } from './firebase'; // Assurez-vous d'importer Firebase correctement.
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function GoalDisplay({ closeModal }) {
  const [goals] = useState([]); // Utilisez "goals" pour stocker les objectifs
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [descrip, setDescrip] = useState('');

  const user = auth.currentUser;
  const userID = user ? user.uid : '';

  const titleChange = (event) => {
    setTitle(event.target.value);
  };

  const dateChange = (event) => {
    setDate(event.target.value);
  };

  const descChange = (event) => {
    setDescrip(event.target.value);
  };

  const handleCreateGoal = () => {
    const newGoal = {
      title: title,
      date: date,
      description: descrip,
    };

    const goalRef = ref(db, `calendar/${userID}/goals/${title}`); // Utilisez l'ID de l'utilisateur pour stocker les objectifs dans la base de données

    set(goalRef, newGoal)
      .then(() => {
        toast.success('Goal Created Successfully!');
        // Vous pouvez également mettre à jour l'état local ici si nécessaire.
      })
      .catch((error) => {
        toast.error('Failed to Create Goal.');
      });

    // Réinitialisez les champs du formulaire.
    setTitle('');
    setDate('');
    setDescrip('');
  };

  return (
    <div className="createEvent">
      <p>Title:</p>
      <input
        type="text"
        onChange={titleChange}
        value={title}
        placeholder="Enter Title"
      />

      <p>Date:</p>
      <input
        type="date"
        value={date}
        onChange={dateChange}
      />

      <p>Description:</p>
      <textarea
        id="textAreaDescription"
        rows="5"
        cols="50"
        value={descrip}
        onChange={descChange}
        placeholder="Enter your description here..."
      ></textarea>

      <div className="eventHolder">
        {goals.map((goal, index) => (
          <Event
            key={index}
            title={goal.title}
            date={goal.date}
            description={goal.description}
          />
        ))}
      </div>
      <button onClick={handleCreateGoal}>Create Goal</button>
      <ToastContainer autoClose={5000} />
    </div>
  );
}

export default GoalDisplay;