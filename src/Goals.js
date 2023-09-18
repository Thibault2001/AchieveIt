import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import GoalDisplay from './GoalDisplay'; // Import GoalDisplay
import './CSS files/Goal.css';

function Goal() {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const handleGoalClick = () => {
    setIsModalOpen(false);
  };

  const handleItemClick = (item) => {
    setSelectedGoal(item);
    setIsModalOpen(true); // Open the modal when a goal type is selected
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

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

  return (
    <div className="goal">
      <button onClick={openDropDown} className="goal-dropdown-list">
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
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="modal popup"
          style={customStyles} // Apply custom styles here
        >
          <GoalDisplay selectedItem={selectedGoal} closeModal={closeModal} /> {/* Use GoalDisplay */}
          <button onClick={closeModal}> Close </button>
        </Modal>
      </div>
    </div>
  );
}

export default Goal;
