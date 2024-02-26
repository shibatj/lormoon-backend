import React, { useState } from 'react';
import Button from '@mui/material/Button';
import QRCode from 'qrcode.react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';
import axios from 'axios';

import authConfig from 'src/configs/auth';

const Dummy = () => {
  const [generatedToken, setGeneratedToken] = useState(null);
  const [quantity, setQuantity] = useState(20);
  const [countcoupon, setCountCoupon] = useState(1);
  const [tableData, setTableData] = useState([]);

  const handleGenerateToken = () => {
    const generatedTokens = Array.from({ length: countcoupon }, () => ({
      code: generateRandomToken(),
      cost: quantity
    }));
    
    setGeneratedToken(generatedTokens);
  
    const newData = generatedTokens.map((token, index) => ({
      id: tableData.length + index,
      token: token.code,
      quantity: token.cost,
      countCoupon: 1
    }));
  
    setTableData((prevData) => [...prevData, ...newData]);
  };

  const handleDeleteRow = (id) => {
    setTableData((prevData) => prevData.filter((data) => data.id !== id));
  };

  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

  const handleConfirm = async () => {
    try {
      const response = await axios.post('/api/save_coupon', {
        token: storedToken,
        tokens: generatedToken
      });
      
      if (response.status === 200) {
        const confirmed = window.confirm('บันทึกเรียบร้อยแล้ว');
        if (confirmed) {
          // ทำอะไรต่อหลังจากผู้ใช้กด OK
        }
      } else {
        console.error('Failed to save data');
        window.alert('มีข้อผิดพลาดในการบันทึกข้อมูล');
      }
    } catch (error) {
      console.error('Error while calling the API:', error);
    }
  };

  const handleChangeQuantity = (event) => {
    setQuantity(event.target.value);
  };

  const handleChangeCountCoupon = (event) => {
    setCountCoupon(event.target.value);
  };

  const generateRandomToken = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const tokenLength = 32;
    let token = '';
    for (let i = 0; i < tokenLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
    }
    
    return token;
  };

  return (
    <div style={{ flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ alignItems: 'center', marginBottom: '10px', textAlign: 'center' }}>
        <FormControl>
          <FormLabel htmlFor="quantity-select">จำนวนเงิน</FormLabel>
          <Select
            label="Quantity"
            value={quantity}
            onChange={handleChangeQuantity}
            style={{ marginRight: '10px' }}
          >
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
            <MenuItem value={200}>200</MenuItem>
            <MenuItem value={300}>300</MenuItem>
            <MenuItem value={400}>400</MenuItem>
            <MenuItem value={500}>500</MenuItem>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="quantity-select">จำนวนคูปอง</FormLabel>
          <Select
            label="CountCoupon"
            value={countcoupon}
            onChange={handleChangeCountCoupon}
            style={{ marginRight: '10px' }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
              <MenuItem key={number} value={number}>{number}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" style={{marginTop: '28px'}} onClick={handleGenerateToken}>
          Generate Token
        </Button>
      </div>

      {tableData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Token</TableCell>
                  <TableCell>จำนวนเงิน</TableCell>
                  <TableCell>จำนวนคูปอง</TableCell>
                  <TableCell>QRCode</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData.map((data) => (
                  <TableRow key={data.id}>
                    <TableCell>{data.token}</TableCell>
                    <TableCell>{data.quantity}</TableCell>
                    <TableCell>{data.countCoupon}</TableCell>
                    <TableCell>
                      <div>
                        <QRCode value={data.token} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => handleDeleteRow(data.id)}>
                        ลบ
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
      <Button variant="contained" style={{marginTop: '28px'}} onClick={() => handleConfirm()}>
        บันทึกข้อมูล
      </Button>
    </div>
  );
};

export default Dummy;
