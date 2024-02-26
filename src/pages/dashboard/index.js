import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import { RadialBarChart, RadialBar, Tooltip, Legend } from 'recharts';

const Dashboard = () => {
  const [totalGenerateCost, setTotalGenerateCost] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/dashboard');
      setTotalGenerateCost(response.data.TotalGenerateCost || 0);
      setTotalExpense(response.data.TotalExpense || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" style={{ color: '#FFFFFF' }}>Dashboard</Typography>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div">
                  ข้อมูลรายรับและรายจ่าย
                </Typography>
                <RadialBarChart width={800} height={400} innerRadius="20%" outerRadius="80%" data={[
                  { name: 'รายรับ', value: totalGenerateCost, fill: '#1976d2', labelText: 'รายรับ' },
                  { name: 'รายจ่าย', value: totalExpense, fill: '#388e3c', labelText: 'รายจ่าย' }
                ]}>
                  <RadialBar minAngle={15} label={{ position: 'insideStart', fill: '#fff' }} background clockWise={true} dataKey="value" />
                  <Tooltip />
                  <Legend />
                </RadialBarChart>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Dashboard;
