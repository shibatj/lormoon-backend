import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InputLabel } from "@mui/material";
import {
  Card, CardHeader, CardContent, 
  TextField, Button, Grid, Dialog,
  DialogTitle, DialogContent, DialogContentText,
  DialogActions
} from '@mui/material';



import authConfig from 'src/configs/auth';
import { set } from 'nprogress';

const getUserID = () => {
  const userData = localStorage.getItem('userData');

  return userData ? JSON.parse(userData).UserID : null;
}

const getUserRole = () => {
  const userData = localStorage.getItem('userData');

  return userData ? JSON.parse(userData).Role : null;
}

export default function PinInfoForm() {
  const [pinInfo, setPinInfo] = useState({
    UserID: '', 
    PinName: '', 
    PinPicture: '', 
    ContactPerson: '', 
    ContactTel: '', 
    Latitude: '', 
    Longitude: '', 
    Activity: '',
    PlaceAddress: '',
    Province: '',
    OfficeName: ''

  });

  const [isExistingData, setIsExistingData] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const [showMessagePanel, setShowMessagePanel] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchPinInfo = async () => {
      try {
        const criteria = {UserID:getUserID()}; // แทนที่ด้วยค่าที่เหมาะสม
        const token = window.localStorage.getItem(authConfig.storageTokenKeyName); // หรือแหล่งเก็บ token ที่เหมาะสม
  
        const response = await axios.post('/api/pininfo_list', { token,criteria });
  
        if (response.data && response.data.length > 0) {
          setPinInfo(response.data[0]); // สมมติว่าข้อมูลของ pin อยู่ที่ index 0
          setIsExistingData(true);
        }
      } catch (error) {
        console.error('Error fetching pin info:', error);
      }
    };
  
    fetchPinInfo();
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  const handleInputChange = (e) => {
    setPinInfo({ ...pinInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!validate()) return; // ตรวจสอบความถูกต้องก่อนส่งข้อมูล

    setMessage(''); // เคลียร์ข้อความเก่า
  
    try {
      const mode = isExistingData ? 'update' : 'add';
      const token = window.localStorage.getItem(authConfig.storageTokenKeyName); // ดึง token จาก localStorage หรือแหล่งเก็บที่เหมาะสม
  
      pinInfo.UserID=getUserID();
      const response = await axios.post('/api/pininfo_mgmt', { token, mode, user_data: pinInfo });
  
      if (mode === 'add') {
        setPinInfo(response.data[0]); // อัปเดตค่า UserID ที่ได้จากการเพิ่มข้อมูล
      }

      setMessage('บันทึกข้อมูลเรียบร้อยแล้ว');
      setShowMessagePanel(true);

      const id = setTimeout(() => {
        setShowMessagePanel(false);
        setTimeoutId(null);
      }, 3000); // ข้อความจะหายไปหลัง 3 วินาที

      setTimeoutId(id);

      setIsExistingData(true);

      //console.log(response.data);

      // อาจจะต้องการอัปเดตสถานะหรือนำเสนอข้อมูลในรูปแบบอื่น
    } catch (error) {
      setMessage('Error submitting form: ' + error.message);
      console.error('Error submitting form:', error);
    }
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.PinName = pinInfo.PinName ? "" : "กรุณาป้อนข้อมูลชื่อสถานที่จัดงาน";
    tempErrors.PlaceAddress = pinInfo.PlaceAddress ? "" : "กรุณาป้อนข้อมูลที่อยู่";
    tempErrors.ContactPerson = pinInfo.ContactPerson ? "" : "กรุณาป้อนข้อมูลชื่อผู้ติดต่อประสานงาน";
    tempErrors.ContactTel = pinInfo.ContactTel ? "" : "กรุณาป้อนข้อมูลโทรศัพท์ผู้ติดต่อประสานงาน";
    tempErrors.Latitude = pinInfo.Latitude ? "" : "กรุณาป้อนข้อมูลพิกัดละติจูด";
    tempErrors.Longitude = pinInfo.Longitude ? "" : "กรุณาป้อนข้อมูลพิกัดลองจิจูด";
    tempErrors.Activity = pinInfo.Activity ? "" : "กรุณาป้อนข้อมูลกิจกรรมในวันเด็ก";
    tempErrors.Province = pinInfo.Province ? "" : "กรุณาป้อนข้อมูลจังหวัด";
    tempErrors.OfficeName = pinInfo.OfficeName ? "" : "กรุณาป้อนข้อมูลชื่อหน่วยงานหรือชื่อผู้ที่จัดกิจกรรม";
    
    // เพิ่มการตรวจสอบความถูกต้องสำหรับฟิลด์อื่นๆ ตามที่ต้องการ
  
    setErrors(tempErrors);

    return Object.values(tempErrors).every(x => x === "");
  }

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${pinInfo.Latitude},${pinInfo.Longitude}`;
    window.open(url, '_blank');
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleConfirmDelete = async () =>  {


    try {
      const response = await axios.post('/api/pininfo_mgmt', {
        token: window.localStorage.getItem(authConfig.storageTokenKeyName),
        mode: 'delete',
        user_data: pinInfo,
      });


     // โค้ดเพื่อเรียก API สำหรับลบข้อมูล
      handleCloseDialog();

        // รีเฟรชหน้าจอ
      window.location.reload();
    } catch (error) {
      console.error(error);
    }


    // แสดงข้อความหรือจัดการการตอบกลับจาก API ตามที่ต้องการ
  };  
  

  return (
    <Card>
      <CardHeader title='ข้อมูลพิกัดการจัดกิจกรรมในวันเด็ก' />
      <CardContent>
        <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
        <Grid item xs={12}>
        <InputLabel>ชื่อสถานที่จัดงาน</InputLabel>
          <TextField
            name='PinName'
            fullWidth
            value={pinInfo.PinName}
            onChange={handleInputChange}
            error={!!errors.PinName}
            helperText={errors.PinName || ''}
          />
        </Grid>
        <Grid item xs={12}  container spacing={2}>
          <Grid item xs={6}>
          <InputLabel>ชื่อหน่วยงานหรือชื่อผู้ที่จัดกิจกรรม</InputLabel>
            <TextField
              name='OfficeName'
              fullWidth
              value={pinInfo.OfficeName}
              onChange={handleInputChange}
              error={!!errors.OfficeName}
              helperText={errors.OfficeName || ''}
            />
          </Grid>
          <Grid item xs={6}>
          <InputLabel>จังหวัด</InputLabel>
            <TextField
              name='Province'
              fullWidth
              value={pinInfo.Province}
              onChange={handleInputChange}
              error={!!errors.OfficeName}
              helperText={errors.OfficeName || ''}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
        <InputLabel>ทีอยู่</InputLabel>
          <TextField
            name='PlaceAddress'
            fullWidth
            rows={4}
            value={pinInfo.PlaceAddress}
            onChange={handleInputChange}
            error={!!errors.PlaceAddress}
            helperText={errors.PlaceAddress || ''}
          />
        </Grid>
        <Grid item xs={12}>
        <InputLabel>กิจกรรมที่จัดในวันเด็ก</InputLabel>
          <TextField
            name='Activity'
            fullWidth
            multiline
            rows={4}
            value={pinInfo.Activity}
            onChange={handleInputChange}
            error={!!errors.Activity}
            helperText={errors.Activity || ''}
          />
        </Grid>        
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={6}>
          <InputLabel>ชื่อผู้ติดต่อประสานงาน</InputLabel>
            <TextField
              name='ContactPerson'
              fullWidth
              value={pinInfo.ContactPerson}
              onChange={handleInputChange}
              error={!!errors.ContactPerson}
              helperText={errors.ContactPerson || ''}
            />
          </Grid>

          <Grid item xs={6}>
          <InputLabel>โทรศัพท์ผู้ติดต่อประสานงาน</InputLabel>
            <TextField
              name='ContactTel'
              fullWidth
              value={pinInfo.ContactTel}
              onChange={handleInputChange}
              error={!!errors.ContactTel}
              helperText={errors.ContactTel || ''}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={6}>
          <InputLabel>ละติจูด</InputLabel>
            <TextField
              name='Latitude'
              type='number'
              fullWidth
              value={pinInfo.Latitude}
              onChange={handleInputChange}
              error={!!errors.Latitude}
              helperText={errors.Latitude || ''}
            />
          </Grid>

          <Grid item xs={6}>
          <InputLabel>ลองจิจูด</InputLabel>
            <TextField
              name='Longitude'
              type='number'
              fullWidth
              value={pinInfo.Longitude}
              onChange={handleInputChange}
              error={!!errors.Longitude}
              helperText={errors.Longitude || ''}
            />
          </Grid>
        </Grid>


                    <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

              <div>
                <Button type='submit' variant='contained' color='primary'>
                  บันทึกข้อมูล
                </Button>
                {isExistingData && (
                  <>
                    <Button variant='contained' color='secondary' onClick={openInGoogleMaps} style={{ marginLeft: '10px' }}>
                      เปิดแผนที่
                    </Button>
                  </>
                )}
              </div>          
              {showMessagePanel && (
                <div 
                  style={{ 
                    marginTop: '10px', 
                    fontSize: '1.5rem', // กำหนดขนาดตัวอักษร
                    fontWeight: 'bold', // ทำให้ตัวอักษรหนาขึ้น
                    color: 'red', // คุณสามารถเปลี่ยนสีตัวอักษรได้
                    padding: '10px', // เพิ่มพื้นที่รอบข้อความ
                    backgroundColor: '#ffffff', // เพิ่มพื้นหลังสำหรับข้อความ
                    borderRadius: '5px', // มนมุมของพื้นหลัง
                    textAlign: 'center' // จัดให้ข้อความอยู่ตรงกลาง
                  }}
                >
                  {message}
                </div>
              )}                  
              <div style={{ flexGrow: 1 }}></div> {/* เพิ่ม div ว่างเพื่อผลักปุ่มไปทางขวา */}
              <div>
                {isExistingData && (
                  <>
                    <Button variant="outlined" color="secondary" onClick={handleOpenDialog} style={{ marginLeft: '10px' }}>
                      ยกเลิกข้อมูลพิกัดในแผนที่
                    </Button>
                  </>
                )}
              </div>
            </Grid>

      </Grid>
        </form>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{"ยืนยันการลบข้อมูล"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ข้อมูลที่ได้บันทึกไว้ทั้งหมดจะถูกลบ คุณแน่ใจใช่หรือไม่?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              ไม่ใช่
            </Button>
            <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
              ใช่, ลบข้อมูล
            </Button>
          </DialogActions>
        </Dialog>        
      </CardContent>
    </Card>
  );
}
