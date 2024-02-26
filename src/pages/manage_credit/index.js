import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { format } from 'date-fns';

const ManageCredit = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [couponData, setCouponData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/manage_credit', {
                params: {
                    startDate,
                    endDate
                }
            });
            setCouponData(response.data[0]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const filterCouponByDateRange = (coupon) => {
        if (!startDate || !endDate) {
            return true;
        }
        const couponDate = new Date(coupon.TranDT);
        const filterStartDate = new Date(startDate);
        const filterEndDate = new Date(endDate);
        
        return couponDate >= filterStartDate && couponDate <= filterEndDate;
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ color: '#FFFFFF' }}>ข้อมูลรายจ่ายทั้งหมด</Typography>
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
                                            onChange={(e) => setStartDate(e.target.value)}
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
                                            onChange={(e) => setEndDate(e.target.value)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            fullWidth
                                        />
                                    </Grid>
                                    {/* <Grid item xs={6} md={3}>
                                        <Button variant="contained" onClick={fetchData}>Filter</Button>
                                    </Grid> */}
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
                                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>TranID</TableCell>
                                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>AccountID</TableCell>
                                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>UnitCost</TableCell>
                                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>UnitCharge</TableCell>
                                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>SumCost</TableCell>
                                                <TableCell style={{ fontWeight: 'bold', textAlign: 'center' }}>TranDT</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {couponData.filter(filterCouponByDateRange).map((coupon) => (
                                                <TableRow key={coupon.id}>
                                                    <TableCell style={{ textAlign: 'center' }}>{coupon.TranID}</TableCell>
                                                    <TableCell style={{ textAlign: 'center' }}>{coupon.AccountID}</TableCell>
                                                    <TableCell style={{ textAlign: 'center' }}>{coupon.UnitCost}</TableCell>
                                                    <TableCell style={{ textAlign: 'center' }}>{coupon.UnitCharge}</TableCell>
                                                    <TableCell style={{ textAlign: 'center' }}>{coupon.SumCost}</TableCell>
                                                    <TableCell style={{ textAlign: 'center' }}>
                                                        {format(new Date(coupon.TranDT), 'dd/MM/yyyy HH:mm:ss')}
                                                    </TableCell>
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

export default ManageCredit;
