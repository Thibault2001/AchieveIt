import React, { useState } from "react";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db, ref, get, set } from './firebase';

// This component handles the creation of a new event type using a modal.
const AddNewEvent = ({ isNewEventTypeModalOpen, setIsNewEventTypeModalOpen, addNewEventType }) => {
    const [customEventName, setCustomEventName] = useState('');
    const [colour, setColour] = useState('');
    const colourChange = (event) => {
        const newColour = event.target.value;
        setColour(newColour.substring(1));
      }

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
                        existingEventTypes.push({ name: customEventName.trim(), colour });

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
            <p>Choose a color for your event type:</p>
            <input
              type="color"
              id="colourPick"
              onChange={colourChange}
            />
            <br />
            <button onClick={cancelCreateEventType}>Close</button> 
            <button onClick={confirmCreateEventType}>Confirm</button>
        </Modal>
    );
};

export default AddNewEvent;