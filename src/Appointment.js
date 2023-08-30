import React, { useState } from 'react'
import './CSS files/Appointment.css';
import Modal from 'react-modal';
    
    function Appointment() 
    {
        const[isModalOpen, setIsModalOpen] = useState(false);
        const[selectedItem, setSelectedItem] = useState(null);
        const[isDropdownOpen, setIsDropdownOpen] = useState(false);

    
        const handleItemClick = (item) =>
        {
            setSelectedItem(item);
            
            handleAppointmentClick();
            
        };

        const handleAppointmentClick = () =>
        {
                setIsModalOpen(true);
        };

        const closeModal = () =>
        {
            setIsModalOpen(false);
        };

        const confirmEvent = () =>
        {
            //When clicked take the information from text fields and enter into database.
        }

        const toggleDropdown = () =>
        {
            setIsDropdownOpen(!isDropdownOpen);
        };
    
        const items = [
            {id: 1, name: 'Appointment'},
            {id: 2, name: 'Sports'}
        ]

    return (
      <div className="appointment">
          <button onClick={toggleDropdown} className="appointment-toggle"> 
            Add Event
           </button>   
           
            
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
           <Modal
           isOpen={isModalOpen}
           onRequestClose={closeModal}
           contentLabel="Popup Modal"
           >
            <h1> Add {selectedItem ? selectedItem.name : ''} </h1>
            <p> {selectedItem ? selectedItem.name : ''} Title</p>
            <p> {selectedItem ? selectedItem.name : ''} Location </p>
            <p> Add text field </p>
            <p> {selectedItem ? selectedItem.name : ''} Date </p>
            <p> Add Date Selector </p>
            <p> {selectedItem ? selectedItem.name : ''} Time </p>
            <p> Add Time Selector </p>
            <p> {selectedItem ? selectedItem.name : ''} Duration </p>
            <p> Add Mins Selector </p>
            <button onClick={closeModal}> Close </button>
            <button onClick={confirmEvent}> Confirm Event </button>

           </Modal>
      </div>

    );
}

export default Appointment