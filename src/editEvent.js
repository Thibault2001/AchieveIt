import React from "react";
import { Modal, Typography, Button } from "@mui/material";

const EditEvent = ({
  isOpen,
  title,
  type,
  date,
  time,
  reminderTime,
  desc,
  handleClose,
}) => {
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "80%", maxWidth: 400, backgroundColor: "#fff", padding: 20, borderRadius: 8 }}>
        <Typography variant="h5">Edit Event</Typography>
        <p>Title: {title}</p>
        <p>Type: {type}</p>
        <p>Date: {date}</p>
        <p>Time: {time}</p>
        <p>Reminder Time: {reminderTime}</p>
        <p>Description: {desc}</p>
        <Button variant="contained" onClick={handleClose} style={{ marginTop: 20 }}>
          Close
        </Button>
      </div>
    </Modal>
  );
};

export {EditEvent};
