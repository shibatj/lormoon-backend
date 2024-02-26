import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress'

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import axios from 'axios';

import  { forwardRef, useImperativeHandle } from 'react';

import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Config
import authConfig from 'src/configs/auth'

const CircularProgressDeterminate = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.customColors.trackBg
}))

const CircularProgressIndeterminate = styled(CircularProgress)(({ theme }) => ({
  left: 0,
  position: 'absolute',
  animationDuration: '550ms',
  color: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
}))

const Progress = props => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>

      <CircularProgressDeterminate variant='determinate' size={120} thickness={5} value={100} />

      <CircularProgressIndeterminate variant='indeterminate' disableShrink size={120} thickness={5} />
      <Box
        sx={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          position: 'absolute',
          flexDirection:'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography variant='caption' component='div' color='text.secondary'>
        {`${props.value.toFixed(4)} `}
        </Typography>
        <Typography variant='caption' component='div' color='text.secondary'
            sx={{
              marginTop: 2,
              marginBottom:2
            }}        
        >
         กิโลวัตต์
        </Typography>
      </Box>
    </Box>
  )
}

const getAccountID = () => {
  const userData = localStorage.getItem('userData');

  return userData ? JSON.parse(userData).UserID : null;
}

const state2_charging = forwardRef(({ onStepSubmit }, ref) => {

  const imageURL = authConfig.lormoonVideoFeedUrl;

  const [chargeDuration, setChargeDuration] = useState(0);
  const [moneyUsed, setMoneyUsed] = useState(0.00);
  const [moneyRemained, setMoneyRemained] = useState(0.00);
  const [chargeKw, setChargeKw] = useState(0.00);
  const [chargeType, setChargeType] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [isFoundMotorcycle, setIsFoundMotorcycle] = useState(false);


  const fetchChargingStatus = async () => {
    try {
      const response = await axios.get(authConfig.lormoonApiUrl + 'charging_status_info', {
        params: { AccountID: getAccountID() }
      });
      const data = response.data;

      //console.log(data)

      setChargeDuration(data.ChargeDuration);
      setMoneyUsed(parseFloat(data.MoneyUsed) || 0.00);
      setMoneyRemained(parseFloat(data.MoneyRemained) || 0.00); // Add this if you have a state for MoneyRemained
      setChargeKw(parseFloat(data.ChargeKw) || 0.00);
      setChargeType(data.ChargeType);
      setIsFoundMotorcycle(data.IsFoundMotorcycle);

      if (data.IsEnd)
        onStepSubmit();

    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

    // Polling the API every second
    useEffect(() => {
      const interval = setInterval(() => {
        fetchChargingStatus();
      }, 1000);
      
      return () => clearInterval(interval);
    }, []);

    const handleDialogOpen = () => {
      setOpenDialog(true);
    };
    
    const handleDialogClose = () => {
      setOpenDialog(false);
    };

  const handleStopCharging = async () => {
    try {
      const response = await axios.post(authConfig.lormoonApiUrl+ 'stop_charging', {
      });
      onStepSubmit()

    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };  

  const hours = Math.floor(chargeDuration / 3600);
  const minutes = Math.floor((chargeDuration % 3600) / 60);
  const seconds = Math.floor(chargeDuration % 60);

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
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: 2,
            margin: '0px'
          }}
        >
          <Typography variant="h6" component="h2" 
            sx={{
              marginTop: 0,
              marginBottom:2
            }}
          >
            กำลังชาร์จ {chargeType} {/* แสดงข้อความ AC/DC ตาม ChargeType */}
          </Typography>            
          <Typography variant="h6" component="h2" sx={{
              marginTop: 1,
              marginBottom:4
            }}>
          ระยะเวลาชาร์จ {hours} ชั่วโมง {minutes} นาที {seconds} วินาที
          </Typography>        
            <Progress value={chargeKw} />
            <Typography variant="h6" component="h2" sx={{
              marginTop: 3,
              marginBottom:1
            }}>
            ค่าบริการ {moneyUsed ? moneyUsed.toFixed(2) : '0.00'} บาท
            </Typography>      
            <Typography variant="h6" component="h2" sx={{
              marginTop: 0,
              marginBottom:1
            }}>
            เงินคงเหลือ {moneyRemained ? moneyRemained.toFixed(2) : '0.00'} บาท
            </Typography>    
        </Box>
      </CardContent>

      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: 0,
            margin: '0px'
          }}
        >
        <Button
            variant="contained"
            color="primary"
            startIcon={<Icon icon='fa6-regular:circle-stop' />}
            sx={{ width: '95%', borderRadius: '4px' }} // Square buttons
            onClick={handleDialogOpen}
          >
            หยุดการชาร์จ
          </Button>
        </Box>
      </CardContent>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"ยืนยันการหยุดการชาร์จ"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            คุณแน่ใจหรือไม่ว่าต้องการหยุดการชาร์จ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            ยกเลิก
          </Button>
          <Button onClick={() => {
            handleDialogClose();
            handleStopCharging();
          }} color="primary" autoFocus>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>

    </Card>
  );
});

export default state2_charging
