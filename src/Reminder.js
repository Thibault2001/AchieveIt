import {useEffect} from 'react';
import { auth, db, ref, get } from './firebase';
import { toast } from 'react-toastify';
import {update} from 'firebase/database';
import { event } from 'jquery';

const Reminders = ({ onCheckReminders }) =>
{
        //Function to check reminders and display notifications
        const checkReminders = async () => 
        {
            console.log("Checking reminder");
            const user = auth.currentUser;
            if(user)
            {
                const userID = user.uid;
                const eventRef = ref(db, `calendar/${userID}/events`);
                try
                {
                    const snapshot = await get(eventRef);
                    const events = snapshot.val();
                    if(events)
                    {
                        const currentTime = new Date();

                        //Loops through all events to check + display reminders
                        Object.keys(events).forEach(async (eventID) => 
                            {
                                const eventData = events[eventID];
                                const {eventDate, eventTime, reminderTime, eventTitle, notificationSent } = eventData;

                                if(!notificationSent)
                                {
                                    if(eventData.reminderTime === 'at_event')
                                    {
                                        const eventDateTime = new Date(`${eventDate} ${eventTime}`);
                                        if(currentTime >= eventDateTime)
                                        {
                                            toast.info(`Reminder: ${eventTitle} on ${eventDate} at ${eventTime}`, { autoClose: 30000});

                                            const eventRefToUpdate = ref(db, `calendar/${userID}/events/${eventID}`);
                                            await update(eventRefToUpdate, {notificationSent: true});
                                            await new Promise(resolve => setTimeout(resolve, 1000));                                            
                                        }
                                    }
                                    else
                                    {
                                        const eventDateTime = new Date(`${eventDate} ${eventTime}`);
                                        const reminderDateTime = new Date(eventDateTime.getTime() - reminderTime * 60000);
    
                                        if(currentTime >= reminderDateTime) 
                                        {
                                            toast.info(`Reminder: ${eventTitle} on ${eventDate} at ${eventTime}`, { autoClose: 30000});
                                            
                                            const eventRefToUpdate = ref(db, `calendar/${userID}/events/${eventID}`);
                                            await update(eventRefToUpdate, {notificationSent: true});
                                            await new Promise(resolve => setTimeout(resolve, 1000));
                                        }    
                                    }
                                }  
                            });
                    }
                } catch (error)
                {
                    console.error("Error getting events: ", error);
                }
                
                };
        };
        // Effect to check reminders on component mount + scheduling the reminder check
        useEffect(() => 
        {
        checkReminders();

        const scheduleReminderCheck = () =>
        {
            checkReminders();
            setTimeout(scheduleReminderCheck, 60000);
        };

        scheduleReminderCheck();

    return () => clearTimeout(scheduleReminderCheck);
    }, []);

        //returns null as there is no UI to return
        return null;
};

export default Reminders;