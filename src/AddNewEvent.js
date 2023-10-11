import React, {useState} from "react";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, ref, set, db } from './firebase';
import eventTypes from "./eventTypes";

const user = auth.currentUser;
const userID = user ? user.uid : '';

const AddNewEvent = ({ isNewEventTypeModalOpen, setIsNewEventTypeModalOpen, addNewEventType }) => 
{
    const[customEventName, setCustomEventName] = useState('');

    const confirmCreateEventType = () =>
        {
            if(customEventName.trim() !== '')  //Makes sure user enters a string
            {
                const confirm = window.confirm(`Your event type will be called: ${customEventName}`);
                // console.log("1");
                
                if(confirm) //If user clicks yes to confirm new event type
                {
                

                    // Add event type to the dropdown menu. Make sure new event type is at bottom. 
                    console.log('Toast message should appear');

                   const eventRef = ref(db, `calendar/${userID}/eventTypes`);
                   set(eventRef, eventTypes)
                     .then(() => {
                       // Event added with success
                       //setIsEventAdded(true);
                       addNewEventType(customEventName.trim())
                       toast.success('Adding Event Successfully!');
                     })
                     .catch((error) => {
                       // Event not added
                       //setIsEventAdded(false);
                       toast.error('Failed to Add Event.');
                       console.error('Error adding event: ', error);
                     });
               


                   // addNewEventType(customEventName.trim())
                    setCustomEventName('');
                    setIsNewEventTypeModalOpen(false);
                    toast.success('Added New Event Type!');


                }
            }
            else //If no input is entered and they click confirm
            {
                window.alert(`Please enter a name for your new event type!`);
                console.log('error occurred...!')
            }
        };

    const cancelCreateEventType = () => 
    {
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