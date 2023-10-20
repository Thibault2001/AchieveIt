import React, { useState } from 'react';
import './CSS_files/App.css';
import { auth, ref, set, db } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CSS_files/GoalDisplay.css'; // Add your CSS file for styling

function GoalDisplay({ selectedItem, closeModal }) {
  const [, setUserID] = useState(null);
  const [goals, setGoals] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [descrip, setDescrip] = useState('');
  const [showSubgoalsCheckbox, setShowSubgoalsCheckbox] = useState(false);
  const [showSubgoals, setShowSubgoals] = useState(false);
  const [subgoalTitle, setSubgoalTitle] = useState('');
  const [subgoalDate, setSubgoalDate] = useState('');
  const [subGoalDesc, setSubGoalDesc] = useState('');
  const [subgoalStartTime, setSubgoalStartTime] = useState('');
  const [subgoalEndTime, setSubgoalEndTime] = useState('');
  const [error, setError] = useState('');

  const user = auth.currentUser;
  const userID = user ? user.uid : '';

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

  const handleCreateGoal = () => {
    if (!title || !date || !descrip) {
      setError('Please fill in all goal fields.');
      return;
    }

    setError('');

    console.log("Creating goal...");
    const currentDate = new Date();
    const selectedDate = new Date(date);
    if (selectedDate > currentDate) {
      const newGoal = {
        id: goals.length + 1,
        title: title,
        date: date,
        description: descrip,
        isSubgoal: false,
      };

      if (user) {
        const userID = user.uid;
        setUserID(userID);
        const goalRef = ref(db, `calendar/${userID}/goals/${title}`);
        console.log(goalRef)
        set(goalRef, newGoal)
          .then(() => {
            toast.success('Goal Created Successfully!');
            // Clear the fields for the user to add another goal
            setGoals([...goals, newGoal]);
            setTitle('');
            setDate('');
            setDescrip('');
            setShowSubgoals(false);
          })
          .catch((error) => {
            toast.error('Failed to Create Goal. Please try again later.'); // Display an error notification on failure
          });
        }
      } else {
      toast.error('Please select a date in the future.');
    }
  };

  const handleCreateSubgoal = () => {
    if (showSubgoals) {
      if (!subgoalTitle || !subgoalDate || !subGoalDesc) {
        setError('Please fill in all subgoal fields.');
        return;
      }
      setError('');

      const newSubgoal = {
        id: goals.length + 1,
        title: subgoalTitle,
        date: subgoalDate,
        description: subGoalDesc,
        isSubgoal: true,
        startTime: subgoalStartTime,
        endTime: subgoalEndTime,
      };

      setGoals([...goals, newSubgoal]);
      setSubgoalTitle('');
      setSubgoalDate('');
      setSubGoalDesc('');
      setSubgoalStartTime('');
      setSubgoalEndTime('');
    } else {
      setShowSubgoals(true);
    }
  };

  return (
    <div className="createGoal">
      <div className="left-align">
        <p>Title:</p>
        <textarea
          id="textAreaTitle"
          rows="2"
          cols="50"
          onChange={titleChange}
          value={title}
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

      <p>Description:</p>
      <textarea
        id="textAreaDescription"
        rows="5"
        cols="50"
        placeholder="Enter your description here..."
        onChange={descChange}
      ></textarea>
      <p></p>
      <button onClick={handleCreateGoal}>Create Goal</button>

      {showSubgoalsCheckbox && (
        <label>
          <input
            type="checkbox"
            onChange={() => setShowSubgoals(!showSubgoals)}
            checked={showSubgoals}
          />
          Show subgoals
        </label>
      )}

      {showSubgoals && (
        <div>
          <h3>Create Subgoals</h3>
          <p>Title:</p>
          <textarea
            id="textAreaTitle"
            rows="2"
            cols="50"
            placeholder="Subgoal Title"
            value={subgoalTitle}
            onChange={(e) => setSubgoalTitle(e.target.value)}
            className="enter-title"
          />

          <p>Date:</p>
          <input
            type="date"
            value={subgoalDate}
            onChange={(e) => setSubgoalDate(e.target.value)}
          />

          <p>Start Time:</p>
          <input
            type="time"
            value={subgoalStartTime}
            onChange={(e) => setSubgoalStartTime(e.target.value)}
          />

          <p>End Time:</p>
          <input
            type="time"
            value={subgoalEndTime}
            onChange={(e) => setSubgoalEndTime(e.target.value)}
          />

          <p>Description:</p>
          <textarea
            id="textAreaDescription"
            rows="5"
            cols="50"
            placeholder="Enter your subgoal description here..."
            onChange={(e) => setSubGoalDesc(e.target.value)}
          ></textarea>
          <p></p>
          <button onClick={handleCreateSubgoal}>Create Subgoal</button>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <div className="goalHolder">
        {goals.map((goal) => (
          <div key={goal.id} className="goal-container">
            <p>Goal Type: {selectedItem ? selectedItem.name : ''}</p>
            <h2>Title: {goal.title}</h2>
            <p>Date: {goal.date}</p>
            {goal.isSubgoal && (
              <>
                <p>Start Time: {goal.startTime}</p>
                <p>End Time: {goal.endTime}</p>
              </>
            )}
            <p>Description: {goal.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
  
export default GoalDisplay;