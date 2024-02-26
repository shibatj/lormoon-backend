import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Select, MenuItem } from "@mui/material";
import axios from 'axios';
import { InputLabel } from "@mui/material";
import { Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';

// ** Config
import authConfig from 'src/configs/auth'

const CustomSnackbar = styled(Snackbar)({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 1400,
});

const CustomAlert = styled(Alert)({
  backgroundColor: 'white',
  border: '1px solid grey', // Add this line to create a border
  borderRadius: '4px', // Add this line to create a border radius
  width: 'fit-content',
});
  

const getUserID = () => {
  const userData = localStorage.getItem('userData');

  return userData ? JSON.parse(userData).UserID : null;
}

const getUserRole = () => {
  const userData = localStorage.getItem('userData');

  return userData ? JSON.parse(userData).Role : null;
}

const getUserData = () => {
  const userData = localStorage.getItem('userData');

  return userData? JSON.parse(userData):null;
}

export default function PinList() {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [filter, setFilter] = useState({
    PinName: "",
    ContactPerson: "",
    Province: "",
    DepartmentID: "all",
  });

  const [open, setOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

  useEffect(() => {
    let effectiveCriteria = filter;
  
    // ถ้าผู้ใช้ไม่ใช่ 'Admin', ตั้งค่าให้มีเงื่อนไข UserID ตามผู้ใช้ปัจจุบัน
    if (getUserRole() !== 'Admin') {
      effectiveCriteria = { ...filter, UserID: getUserID() };
    }
  
    axios
      .post('/api/pininfo_list', {
        token: storedToken,
        criteria: effectiveCriteria
      })
      .then(response => {
        setData(response.data);
      })
      .catch(error => console.error(error));
  }, [storedToken, filter]);


  useEffect(() => {
    axios
      .post('/api/department_list', {
        token: storedToken
      })
      .then(response => {
        setDepartments(response.data)
      })
      .catch(error => console.error(error))
  }, [storedToken])    


  const handleFilterChange = (event) => {
    setFilter({
      ...filter,
      [event.target.name]: event.target.value,
    });
  };
  
  const addPin = () => {
    setSelectedPin(null);
    setOpen(true);
  };

  const editPin = (PinID) => {
    const pin = data.find((pin) => pin.PinID === PinID);
    setSelectedPin(pin);
    setOpen(true);
  };

    // ประกาศ state สำหรับการจัดการ dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [pinToDelete, setPinToDelete] = React.useState(null);

    // ฟังก์ชันที่จะเรียกเมื่อคุณต้องการลบผู้ใช้
    const requestDeletePin = (pin) => {
      setPinToDelete(pin);
      setDeleteDialogOpen(true);
    };

    const confirmDeletePin = async () => {
      const pin = data.find((pin) => pin.PinID === pinToDelete);

      try {
        const response = await axios.post('/api/pininfo_mgmt', {
          token: storedToken,
          mode: 'delete',
          user_data: pin,
        });

        setData(data.filter((pin) => pin.PinID !== pinToDelete));
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error(error);
      }
    };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    let errorMessage = '';
    if (!selectedPin?.PinName) {
      errorMessage += '<li>จำเป็นต้องระบุชื่อสถานที่จัดงาน.</li>';
    }
    if (!selectedPin?.ContactPerson) {
      errorMessage += '<li>จำเป็นต้องระบุชื่อผู้ติดต่อประสานงาน.</li>';
    }
    if (!selectedPin?.ContactTel) {
      errorMessage += '<li>จำเป็นต้องระบุเบอร์โทรศัพท์ผู้ติดต่อประสานงาน.</li>';
    }
    if (!selectedPin?.Latitude) {
      errorMessage += '<li>จำเป็นต้องระบุละติจูด.</li>';
    }
    if (!selectedPin?.Longitude) {
      errorMessage += '<li>จำเป็นต้องระบุลองจิจูด.</li>';
    }
    if (!selectedPin?.Activity) {
      errorMessage += '<li>จำเป็นต้องระบุกิจกรรมที่จัด.</li>';
    }
    if (!selectedPin?.PlaceAddress) {
      errorMessage += '<li>จำเป็นต้องระบุที่อยู่.</li>';
    }

    if (!selectedPin?.Latitude || isNaN(selectedPin.Latitude)) {
      errorMessage += '<li>ละติจูดจะต้องเป็นตัวเลข.</li>';
    }
    if (!selectedPin?.Longitude || isNaN(selectedPin.Longitude)) {
      errorMessage += '<li>ลองจิจูดจะต้องเป็นตัวเลข.</li>';
    }

    if (errorMessage) {
      errorMessage = `<ul>${errorMessage}</ul>`;
      setAlertMessage(errorMessage);
      setAlertOpen(true);
  
      return;
    }

    const udata=getUserData();


    if (!selectedPin?.PinID) {
      selectedPin.PinPicture =  '';
      selectedPin.UserID=getUserID();
    }


    if (getUserRole() !== 'User' && !selectedPin?.PinID) {
      selectedPin.Province=udata.Province;
      selectedPin.OfficeName=udata.FullName;
    }

    //console.log(udata,selectedPin);


    await axios
    .post('/api/pininfo_mgmt', {
      token: storedToken,
      mode: (selectedPin?.PinID)?'update':'add',
      user_data : selectedPin
    })
    .then(async response => {

      if (selectedPin?.PinID) { // ถ้า PinID มีค่า, จะทำการ update
        const updatedData = data.map(item => 
          item.PinID === selectedPin.PinID ? response.data[0] : item
        );
        setData(updatedData);
      } else { // ถ้าไม่มี PinID, จะทำการ add
        if (response.data != null && response.data.length > 0) {
          setData([...data, response.data[0]]);
        }
      }
    })
    .catch(error => console.error(error))

    setOpen(false);
  };

  function generateRandom() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    return retVal;
  }

  const openGoogleMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };  

  return (
    <>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>

    <div style={{ display: 'flex', gap: '10px' }}>
      {getUserRole() === 'Admin' && (
        <>
          <TextField
            name="PinName"
            label="ชื่อสถานที่จัดงาน"
            value={filter.PinName}
            onChange={handleFilterChange}
          />
          <TextField
            name="ContactPerson"
            label="ชื่อผู้ดูแล"
            value={filter.ContactPerson}
            onChange={handleFilterChange}
          />
          <TextField
            name="Province"
            label="จังหวัด"
            value={filter.Province}
            onChange={handleFilterChange}
          />
          <Select
            name="DepartmentID"
            value={filter.DepartmentID}
            onChange={handleFilterChange}
          >
            <MenuItem value="all">ทั้งหมด</MenuItem>
            {departments.map((department) => (
              <MenuItem key={department.DepartmentID} value={department.DepartmentID}>{department.DepartmentName}</MenuItem>
            ))}
          </Select>
        </>
      )}
    </div>

      <Button variant="contained" color="success" onClick={() => addPin(null)} >เพิ่มข้อมูล</Button>
    </div>

    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
            getRowId={(row) =>  generateRandom()}
        columns={[
          { field: 'PinID', headerName: 'รหัส', width: 80 },
          { field: 'PinName', headerName: 'ชื่อสถานที่จัดงาน', width: 200 },
          { field: 'ContactPerson', headerName: 'ชื่อผู้ติดต่อ', width: 200 },
          { field: 'ContactTel', headerName: 'โทรศัพท์ผู้ติดต่อ', width: 200 },
          { field: 'Province', headerName: 'จังหวัด', width: 200 },
          { 
            field: 'actions', 
            headerName: 'การกระทำ', 
            width: 250,
            renderCell: (params) => (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '3px' }}>
                  <Button 
                    variant='contained' 
                    color="warning" 
                    onClick={() => editPin(params.row.PinID)}
                    style={{ marginRight: '8px' }} // เพิ่ม margin ทางขวา
                  >
                    แก้ไข
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => requestDeletePin(params.row.PinID)}
                    style={{ marginRight: '8px' }} // เพิ่ม margin ทางขวา
                  >
                    ลบ
                  </Button>
                  <Button 
                    variant="contained" 
                    color="success" 
                    onClick={() => openGoogleMaps(params.row.Latitude, params.row.Longitude)}
                  >
                    แผนที่
                  </Button>
                </div>

              </>
            )
          },
        ]}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
      <Dialog open={open} onClose={handleDialogClose} fullWidth={true} maxWidth="md">
        <DialogTitle>{selectedPin ? 'แก้ไขข้อมูลสถานที่จัดงาน' : 'เพิ่มข้อมูลสถานที่จัดงาน'}</DialogTitle>
          <DialogContent>
            <InputLabel>ชื่อสถานที่จัดงาน</InputLabel>
            <TextField
                autoFocus
                margin="dense"
                type="text"
                fullWidth
                value={selectedPin?.PinName || ''}
                onChange={(event) => setSelectedPin({ ...selectedPin, PinName: event.target.value })}
                required
            />
            <InputLabel>ทีอยู่</InputLabel>
            <TextField
                autoFocus
                margin="dense"
                type="text"
                fullWidth
                multiline
                value={selectedPin?.PlaceAddress || ''}
                onChange={(event) => setSelectedPin({ ...selectedPin, PlaceAddress: event.target.value })}
            />
            <InputLabel>กิจกรรมที่จัดในวันเด็ก</InputLabel>
            <TextField
                autoFocus
                margin="dense"
                type="text"
                fullWidth
                rows={3} 
                multiline
                value={selectedPin?.Activity || ''}
                onChange={(event) => setSelectedPin({ ...selectedPin, Activity: event.target.value })}
                required
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ flex: 1, marginRight: '10px' }}>
                <InputLabel>ชื่อผู้ติดต่อประสานงาน</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  type="text"
                  fullWidth
                  value={selectedPin?.ContactPerson || ''}
                  onChange={(event) => setSelectedPin({ ...selectedPin, ContactPerson: event.target.value })}
                />
              </div>
              <div style={{ flex: 1 }}>
                <InputLabel>โทรศัพท์ผู้ติดต่อประสานงาน</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  type="text"
                  fullWidth
                  value={selectedPin?.ContactTel || ''}
                  onChange={(event) => setSelectedPin({ ...selectedPin, ContactTel: event.target.value })}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, marginRight: '10px' }}>
                <InputLabel>ละติจูด</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  type="number"
                  fullWidth
                  value={selectedPin?.Latitude || ''}
                  onChange={(event) => setSelectedPin({ ...selectedPin, Latitude: event.target.value })}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <InputLabel>ลองจิจูด</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  type="number"
                  fullWidth
                  value={selectedPin?.Longitude || ''}
                  onChange={(event) => setSelectedPin({ ...selectedPin, Longitude: event.target.value })}
                  required
                />
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>ยกเลิก</Button>
            <Button onClick={handleFormSubmit}>บันทึก</Button>
          </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>ยืนยันการลบข้อมูล</DialogTitle>
        <DialogContent>
          คุณต้องการลบข้อมูลนี้ใช่หรือไม่ ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>ยกเลิก</Button>
          <Button onClick={confirmDeletePin} color="primary">ยืนยัน</Button>
        </DialogActions>
      </Dialog>

      <CustomSnackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => {
          setAlertOpen(false);
        }}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}        
      >
        <CustomAlert
          severity="error"
          onClose={() => {
            setAlertOpen(false);
          }}
          sx={{ width: '100%' }}
        >
          <div dangerouslySetInnerHTML={{ __html: alertMessage }} />
        </CustomAlert>
      </CustomSnackbar>
    </div>
 



    </>
  );
}
