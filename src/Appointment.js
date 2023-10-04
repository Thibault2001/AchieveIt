import React, { useEffect, useState } from 'react'
import './CSS_files/Appointment.css';
import Modal from 'react-modal';
import EventDisplay from './EventDisplay' //Importing EventDisplay file
// import { toast } from 'react-toastify/dist';
// import 'react-toastify/dist/ReactToastify.css';

    
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
        const[isNewEventTypeModalOpen, setIsNewEventTypeModalOpen] = useState(false);
        const[customEventName, setCustomEventName] = useState('');

        //Function to handle the itemClick from the dropdown menu for where user chooses which event type to choose.
        const handleItemClick = (item) =>
        {
            setSelectedItem(item);
        };

        useEffect(() => 
        {
            if(selectedItem !== null)
            {
                handleAppointmentClick();
            }
        }, [selectedItem]);

        //Handles the Add Event click. It will turn the modal display on which prompts the user to enter their event details.
        const handleAppointmentClick = () =>
        {
            if(selectedItem && selectedItem.name === 'New Event Type')
            {
                setIsNewEventTypeModalOpen(true);
            }    
            else
            {
                setIsModalOpen(true);
            }

        };

        //When the close button is clicked it will close the modal.
        const closeModal = () =>
        {
            setIsModalOpen(false);
            setIsNewEventTypeModalOpen(false);
        };

        //Toggles the dropdown 
        const toggleDropdown = () =>
        {
            setIsDropdownOpen(!isDropdownOpen);
        };
     
        //Array of all the items for the dropdown menu
        const items = [
            {id: 1, name: 'Appointment'},
            {id: 2, name: 'Sports'},
            {id: 3, name: 'Birthday'},
            {id: 4, name: 'University'},
            {id: 5, name: 'New Event Type'}, //Adding the New Event Type option for the user.
        ];

        const confirmCreateEventType = () =>
        {
            if(selectedItem && selectedItem.name === 'New Event Type')
            {
                const confirmation = window.confirm(`Your new event type will be called: ${customEventName}`);
                if(confirmation)
                {
                    // Add event type to the dropdown menu. Make sure new event type is at bottom. 
                   // toast.success('Added New Event Type!');
                }
                setCustomEventName('');
                setIsNewEventTypeModalOpen(false);
            }
            else
            {
                setIsModalOpen(false);
            }
        }

        const cancelCreateEventType = () =>
        {
            setIsNewEventTypeModalOpen(false);
        }

    return (
      <div className="appointment">
           <button onClick={toggleDropdown} className="appointment-toggle"> {/*Button to toggle the dropdown menu */}
            Add Event
           </button>   
           
            {/* Dropdown menu */}  
            {isDropdownOpen && (
            <ul className="appointment-menu">
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
            <div className="modal-custom"> 
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    contentLabel="Popup Modal"
                >
                    <EventDisplay selectedItem={selectedItem} closeModal={closeModal}/> {/*Calls the EventDisplay*/}
                    <button class="closeButton" onClick={closeModal}> Close </button>
                </Modal>

                    {/* Modal to allow the user to create a new event type*/}
                <Modal 
                    isOpen={isNewEventTypeModalOpen}
                    onRequestClose={() => setIsNewEventTypeModalOpen(false)}
                    contentLabel="New Event Type Modal"
                >

                    <label htmlFor="customEventName"> New Event Type: </label> {/* Label for user to enter their event name*/}
                    <input
                        type="text"
                        id="customEventName" 
                        value={customEventName} 
                        onChange={(e) => setCustomEventName(e.target.value)}
                        /> {/* Saves their event name to above variable*/}
                        <button onClick={cancelCreateEventType}>Cancel</button> {/* Cancel and Confirm buttons with functions*/}
                        <button onClick={confirmCreateEventType}>Confirm</button>
                </Modal>
           </div>
      </div>

    );
}

export default Appointment