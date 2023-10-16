import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db, ref, get, set, onValue } from './firebase';
import './CSS_files/AddNewEvent.css';

// This component handles the creation of a new event type using a modal.
const AddNewEvent = ({ isNewEventTypeModalOpen, setIsNewEventTypeModalOpen, addNewEventType }) => {
    const [customEventName, setCustomEventName] = useState('');
    const [colour, setColour] = useState('');
    const colourChange = (event) => {
        const newColour = event.target.value;
        setColour(newColour.substring(1));
      }
    const [selectedCustomEvents, setSelectedCustomEvents] = useState([]);
    const [userEventTypes, setUserEventTypes] = useState([]);

    useEffect(() =>
    {
        const user = auth.currentUser;
        if(user)
        {
            const userID = user.uid;
            const eventRef = ref(db, `calendar/${userID}/eventTypes`);

            onValue(eventRef, (snapshot) => 
            {
                const data = snapshot.val();
                if(data)
                {
                    const userEventTypesArray = Object.values(data);
                    setUserEventTypes(userEventTypesArray);
                }
                else
                {
                    setUserEventTypes([]);
                }
            });
        }
    }, []);


    useEffect(() => 
    {
        setSelectedCustomEvents(userEventTypes.map(event => event.name));
    }, [userEventTypes]);

    useEffect(() => 
    {
        setSelectedCustomEvents([]);
    }, []);
    
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

    const handleCustomEventCheckboxChange = (eventName) =>
    {
        setSelectedCustomEvents(prevSelected => 
            {
                if(prevSelected.includes(eventName))
                {
                    return prevSelected.filter(event => event !== eventName);
                }
                else
                {
                    return [...prevSelected, eventName];
                }
            });
    };

    const handleDeleteCustomEvents = () =>
    {  
        const userConfirmed = window.confirm('Are you sure you want to delete the selected custom events');
        
        if(userConfirmed)
        {

            
            const user = auth.currentUser;
            const userID = user.uid;

            const eventRef = ref(db, `calendar/${userID}/eventTypes`);
            get(eventRef).then((snapshot) =>
            {
                const existingEventTypes = snapshot.val() || [];
                
                const eventsToDelete = existingEventTypes.filter(event => selectedCustomEvents.includes(event.name));

                if(eventsToDelete.length === 0)
                {
                    toast.error('No custom events selected.');
                    return;
                }

                const updatedEventTypes = existingEventTypes.filter(event => !selectedCustomEvents.includes(event.name));

                set(eventRef, updatedEventTypes)
                    .then(() => 
                    {
                        toast.success('Deleted Event Types Successfully!');
                    })
                    .catch(() =>
                    {
                        toast.error('Failed to Delete Event Types...');
                    });
            })
    }
    }

    return (        
        <Modal 
            isOpen={isNewEventTypeModalOpen}
            onRequestClose={() => setIsNewEventTypeModalOpen(false)}
            contentLabel="New Event Type Modal"
        >
            <div>
                <ToastContainer autoClose={5000} />
            </div>
            <label className="left-align" htmlFor="customEventName"> New Event Type: <br/></label> 
            <input
                style={{float: 'left'}}
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

                <h2> Select Custom Event Types to Delete: </h2>
                {userEventTypes.length === 0 ? (
                    <p> No custom event types to delete! </p>
                ) : (
                    <div>
                        {userEventTypes.map(event => (
                            <div key={event.id}>
                                    <input 
                                        type="checkbox"
                                        id={event.id}
                                        checked={selectedCustomEvents.includes(event.name)}
                                        onChange={() => handleCustomEventCheckboxChange(event.name)}
                                    />
                                    <label htmlFor={event.id}>{event.name}</label>
                                </div>
                            ))}
                            <button onClick={handleDeleteCustomEvents}> Delete Custom Event Types </button>
                        </div>
                    )}
                </div>

            <button onClick={cancelCreateEventType}>Close</button>    
        </Modal>
    );
};

export default AddNewEvent;