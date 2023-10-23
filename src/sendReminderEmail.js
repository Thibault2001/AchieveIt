const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

const transporter = nodemailer.createTransport
({
    service: 'gmail',
    auth: 
    {
        user: 'noreply.achieveit@gmail.com',
        pass: '!achieveit1234',
    },
});

exports.sendReminderEmail = functions.database.ref(`/calendar/${userID}`).onWrite(async (change, context) =>
{
    const userID = context.params.userID;
    
    const userSnapshot = await admin.database().ref(`/users/${userID}`).once('value');
    const userEmail = userSnapshot.val().email;

    const eventData = change.after.val();
    const { eventTitle, eventDate, eventTime, eventType, eventDescription } = eventData;


    const mailOptions = 
    {
        from: 'noreply.achieveit@gmail.com',
        to: userEmail,
        subject: `Event Reminder: ${eventTitle}`,
        text: `This is a reminder for your event on ${eventDate} at ${eventTime}.\nEvent Title: ${eventTitle}
        \nEvent Type: ${eventType}\n Description: ${eventDescription}
        \n\nMake sure to log on to AchieveIt to never miss an event!`,
    };

    try 
    {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error)
    {
        console.error('Error sending email: ', error);
    }

        return null;
});