import React, { useState, useEffect } from "react";
import { Modal, Typography, Button } from "@mui/material";
import "./CSS_files/EditEvent.css";
import { auth, ref, set, db } from "./firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GetColour } from "./Event.js";

const EditEvent = ({
    //take in values that have been passed in
    isOpen,
    title,
    type,
    date,
    time,
    reminderTime,
    desc,
    handleClose,
    userID,
    colour,
}) => {
    //make the new variables for the edited fields
    const [newTitle, setNewTitle] = useState(title);
    const [newDate, setNewDate] = useState(date);
    const [newDesc, setNewDesc] = useState(desc);
    const [newColour, setNewColour] = useState(colour);
    const [newTime, setNewTime] = useState(time);

    //set the new variables 
    useEffect(() => {
        setNewTitle(title);
        setNewDate(date);
        setNewDesc(desc);
        setNewColour(colour);
        setNewTime(time);
    }, [title, date, desc, colour, time]);

    //set the changing functions
    const titleChange = (event) => {
        setNewTitle(event.target.value);
    };

    const dateChange = (event) => {
        setNewDate(event.target.value);
    };

    const descChange = (event) => {
        setNewDesc(event.target.value);
    };

    const colourChange = (event) => {
        setNewColour(event.target.value.substring(1));
    };

    const timeChange = (event) => {
        setNewTime(event.target.value);
    };

    //update the database with the updated event, and clear the old event
    const updateEvent = () => {
        //path to where edited event will be saved
        const editedEventRef = ref(db, `calendar/${userID}/events/${newTitle}`);
        //path to original event (to clear)
        const oldEventRef = ref(db, `calendar/${userID}/events/${title}`);
        //construct new event with new variables
        const updatedEvent = {
            eventID: newTitle,
            eventTitle: newTitle,
            eventType: type,
            eventDate: newDate,
            eventTime: newTime,
            eventDescription: newDesc,
            reminderTime: reminderTime,
            colour: newColour,
        };

        //clear old event
        set(oldEventRef, null)
        //save new event
        set(editedEventRef, updatedEvent)
        //close modal
        handleClose()
    };

    return (
        //present modal
        <Modal open={isOpen} onClose={handleClose}>
            <div className="editModal">
                <Typography variant="h5">Edit Event</Typography>
                
                <p>Previous Title: {title}</p>
                <input
                    type="text"
                    className="newTitleText"
                    value={newTitle}
                    onChange={titleChange}
                />
                <br /><br /><br />

                <p>Previous Date: {date}</p>
                <input
                    type="date"
                    value={newDate}
                    onChange={dateChange}
                />
                <p>Previous Time: {time}</p>
                <input type="time" value={newTime} onChange={timeChange} />

                <p>Previous Description: {desc}</p>
                <input
                    type="text"
                    className="newDescText"
                    value={newDesc}
                    onChange={descChange}
                />
                <br /><br /><br />

                <p>Colour:</p>
                <input
                    type="color"
                    value={`#${newColour}`}
                    onChange={colourChange}
                />
                <br />
                <br />

                <Button variant="contained" onClick={handleClose} style={{ marginTop: 20 }}>
                    Close
                </Button>
                <Button className="editButton" variant="contained" onClick={updateEvent} style={{ marginTop: 20 }}>
                    Save Changes
                </Button>
            </div>
        </Modal>
    );
};

export { EditEvent };
