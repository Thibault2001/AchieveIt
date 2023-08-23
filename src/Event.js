import { useState } from "react";

function Event({ title, type, date, description }) {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className="event" style={{backgroundColor: GetColour(type)}}>
            <h2>{title}</h2>
            <h3>{date}</h3>
            <h4>{type}</h4>
            <p>{description}</p>
        </div>
    );
}

function GetColour(type) {
    switch (type) {
        case "University":
            return "#ffaa00c7"
        case "Sports":
            return "#13bb0ac7"
        case "Birthday":
            return "#0ab5bbc7"
        default:
            return "#6200ffc7"
    }
}

export default Event
