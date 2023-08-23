import React, { useState } from 'react'
import './CSS files/Appointment.css';
    
    function Appointment() 
    {
        const[isOpen, setIsOpen] = useState(false);   
        const[selectedItem, setSelectedItem] = useState(null);
    
        const toggleDropdown = () =>
        {
            setIsOpen(!isOpen);
        };

        const handleItemClick = (item) =>
        {
            setSelectedItem(item);
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
           {isOpen && (
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
      </div>

    );
}

export default Appointment