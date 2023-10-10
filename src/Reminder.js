import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal'
import EventDisplay from './EventDisplay';
import { getDatabase, ref, onValue } from 'firebase/database';

function Reminder ()
{
    const[isModalOpen, setIsModalOpen] = useState(false);
    const[selectedItem, setSelectedItem] = useState(null);
    const[isDropdownOpen, setIsDropdownOpen] = useState(false);
    const[eventTypes, setEventTypes] = useState([]);

    const handleItemClick = (item) =>
    {
        setSelectedItem(item);
    };

    useEffect(() =>
    {
        const db = getDatabase();
        const eventTypesRef = ref(db, 'eventTypes');

        onValue(eventTypesRef, (snapshot) =>
        {
            if(data)
            {
                const eventTypesArray = Object.values(data);
                setEventTypes(eventTypesArray);
            }
        });
    }, []);

    useEffect(() =>
    {
        if(selectedItem !== null)
        {
            handleAppointmentClick();
        }
    }, [selectedItem]);

    const handleAppointmentClick = () =>
    {
        if(selectedItem && selectedItem.name === 'New Event Type')
        {
            setIsModalOpen(true);
        }
        else
        {
            setIsModalOpen(true);

            toast.success('Event reminder has been set successfully!', {position: toast.POSITION.TOP_RIGHT});
        }
    };

    return (
        <div className='reminder'>
            <ToastContainer />

            <div className='modal-custom'>
                <Modal 
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    contentLabel="Popup Modal"
                >
                    <EventDisplay selectedItem={selectedItem} closeModal={() => setIsModalOpen(false)} />
                    <button className='closeButtom' onClick={() => setIsModalOpen(false)}> Close </button>
                </Modal>
            </div>
        </div>
    );

}

export default Reminder;