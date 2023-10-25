import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import GoalDisplay from './GoalDisplay'; // Import GoalDisplay
import './CSS_files/Goal.css';


/*
  The Goal function creates a button that allows users to click on to open a 
  dropdown menu that has different goal types. The dropdown of goal types is
  selectable for users to open a pop up modal where they can enter their goal 
  details and add the due dates for their goals. Goals cannot be set a past 
  or today's dates. Dates need to be future dates. If a past date is entered a 
  warning should appear to say that it needs to be set for the future. 
*/
function Goal({ isGoalModalOpen, toggleGoalModal }) {
  
  //Define state variables for modal, dropdown and select goal
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);


  //handles the itemClick on the dropdown
  const handleItemClick = (item) => {
    setSelectedGoal(item);
    toggleGoalModal(); 
  };

  //Closes the pop up modal
  const closeModal = () => {
    setIsModalOpen(false);
    toggleGoalModal();
  };

  //toggles the goal type dropdown
  const openDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  //allows the dropdown to close when the menu is not selected
  //dropdown can close if user selects anywhere else on the page
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropDownOpen && !event.target.classList.contains('goal-dropdown-list')) {
        setIsDropDownOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener('click', handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropDownOpen]);

  //array of goal types for the dropdown
  const goalTypes = [
    { id: 1, name: 'Long-Term Goal' },
    { id: 2, name: 'Short-Term Goal' },
    { id: 3, name: 'Financial Goal' },
    { id: 4, name: 'Career Goal' }
  ];

  // Custom styles for the Modal component
  const customStyles = {
    content: {
      width: '50%', // Set your desired width
      height: '50%', // Set your desired height
      margin: 'auto', // Center the modal horizontally
    },
  };

  //creates the goal function to be called in the welcome users page
  //brings all components and functions together for the user to use
  //button is placed and dropdown can be opened or closed. Modal opens 
  //when selected goal type is chosen. 
  return (
    <div className="goal">
      <button onClick={openDropDown} className="goal-dropdown-list standard-button">
        Add Goal
      </button>

      {isDropDownOpen && (
        <ul className="goal-types">
          {goalTypes.map((item) => (
            <li
              key={item.id}
              className={selectedGoal === item ? 'selected' : ''}
              onClick={() => handleItemClick(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
      <div className="modal">
        <Modal
         isOpen={isGoalModalOpen} // Use the prop here instead of local state
          onRequestClose={closeModal} // Handling closing the modal
          contentLabel="modal popup"
          style={customStyles}
        >
          <GoalDisplay selectedItem={selectedGoal} closeModal={closeModal} /> {/* Use GoalDisplay */}
          <button onClick={closeModal}> Close </button>
        </Modal>
      </div>
    </div>
  );
}

export default Goal;
