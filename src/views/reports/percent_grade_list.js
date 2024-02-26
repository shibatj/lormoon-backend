import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Snackbar, Alert } from '@mui/material';

// ** Config
import authConfig from 'src/configs/auth';

export default function PercentGradeList({filters}) {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {

    
    try {
      // ตรวจสอบ Token ที่จัดเก็บไว้
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

      const response = await axios.post('/api/reports/percent_grade', {
        token: storedToken,
        filters:filters
      });


      if (response.status === 200) {
        setReportData(response.data); // ตั้งค่าข้อมูลรายงาน
        //console.log(response.data)
      } else {
        //throw new Error('Unable to fetch the report.');
      }
    } catch (err) {
      //setError(err.message || 'There was an error fetching the report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [filters]); // หากคุณต้องการโหลดรายงานตอนเริ่มต้น ให้ส่ง array ว่าง []

  if (loading) {
    return <div>Loading...</div>;
  }


  // สร้าง columns สำหรับ DataGrid
  const columns = [
    { field: 'academicYear', headerName: 'Academic Year', width: 150 },
    { field: 'majorCode', headerName: 'Major Code', width: 150 },
    { field: 'majorNameTh', headerName: 'Major Name', width: 200 },
    { field: 'total_students', headerName: 'Total Students', width: 180 },
    { field: 'total_passed', headerName: 'Total Passed', width: 180 },
    {
      field: 'percent_passed',
      headerName: 'Percent Passed',
      width: 180,

      // ใช้ฟังก์ชั่น custom render สำหรับคอลัมน์นี้
      renderCell: (params) => {

        // ตรวจสอบและแปลงค่าให้เป็นทศนิยมสองตำแหน่ง

        const valueFormatted = Number(params.value).toFixed(2);

        return (
          <span>
            {valueFormatted}
          </span>
        );
      }
    }
  ];

  return (
    <div style={{ height: 800, width: '100%' }}>
      <DataGrid
        getRowId={(row) =>  row.majorNameTh}
        rows={reportData}
        columns={columns}
        pageSize={50}
        rowsPerPageOptions={[5, 10, 20]}
        pagination
      />
    </div>
  );
}
