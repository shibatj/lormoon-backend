// ** React Imports
import { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios';

// ** MUI Components
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'; // Import the Button component
import { styled, useTheme } from '@mui/material/styles'
import DialogActions from '@mui/material/DialogActions';
import { Dialog, DialogContent, DialogContentText } from '@mui/material';


// ** Import QR Reader
import QrReader from 'react-qr-reader';

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAuth } from 'src/hooks/useAuth'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

const Logologin = styled('img')(({ theme }) => ({
  zIndex: 2,
  marginTop: theme.spacing(1),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

function LoginPage (){

  let firstTime=false;
 



  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const [loading, setLoading] = useState(false); // To control the dialog visibility
  const [error, setError] = useState(''); // To store the error message

  const simulateScan = () => {
    const predefinedToken = 'https://lormoon.nkstec.ac.th/login?token=GaXtScdknArpzmzRj3rPXNwl8AIIuBY4';
    handleScan(predefinedToken); // Call handleScan with the predefined token
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const token = urlParams.get('token');

    if (token) {
      // If a token is found in the query string, construct the URL and call handleScan
      firstTime=true;
      const urlWithToken = `https://lormoon.nkstec.ac.th/login?token=${token}`;
      handleScan(urlWithToken);
    }
  }, []);


  const handleScan = data => {
    if (data) {
      console.log('Result: ', data);
      setLoading(true); // Show the loading dialog

      auth.login({ username: data, password: 'url_login', rememberMe: true }, () => {
        // On login failure
        setError('Login failed'); // Update the error state with the error message
        setLoading(false); // Hide the loading dialog
      });


    }
  };
  

  const handleError = err => {
    if (!firstTime)
    {
      console.error(err);
      setError('QR Scan failed. Please try again.'); // Update the error state with the error message
    }
    firstTime=false;
    setLoading(false); // Hide the loading dialog
  };


  return (
    <RightWrapper>
      <Box
        sx={{
          bgcolor: 'white',
          p: [6, 12],
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            display: 'flex', // Use flexbox
            flexDirection: 'column', // Stack children vertically
            alignItems: 'center', // Center items horizontally
            justifyContent: 'center' // Center items vertically
          }}
        >
          <Logologin alt='login-ovecreport' src={`/images/wandeklogo.png`} width={'100%'} />
          <Box
            sx={{
              my: 6,
              textAlign: 'center' // Center text
            }}
          >
            <Typography variant='h3' sx={{ mb: 1.5 }}>
              {`${themeConfig.templateName}`}
            </Typography>
            <Typography sx={{ color: 'text.primary' }}>
              ฉายภาพไปยัง QR Code ที่บัตรเงินสดของท่านเพื่อเข้าสู่ระบบ
            </Typography>
          </Box>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <QrReader
              delay={300}
              onError={handleError}
              onScan={handleScan}
              style={{ width: '50%' }}
            />
          </div>
          <Typography
            sx={{
              mt: 2, // Add some margin to the top
              color: 'red',
              textAlign: 'center' // Center text
            }}
          >
            **กรณีที่ไม่มีภาพจากล้องปรากฎขึ้นจะต้องเปิดเว็บใหม่อีกครั้งและคลิ้ก Allow Camera**
          </Typography>
          <Button
            style={{ display: 'none' }}
            variant="contained"
            onClick={simulateScan}
            sx={{ mt: 2 }} // Add some margin to the top
          >
            Simulate QR Scan
        </Button>          

      </Box>
            <Dialog open={loading || error} onClose={() => { setLoading(false); setError(''); }}>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" sx={{ textAlign: 'center' }}>
            {loading && <Typography>กำลังตรวจสอบ...</Typography>}
            {error && <Typography color="error">{error}</Typography>}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Box>
    </RightWrapper>
  );
}
LoginPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
LoginPage.guestGuard = true

export default LoginPage
