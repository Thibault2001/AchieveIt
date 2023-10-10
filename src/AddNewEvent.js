import React, {useState} from "react";
import Modal from 'react-modal';

const AddNewEvent = ({ isNewEventTypeModalOpen, setIsNewEventTypeModalOpen, addNewEventType }) => 
{
    const[customEventName, setCustomEventName] = useState('');

    const confirmCreateEventType = () =>
        {
            if(customEventName.trim() !== '')  //Makes sure user enters a string
            {
                const confirmation = window.confirm(`Your new event type will be called: ${customEventName}`);
                if(confirmation) //If user clicks yes to confirm new event type
                {
                    // Add event type to the dropdown menu. Make sure new event type is at bottom. 
                   // toast.success('Added New Event Type!');

                    addNewEventType(customEventName.trim())
                    setCustomEventName('');
                    setIsNewEventTypeModalOpen(false);
                    console.log('test');
                }
            }
            else //If no input is entered and they click confirm
            {
                window.alert(`Please enter a name for your new event type!`);
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