import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import GoalDisplay from './GoalDisplay';
import './CSS_files/Goal.css';

function Goal() {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const handleItemClick = (item) => {
    setSelectedGoal(item);
    setIsModalOpen(true);
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

    document.addEventListener('click', handleClickOutside);

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

  const customStyles = {
    content: {
      width: '50%',
      height: '50%',
      margin: 'auto',
    },
  };

  return (
    <div className="goal">
      <button onClick={openDropDown} className="goal-dropdown-list standard-button">
        Add Goal
      </button>

      {isDropDownOpen && (
        <ul className="goal-types" style={{ zIndex: 9999}}>
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
          style={customStyles}
        >
          <GoalDisplay selectedItem={selectedGoal} closeModal={closeModal} />
          <button onClick={closeModal}>Close</button>
        </Modal>
      </div>
    </div>
  );
}

export default Goal;
