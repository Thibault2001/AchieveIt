import React, { useState } from "react";
import { Modal, Typography, Button } from "@mui/material";
import "./CSS_files/EditEvent.css"
import { auth, ref, set, db, get } from './firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetColour } from './Event.js';

const EditEvent = ({
    isOpen,
    title,
    type,
    date,
    time,
    reminderTime,
    desc,
    handleClose,
    userID,
    colour
}) => {
    console.log(title, type, date, time, reminderTime, desc, isOpen, colour)

    const [newTitle, setTitle] = (useState(title))
    const [newDate, setDate] = useState(date);
    const [newDesc, setDesc] = useState(desc);
    const [newColour, setColour] = useState(colour);
    const [newTime, setTime] = useState(time);

    const titleChange = (event) => {
        setTitle(event.target.value);
    };

    const dateChange = (event) => {
        setDate(event.target.value);
    };

    const descChange = (event) => {
        setDesc(event.target.value);
    };

    const colourChange = (event) => {
        const newColour = (event.target.value)
        setColour(newColour.substring(1))
    }

    const timeChange = (event) => {
        setTime(event.target.value);
    };

    const editedEvent = {
        eventID: newTitle,
        eventTitle: newTitle,
        eventType: type,
        eventDate: newDate,
        eventTime: newTime,
        eventDescription: newDesc,
        reminderTime: reminderTime,
        colour: newColour
    };

    const updateEvent = () => {
        const eventRef = ref(db, `calendar/${userID}/events/${title}`);
        console.log({ editedEvent })
        set(eventRef, null)
        const newEventRef = ref(db, `calendar/${userID}/events/${newTitle}`);
        set(newEventRef, editedEvent)
            .then(() => {
                // toast.success('Edited Event!');
            })
            .catch((error) => {
                // toast.error('Failed to edit event.');
                // console.error('Error editing event: ', error);
            });
        handleClose();
    }
    return (

        <Modal open={isOpen} onClose={handleClose}>
            <div className="editModal" >
                <Typography variant="h5">Edit Event</Typography>
                <p>Previous Title: {title}</p>
                <input type="text"
                    className="newTitleText"
                    placeholder={title}
                    onChange={titleChange}
                ></input>
                <br /><br /><br />
                <p>Previous Date: {date}</p>
                <input type="date"
                    value={date}
                    placeholder={date}
                    onChange={dateChange}></input>
                <p>Previous Time: {time}</p>
                <input type="time"
                    onChange={timeChange}></input>

                <p>Previous Description: {desc}</p>
                <input type="text"
                    className="newDescText"
                    placeholder={desc}
                    onChange={descChange}
                ></input>
                <br /><br /><br />

                <p>Colour:</p>
                <input type="color"
                    onChange={colourChange}>
                </input>
                <br /><br />

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
