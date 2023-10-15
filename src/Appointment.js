import React, { useEffect, useState } from 'react';
import './CSS_files/Appointment.css';
import Modal from 'react-modal';
import CreateEvent from './EventCreate';
import { db, auth, ref, onValue, set, onAuthStateChanged } from './firebase';

function Appointment({ isNewEventTypeModalOpen, setIsNewEventTypeModalOpen }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [, setUserID] = useState(null);
  const [eventTypes] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userID = user.uid;
        setUserID(userID);
  
        // Accède à la base de données Firebase
        const eventsRef = ref(db, `calendar/${userID}/eventTypes`);
  
        // Écoute les modifications en temps réel
        onValue(eventsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const newEventTypesArray = Object.values(data);
            setNewEventTypes(newEventTypesArray);
          } else {
            setNewEventTypes([]);
          }
        });
      }
    });
  
    return () => unsubscribe(); // Nettoyez l'observateur lors du démontage du composant
  }, []);

  // Separate lists for existing and new event types
  const [existingEventTypes, setExistingEventTypes] = useState([]);
  const [newEventTypes, setNewEventTypes] = useState([]);

  // Function to handle the itemClick from the dropdown menu for where the user chooses which event type to select.
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  // Handles the Add Event click. It will display the modal, prompting the user to enter their event details.
  const handleAppointmentClick = () => {
    if (selectedItem && selectedItem.name === 'New Event Type') {
      setIsNewEventTypeModalOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  // When the close button is clicked, it will close the modal.
  const closeModal = () => {
    setIsModalOpen(false);
    setIsNewEventTypeModalOpen(false);
  };

  // Toggles the dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    // Construct the list of existing event types
    const existingTypes = [
      { id: 1, name: 'Appointment' },
      { id: 2, name: 'Sports' },
      { id: 3, name: 'Birthday' },
      { id: 4, name: 'University' },
    ];
    setExistingEventTypes(existingTypes);
  }, []);

  useEffect(() => {
    if (selectedItem !== null) {
      handleAppointmentClick();
    }
  }, [selectedItem]);

  const items = [
    ...existingEventTypes.map((eventType) => ({ id: eventType.id, name: eventType.name })),
    ...newEventTypes.map((eventType) => ({ id: eventType.id, name: eventType.name })),
  ];

  return (
    <div className="appointment">
      <button onClick={toggleDropdown} className="appointment-toggle">
        {/* Button to toggle the dropdown menu */}
        Add Event
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <ul className="appointment-menu">
          {items.map((item, index) => (
            <li
              key={index}
              className={selectedItem === item ? 'selected' : ''}
              onClick={() => handleItemClick(item)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}

      {/* Modal for displaying the selected event type, e.g., Sports */}
      <div className="modal-custom">
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Popup Modal"
        >
          <CreateEvent
            selectedItem={selectedItem}
            closeModal={closeModal}
            events={eventTypes} // Pass events to EventDisplay
          />
          <button className="closeButton" onClick={closeModal}>
            Close
          </button>
        </Modal>
      </div>
    </div>
  );
}

export default Appointment;