import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // if you're using react-router v6
import { auth } from './firebase'; // make sure the path is correct for your Firebase setup
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useAutoLogout = (inactivityTime, isLoggedIn) => {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isLoggedIn) {
      const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];

      const resetTimer = () => {
        if (timer) {
          clearTimeout(timer);
        }

        timer = setTimeout(() => {

          toast.warning('You have been logged out due to inactivity');


          // Perform the actual logout
          auth.signOut().then(() => {
            // Delete all the cookies
            Object.keys(Cookies.get()).forEach((cookieName) => {
              Cookies.remove(cookieName);
            });

            // Redirect the user to the login page after logout
            navigate('/login');
          }).catch((error) => {
            // handle errors here
            console.error('Failed to log out', error);
          });
        }, inactivityTime);
      };

      // Register the event listeners that reset the inactivity timer
      for (let i in events) {
        window.addEventListener(events[i], resetTimer, { passive: true });
      }

      // Initialize the timer for the first time
      resetTimer();

      // Cleanup event listeners and timer on component unmount or when the user logs out
      return () => {
        for (let i in events) {
          window.removeEventListener(events[i], resetTimer, { passive: true });
        }

        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, [inactivityTime, isLoggedIn, navigate]); // Dependency array

  // In case there are any other effects or returns, they would go here
};

export default useAutoLogout;
