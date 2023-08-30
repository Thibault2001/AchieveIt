// This component represents the welcome page for a logged-in user. It displays a calendar
// with the current month's dates, allows navigation between months, and provides a section
// for displaying and adding goals for the user.

// Import necessary libraries and components
import React, { useState, useEffect, useNavigate } from 'react';
import { Button, Typography, Box, Grid, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Cookies from 'js-cookie';

// Define the WelcomeUser component
const WelcomeUser = () => {
  // Get navigation function from react-router-dom
  const navigate = useNavigate();

  // Check if user is logged in, otherwise navigate to login page
  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (!userCookie) {
      navigate('/login');
    }
  }, [navigate]);

  // State variables for managing date and calendar display
  const [currentDate, setCurrentDate] = useState(new Date());
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Function to handle month change
  const handleMonthChange = (change) => {
    setCurrentDate(prevDate => new Date(prevDate.setMonth(prevDate.getMonth() + change)));
  };

  // Render the WelcomeUser component
  return (
    <Box p={4}>
      <Typography variant="h4" fontSize={50} gutterBottom>
        Welcome, here is your day
      </Typography>

      <Grid container spacing={4} mt={10}>
        {/* Dates Section */}
        <Grid item xs={6}>
          <Typography variant="h5" gutterBottom style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button onClick={() => handleMonthChange(-1)}>&lt;</Button>
            {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
            <Button onClick={() => handleMonthChange(1)}>&gt;</Button>
          </Typography>

          {/* Day Headers */}
          <Box display="flex" mb={2}>
            {daysOfWeek.map(day => (
              <Box flexGrow={1} flexBasis="14.28%" textAlign="center" key={day}>
                <Typography>{day}</Typography>
              </Box>
            ))}
          </Box>

          {/* Dates */}
          <Box display="flex" flexWrap="wrap">
            {/* Render days from the previous month */}
            {Array.from({ length: adjustedFirstDay }).map((_, index) => (
              <Box flexGrow={1} flexBasis="14.28%" textAlign="center" key={"prevMonth-" + index}>
                <Button variant="outlined" style={{ margin: 'auto', width: '30px', height: '60px', lineHeight: '40px', borderRadius: '50%', color: 'lightgray' }}>
                  {daysInPrevMonth - adjustedFirstDay + index + 1}
                </Button>
              </Box>
            ))}
            
            {/* Render days of the current month */}
            {Array.from({ length: daysInMonth }).map((_, index) => (
              <Box flexGrow={1} flexBasis="14.28%" textAlign="center" key={"currentMonth-" + index}>
                <Button variant="outlined" style={{ margin: 'auto', width: '30px', height: '60px', lineHeight: '40px', borderRadius: '50%' }}>
                  {index + 1}
                </Button>
              </Box>
            ))}
            
            {/* Render days from the next month */}
            {Array.from({ length: (42 - daysInMonth - adjustedFirstDay) }).map((_, index) => (
              <Box flexGrow={1} flexBasis="14.28%" textAlign="center" key={"nextMonth-" + index}>
                <Button variant="outlined" style={{ margin: 'auto', width: '30px', height: '60px', lineHeight: '40px', borderRadius: '50%', color: 'lightgray' }}>
                  {index + 1}
                </Button>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Goals Section */}
        <Grid item xs={6} container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
          <Box>
            <Typography variant="h6" gutterBottom fontSize={50} mt={-50}>
              Goals
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography gutterBottom>
                Goal 1
              </Typography>
              <Typography gutterBottom>
                Goal 2
              </Typography>
              <Fab color="primary" aria-label="add" style={{ marginTop: 15 }}>
                <AddIcon />
              </Fab>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

// Export the WelcomeUser component
export default WelcomeUser;