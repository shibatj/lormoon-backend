import jwtDecode from 'jwt-decode';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

// ** Config
import authConfig from 'src/configs/auth';

// ** Context
import { useAuth } from 'src/hooks/useAuth'

const CHECK_INTERVAL = 1000 * 60; // check every 1 minute
const WARNING_TIME = 1000 * 60;  // 1 minute

function TokenMonitoring() {
  const [timeLeft, setTimeLeft] = useState(null);

  const { logout } = useAuth()

  const mylogout = () => {

    //window.localStorage.removeItem(authConfig.storageTokenKeyName);
    //Router.push('/logout'); // assuming you have a logout route

    logout()
  };

  useEffect(() => {
    const checkToken = () => {
      const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

      if (!token) {
        logout();

        return;
      }

      const decodedToken = jwtDecode(token);
      const expiryDate = decodedToken.exp * 1000;

      const now = new Date();
      const timeDifference = expiryDate - now.getTime();

      if (timeDifference <= 0) {
        mylogout();

        return;
      }

      setTimeLeft(Math.round(timeDifference / 1000));
    };

    const interval = setInterval(checkToken, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [mylogout,logout]);

  useEffect(() => {
    let interval;
    if (timeLeft !== null && timeLeft <= 60) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0) {
      setTimeLeft(null);
    }

    return () => clearInterval(interval);
  }, [timeLeft]);



  return (
    <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
      {
        
        /*
      timeLeft !== null && timeLeft > 60 && (
        <Typography variant="body1">
          เวลาที่เหลือ: {Math.floor(timeLeft / 60)} นาที
        </Typography>
      )
      */

      }
      {timeLeft !== null && timeLeft <= 60 && (
        <>
          <Typography variant="body1" color="error" fontWeight="bold">
            เวลาที่เหลือ: {timeLeft} วินาที
          </Typography>
          <Typography variant="body1" color="error" fontWeight="bold">
            แจ้งเตือน! token จะหมดอายุในไม่ช้า ผู้ใช้งานจะต้อง login ใหม่อีกครัั้ง!
          </Typography>
        </>
      )}
    </Box>
  );
}

export default TokenMonitoring;
