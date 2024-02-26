import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, TextField } from '@mui/material';
import { format } from 'date-fns';

const ManageCoupon = () => {
  const [filter, setFilter] = useState('all');
  const [couponData, setCouponData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchData();
  }, [filter, startDate, endDate]);

  const fetchData = async () => {
    try {
      let params = { filter };
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const response = await axios.get('/api/manage_coupon', { params });
      setCouponData(response.data[0]);
      console.log(response.data[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ color: '#FFFFFF' }}>ข้อมูลรายรับทั้งหมด</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Grid container spacing={3} style={{ marginTop: '20px' }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Filter DateTime
                </Typography>
                <Grid container spacing={2} style={{ marginTop: '10px' }}>
                  <Grid item xs={6} md={3}>
                    <TextField
                      id="start-date"
                      label="Start Date"
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      id="end-date"
                      label="End Date"
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  Coupon Debit
                </Typography>
                <TableContainer component={Paper} style={{ marginTop: '10px' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>ID</TableCell>
                        <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Coupon Code</TableCell>
                        <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Type</TableCell>
                        <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Date</TableCell>
                        <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {couponData.map((coupon) => (
                        (!startDate || !endDate || (new Date(coupon.DebitDT) >= new Date(startDate) && new Date(coupon.DebitDT) <= new Date(endDate))) &&
                        <TableRow key={coupon.id}>
                          <TableCell style={{ textAlign: 'center' }}>{coupon.AccountID}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{coupon.GenerateCode}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{coupon.type}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{format(new Date(coupon.DebitDT), 'dd/MM/yyyy')}</TableCell>
                          <TableCell style={{ textAlign: 'center' }}>{coupon.GenerateCost}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ManageCoupon;
