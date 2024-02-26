import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Config
import authConfig from 'src/configs/auth'

const alertStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.9)', // Dark background
  color: '#fff', // White text color
  fontWeight: 'bold', // Bold text
  // Add more styling properties if needed
};

const getAccountID = () => {
  const userData = localStorage.getItem('userData');

  return userData ? JSON.parse(userData).UserID : null;
}

const state1_select_charger = forwardRef(({ onStepSubmit }, ref) => {

  const imageURL = authConfig.lormoonVideoFeedUrl;

  const [balance, setBalance] = useState(null);
  const [chargeCost, setChargeCost] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedChargerType, setSelectedChargerType] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [isFoundMotorcycle, setIsFoundMotorcycle] = useState(false);


  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const fetchPrepareInfo = async () => {
    try {
      const accountID = getAccountID();

      const response = await axios.get(authConfig.lormoonApiUrl + 'get_prepare_info', {
        params: { AccountID: accountID }
      });
      
      //console.log(response.data)

      if (response.data.IsCharging)
        onStepSubmit();

      setBalance(response.data.Balance);
      setChargeCost(response.data.ChargeCost);
    } catch (error) {
      console.error('Error fetching prepare info:', error);
    }
  };



  const fetchChargingStatusInfo = async () => {
    try {
      const response = await axios.get(authConfig.lormoonApiUrl + 'charging_status_info');
      const { IsFoundMotorcycle } = response.data;
      setIsFoundMotorcycle(IsFoundMotorcycle);
    } catch (error) {
      console.error('Error fetching charging status info:', error);
    }
  };

  useEffect(() => {
    fetchPrepareInfo();

    // ฟังก์ชั่นที่จะเรียกทุก 1 วินาที
    const intervalId = setInterval(() => {
      fetchChargingStatusInfo();
    }, 1000); // ตั้งค่าเวลาให้เป็น 1000 มิลลิวินาที (1 วินาที)

    // ฟังก์ชั่นทำความสะอาดที่จะเรียกเมื่อ component unmount
    return () => clearInterval(intervalId);

  }, []);

  const handleStartCharging = async (chargerType) => {
    if (balance < 5) {
      setSnackbarMessage('ยอดเงินคงเหลือไม่เพียงพอ กรุณาเติมเงิน');
      setSnackbarOpen(true);

      return;
    }
    setSelectedChargerType(chargerType);
    setOpenDialog(true);
  };
  

  const confirmStartCharging = async () => {
    try {
      const response = await axios.post(authConfig.lormoonApiUrl + 'start_charging', {
        chargerType: selectedChargerType,
        accountid: getAccountID()
      });
      setOpenDialog(false);
      onStepSubmit();
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  const handleTestClick = async () => {
    try {
        console.log("handle test click")
        if (Notification.permission === 'granted') {
          const notification = new Notification('Notification title333', {
            body: 'Notification body content 66666 <a href="http://www.google.com">google.com</a>',

            // คุณสามารถเพิ่ม options เพิ่มเติมได้ที่นี่
          });
        }
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  return (
    <Card>
      <CardContent style={{ cursor: 'pointer' }}>
        <CardMedia
          component="img"
          height="auto"
          image={imageURL}
          alt="Camera Stream"
        />
        <Box
          sx={{
            bottom: 10,
            left: 10,
            padding: '4px',
            backgroundColor: isFoundMotorcycle ? 'rgba(0, 128, 0, 0.9)' : 'rgba(255, 0, 0, 0.7)', // สีเขียวเข้มขึ้น
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon icon='eos-icons:ai' color="white" style={{ fontSize: '1.8rem' }} /> {/* ไอคอนสีขาวและขนาดใหญ่ขึ้น */}
          {isFoundMotorcycle ? (
            <Typography variant="body2" style={{ color: '#fff', marginLeft: '5px', fontSize: '1.1rem', fontWeight: 'bold' }}>
              ระบบตรวจจับรถหายทำงาน
            </Typography>
          ) : (
            <Typography variant="body2" style={{ color: '#fff', marginLeft: '5px', fontSize: '1.1rem', fontWeight: 'bold' }}>
              ระบบตรวจจับรถหายไม่ทำงาน
            </Typography>
          )}
        </Box>

      </CardContent>
      <CardContent>
              <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              padding: 2,
              border: '1px solid #3e9af1', // Add a border
              borderRadius: '3px', // Optional, for rounded corners
              boxShadow: '0px 2px 4px rgba(0,0,0,0.1)', // Optional, for a slight shadow
              margin: '0px' // Optional, for some outer space around the border
            }}
          >
          <Typography variant="h6" component="h2">
            ยอดเงินคงเหลือ {balance} บาท
          </Typography>
                  <Button
                  style={{ display: 'none' }}
          variant="contained"
          color="primary"
          startIcon={<Icon icon='tdesign:money'  />} // Ensure the icon is correctly imported or use a Material-UI icon
          onClick={() => {
            //console.log('เติมเงิน clicked');
            
            handleTestClick()

            // Implement your logic for "เติมเงิน" button click here
          }}
        >
          เติมเงิน
        </Button>

        </Box>
      </CardContent>

      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: 5,
            border: '1px solid #3e9af1',
            borderRadius: '4px',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            margin: '0px'
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon icon='material-symbols:ev-charger' />}
            sx={{ width: '48%', borderRadius: '4px' }} // Square buttons
            onClick={() => handleStartCharging('DC')}
          >
            เริ่มชาร์จ DC
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon icon='iconoir:ev-charge' />}
            sx={{ width: '48%', borderRadius: '4px' }} // Square buttons
            onClick={() => handleStartCharging('AC')}
          >
            เริ่มชาร์จ AC
          </Button>
        </Box>
        <Typography variant="subtitle1" component="p">
        ค่าบริการ {chargeCost} บาท/กิโลวัตต์
      </Typography>
      </CardContent>

      <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{"ยืนยันการเริ่มต้นชาร์จ"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          คุณได้ตรวจสอบสายชาร์จ และความพร้อมในการใช้งานเครื่องชาร์จเรียบร้อยแล้ว กรุณากดปุ่ม ยืนยัน เพื่อเริ่มต้นการชาร์จ
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)} color="primary">
          ยกเลิก
        </Button>
        <Button onClick={confirmStartCharging} color="primary" autoFocus>
          ยืนยัน
        </Button>
      </DialogActions>
    </Dialog>
          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert
          onClose={handleSnackbarClose}
          severity="warning"
          sx={{ width: '100%', ...alertStyle }} // Apply custom style
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>

    
  );
});

export default state1_select_charger
