import React, { useState } from 'react';
import { Button, Typography, Box, Grid, Select, MenuItem } from '@mui/material';
import Appointment from './Appointment'

const WelcomeUser = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const handleMonthChange = (change) => {
        const newMonth = currentDate.getMonth() + change;
        if (newMonth === -1) { // It's January and we're going to previous month
            setCurrentDate(prevDate => new Date(prevDate.getFullYear() - 1, 11, 1));
        } else if (newMonth === 12) { // It's December and we're going to next month
            setCurrentDate(prevDate => new Date(prevDate.getFullYear() + 1, 0, 1));
        } else {
            setCurrentDate(prevDate => new Date(prevDate.setMonth(newMonth)));
        }
    };

    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 10;
    const years = Array.from({ length: 21 }, (_, index) => startYear + index);
    const months = Array.from({ length: 12 }, (_, index) => new Date(2000, index).toLocaleString('default', { month: 'long' }));

    return (

        
        <Box p={4}>
            <Typography variant="h4" fontSize={50} gutterBottom>
                Welcome, here is your day
            </Typography>

             <Appointment /> {/* Calls the dropdown of the event creation method. */}

            <Grid container spacing={4} mt={10} justifyContent="center" alignItems="center" style={{ height: '80vh' }}>
                {/* Dates Section */}
                <Grid item xs={6}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Button onClick={() => handleMonthChange(-1)}>&lt;</Button>
                        <Select
                            value={currentDate.getMonth()}
                            onChange={(e) => setCurrentDate(new Date(currentDate.setMonth(e.target.value)))}
                        >
                            {months.map((month, index) => (
                                <MenuItem key={month} value={index}>
                                    {month}
                                </MenuItem>
                            ))}
                        </Select>
                        <Select
                            value={currentDate.getFullYear()}
                            onChange={(e) => setCurrentDate(new Date(currentDate.setFullYear(e.target.value)))}
                        >
                            {years.map(year => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                        <Button onClick={() => handleMonthChange(1)}>&gt;</Button>
                    </Box>

                    {/* Day Headers */}
                    <Box display="flex" mb={2}>
                        {daysOfWeek.map(day => (
                            <Box flexGrow={1} flexBasis="14.28%" textAlign="center" key={day}>
                                <Typography>{day}</Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Dates */}
                    <Box display="flex" flexWrap="wrap" justifyContent="center">
                        {/* Render days from the previous month */}
                        {Array.from({ length: adjustedFirstDay }).map((_, index) => (
                            <Box flexGrow={1} flexBasis="14.28%" textAlign="center" key={"prevMonth-" + index}>
                                <Button variant="outlined" style={{ margin: '5px', width: '70px', height: '70px', lineHeight: '50px', borderRadius: '50%', color: 'lightgray' }}>
                                    {daysInPrevMonth - adjustedFirstDay + index + 1}
                                </Button>
                            </Box>
                        ))}

                        {/* Render days of the current month */}
                        {Array.from({ length: daysInMonth }).map((_, index) => (
                            <Box flexGrow={1} flexBasis="14.28%" textAlign="center" key={"currentMonth-" + index}>
                                <Button variant="outlined" style={{ margin: '5px', width: '70px', height: '70px', lineHeight: '50px', borderRadius: '50%' }}>
                                    {index + 1}
                                </Button>
                            </Box>
                        ))}

                        {/* Render days from the next month */}
                        {Array.from({ length: (42 - daysInMonth - adjustedFirstDay) }).map((_, index) => (
                            <Box flexGrow={1} flexBasis="14.28%" textAlign="center" key={"nextMonth-" + index}>
                                <Button variant="outlined" style={{ margin: '5px', width: '70px', height: '70px', lineHeight: '50px', borderRadius: '50%', color: 'lightgray' }}>
                                    {index + 1}
                                </Button>
                            </Box>
                        ))}
                    </Box>
                </Grid>
            </Grid>
        </Box>

        
    );
}

export default WelcomeUser;
