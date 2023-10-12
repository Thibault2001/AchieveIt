import React, { useState } from "react";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db, ref, get, set } from './firebase';

/* 
        The Appointment.js file has the dropdown menu that users will use in order to create an event.
        The button is called Add Event and when this button is clicked, it will set the variable
        setIsDropdownOpen to True. It is set to false by default and then can be turned on off by clicking 
        the button. There is an array of items that will be in the dropdown list. From the dropdown, users can select the event type that they like and once they click an
        event type, the React Modal will be set to true for which the user is prompted to enter the details 
        of their event. Inside of the Modal being called, the Event.js file is called. 
    */

// This component handles the creation of a new event type using a modal.
const AddNewEvent = ({ isNewEventTypeModalOpen, setIsNewEventTypeModalOpen, addNewEventType }) => {
    const [customEventName, setCustomEventName] = useState('');

    // Function to confirm and create a new event type.
    const confirmCreateEventType = () => {
        if (customEventName.trim() !== '') {
            const user = auth.currentUser;
            const userID = user.uid;

            if (user) {
                const eventRef = ref(db, `calendar/${userID}/eventTypes`);

                // Display a confirmation dialog to the user.
                const isConfirmed = window.confirm(`Your event type will be called: ${customEventName}`);
                
                if (isConfirmed) {
                    get(eventRef).then((snapshot) => {
                        let existingEventTypes = snapshot.val() || [];
                        existingEventTypes.push({ name: customEventName.trim() });

                        // Set the updated event types in the database.
                        set(eventRef, existingEventTypes)
                            .then(() => {
                                // Event added with success
                                addNewEventType(customEventName.trim());
                                setCustomEventName('');

                                // Show a success message after the user confirms.
                                toast.success('Adding Event Successfully!');
                            })
                            .catch((error) => {
                                // Event not added
                                toast.error('Failed to Add Event.');
                                console.error('Error adding event: ', error);
                            });
                    });
                }
            } else {
                // User is not authenticated
                toast.error('User is not authenticated.');
            }
        } else {
            // Empty customEventName
            toast.error('Please enter a name for your new event type!');
        }
    };

    // Function to cancel creating a new event type.
    const cancelCreateEventType = () => {
        setIsNewEventTypeModalOpen(false);
    };

    return (        
        <Modal 
            isOpen={isNewEventTypeModalOpen}
            onRequestClose={() => setIsNewEventTypeModalOpen(false)}
            contentLabel="New Event Type Modal"
        >
            <div>
                <ToastContainer autoClose={5000} />
            </div>
            <label htmlFor="customEventName"> New Event Type: </label> 
            <input
                type="text"
                id="customEventName" 
                value={customEventName} 
                onChange={(e) => setCustomEventName(e.target.value)}
            /> 
            <button onClick={cancelCreateEventType}>Cancel</button> 
            <button onClick={confirmCreateEventType}>Confirm</button>
        </Modal>
    );
};

export default AddNewEvent;