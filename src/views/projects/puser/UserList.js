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
  

export default function UserList() {
  const [data, setData] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [filter, setFilter] = useState({
    Username: "",
    FullName: "",
    Role: "all",
    DepartmentID: "all",
  });

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

  useEffect(() => {
    axios
      .post('/api/user_list', {
        token: storedToken,
        filters: filter
      })
      .then(response => {
        setData(response.data)
      })
      .catch(error => console.error(error))
  }, [storedToken,filter])

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
  
  const addUser = () => {
    setSelectedUser(null);
    setOpen(true);
  };

  const editUser = (username) => {
    const user = data.find((user) => user.Username === username);
    setSelectedUser(user);
    setOpen(true);
  };

    // ประกาศ state สำหรับการจัดการ dialog
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [userToDelete, setUserToDelete] = React.useState(null);

    // ฟังก์ชันที่จะเรียกเมื่อคุณต้องการลบผู้ใช้
    const requestDeleteUser = (username) => {
      setUserToDelete(username);
      setDeleteDialogOpen(true);
    };

    const confirmDeleteUser = async () => {
      const user = data.find((user) => user.Username === userToDelete);

      try {
        const response = await axios.post('/api/user_mgmt', {
          token: storedToken,
          mode: 'delete',
          user_data: user,
        });

        setData(data.filter((user) => user.Username !== userToDelete));
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
    if (!selectedUser?.Username) {
      errorMessage += '<li>Username is required.</li>';
    }
    if (!selectedUser?.DepartmentID) {
      errorMessage += '<li>DepartmentID is required.</li>';
    }
    if (!selectedUser?.FullName) {
      errorMessage += '<li>Full Name is required.</li>';
    }
    if (!selectedUser?.Role) {
      errorMessage += '<li>Role is required.</li>';
    }


    //if (!selectedUser?.Password) {
    //  errorMessage += '<li>Password is required.</li>';
    //}

    if (selectedUser?.Password==null)
      selectedUser.Password='';

    if (selectedUser?.Password !== confirmPassword) {
      errorMessage += '<li>Password and Confirm password must match.</li>';
    }

    if (errorMessage) {
      errorMessage = `<ul>${errorMessage}</ul>`;
      setAlertMessage(errorMessage);
      setAlertOpen(true);

      return;
    }

    await axios
    .post('/api/user_mgmt', {
      token: storedToken,
      mode: (selectedUser?.UserID)?'update':'add',
      user_data : selectedUser
    })
    .then(async response => {

      if (selectedUser?.UserID) { // ถ้า UserID มีค่า, จะทำการ update
        const updatedData = data.map(item => 
          item.UserID === selectedUser.UserID ? response.data[0] : item
        );
        setData(updatedData);
      } else { // ถ้าไม่มี UserID, จะทำการ add
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

  return (
    <>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px'}}>
      <div style={{ display: 'flex', gap: '10px' }}>
        <TextField
          name="Username"
          label="ชื่อผู้ใช้งาน"
          value={filter.Username}
          onChange={handleFilterChange}
        />
         <TextField
          name="FullName"
          label="ชื่อผู้ดูแล"
          value={filter.FullName}
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
      </div>
      <Button variant="contained" color="success" onClick={() => addUser(null)} >เพิ่มข้อมูล</Button>
    </div>

    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
            getRowId={(row) =>  generateRandom()}
        columns={[
          { field: 'Username', headerName: 'ชื่อผู้ใช้งาน', width: 200 },
          { field: 'DepartmentName', headerName: 'ประเภทผู้ใช้งาน', width: 200 },
          { field: 'FullName', headerName: 'ชื่อผู้ดูแล', width: 200 },
          { field: 'Province', headerName: 'จังหวัด', width: 200 },
          { 
            field: 'actions', 
            headerName: 'การกระทำ', 
            width: 200,
            renderCell: (params) => (
              <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: '10px' }}>
                <Button variant='contained' color="warning" onClick={() => editUser(params.row.Username)}>แก้ไข</Button>
              </div>
                <Button variant="contained" color="primary" onClick={() => requestDeleteUser (params.row.Username)}>ลบ</Button>
              </>
            )
          },
        ]}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
      <Dialog open={open} onClose={handleDialogClose} fullWidth={true} maxWidth="md">
        <DialogTitle>{selectedUser ? 'แก้ไขข้อมูลผู้ใช้งาน' : 'เพิ่มข้อมูลผู้ใช้งาน'}</DialogTitle>
          <DialogContent>
            <InputLabel>ชื่อผู้ใช้งาน</InputLabel>
            <TextField
                autoFocus
                margin="dense"
                type="text"
                fullWidth
                value={selectedUser?.Username || ''}
                onChange={(event) => setSelectedUser({ ...selectedUser, Username: event.target.value })}
                required
            />
            <InputLabel>สังกัด สำนัก / หน่วย / กลุ่ม / ศูนย์</InputLabel>
            <Select
              fullWidth
              required
              name="DepartmentID"
              value={selectedUser?.DepartmentID || ''}
              onChange={(event) => setSelectedUser({ ...selectedUser, DepartmentID: event.target.value })}
            >
              {departments.map((department) => (
                <MenuItem key={department.DepartmentID} value={department.DepartmentID}>{department.DepartmentName}</MenuItem>
              ))}
            </Select>
            <InputLabel>ชื่อผู้ดูแล</InputLabel>
            <TextField
                margin="dense"
                type="text"
                fullWidth
                value={selectedUser?.FullName || ''}
                onChange={(event) => setSelectedUser({ ...selectedUser, FullName: event.target.value })}
                required
            />
            <InputLabel>สิทธิ์การเข้าถึง</InputLabel>
            <Select
              fullWidth
              required
              name="role"
              value={selectedUser?.Role || ''}
              onChange={(event) => setSelectedUser({ ...selectedUser, Role: event.target.value })}
            >
              <MenuItem  key='Department' value='Department'>สำนัก/หน่วย/กลุ่ม/ศูนย์</MenuItem>
              <MenuItem  key='Evaluation' value='Evaluation'>กลุ่มประเมินผล</MenuItem>
              <MenuItem  key='GM' value='GM'>ผู้บริหาร</MenuItem>
              <MenuItem  key='Admin' value='Admin'>ผู้ดูแลระบบ</MenuItem>
            </Select>

            <InputLabel>รหัสผ่าน</InputLabel>
            <TextField
              margin="dense"
              type="password"
              fullWidth
              value={selectedUser?.Password || ''}
              onChange={(event) => setSelectedUser({ ...selectedUser, Password: event.target.value })}
              required
            />
            <InputLabel>ยืนยันรหัสผ่าน</InputLabel>
            <TextField
              margin="dense"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />      
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
          <Button onClick={confirmDeleteUser} color="primary">ยืนยัน</Button>
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
