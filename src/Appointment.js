import React, { useState, useEffect } from 'react'
import './CSS_files/Appointment.css';
import Modal from 'react-modal';
import EventDisplay from './EventDisplay' //Importing EventDisplay file
import'./CSS_files/Goal.css';

    /* 
        The Appointment.js file has the dropdown menu that users will use in order to create an event.
        The button is called Add Event and when this button is clicked, it will set the variable
        setIsDropdownOpen to True. It is set to false by default and then can be turned on off by clicking 
        the button. There is an array of items that will be in the dropdown list. From the dropdown, users can select the event type that they like and once they click an
        event type, the React Modal will be set to true for which the user is prompted to enter the details 
        of their event. Inside of the Modal being called, the Event.js file is called. 
    */

    function Appointment() 
    { //Defining state variables using the useState hook
        const[isModalOpen, setIsModalOpen] = useState(false);
        const[selectedItem, setSelectedItem] = useState(null);
        const[isDropdownOpen, setIsDropdownOpen] = useState(false);

        //Function to handle the itemClick from the dropdown menu for where user chooses which event type to choose.
        const handleItemClick = (item) =>
        {
            setSelectedItem(item);
            setIsModalOpen(true);
        };

        //When the close button is clicked it will close the modal.
        const closeModal= () => {
            setIsModalOpen(false);
        };

        //Toggles the dropdown 
        const toggleDropdown = () => {
            setIsDropdownOpen(!isDropdownOpen);
        };

        useEffect(() => {
            const handleClickOutside = (event) => {
              if (isDropdownOpen && !event.target.classList.contains('goal-dropdown-list')) {
                setIsDropdownOpen(false);
              }
            };

            document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isDropdownOpen]);

        //Array of all the items for the dropdown menu
        const items = [
            {id: 1, name: 'Appointment'},
            {id: 2, name: 'Sports'},
            {id: 3, name: 'Birthday'},
            {id: 4, name: 'University'}
        ];

    return (
      <div className="goal">
           <button onClick={toggleDropdown} className="goal-dropdown-list standard-button"> {/*Button to toggle the dropdown menu */}
            Add Event
           </button>   
           
            {/* Dropdown menu */}  
            {isDropdownOpen && (
            <ul className="goal-types" style={{ zIndex: 9999}}>
                {items.map((item) => (
                    <li
                    key={item.id}
                    className={selectedItem === item ? 'selected' : ''}
                    onClick={() => handleItemClick(item)}
                    >
                       {item.name} 
                    </li>
                    
                ))}
            </ul>
            )}
            {/* Modal for displaying the selected event type, e.g. Sports */}
            <div className="modal"> 
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="modal popup"
                >
                    <EventDisplay selectedItem={selectedItem} closeModal={closeModal}/> {/*Calls the EventDisplay*/}
                    <button  onClick={closeModal}> Close </button>
                </Modal>
           </div>
      </div>

    );
}

export default Appointment;