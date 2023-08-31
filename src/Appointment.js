import React, { useState } from 'react'
import './CSS files/Appointment.css';
import Modal from 'react-modal';
import EventDisplay from './EventDisplay'
    
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

        const toggleDropdown = () =>
        {
            setIsDropdownOpen(!isDropdownOpen);
        };
    
        const items = [
            {id: 1, name: 'Appointment'},
            {id: 2, name: 'Sports'},
            {id: 3, name: 'Birthday'}
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
            <EventDisplay selectedItem={selectedItem} closeModal={closeModal}/>
            <button onClick={closeModal}> Close </button>
          
           </Modal>
      </div>

    );
}

export default Appointment