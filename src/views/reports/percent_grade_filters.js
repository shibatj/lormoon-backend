import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from '@mui/material';

import SubjectCodeFinder from './subject_code_finder';
import MajorCodeFinder from './major_code_finder';

// ** Config
import authConfig from 'src/configs/auth';

export default function PercentGradeFilters({ onFilterChange }) {

  const [academicYears, setAcademicYears] = useState([]); // สำหรับเก็บรายการปีการศึกษา
  const [error, setError] = useState(''); // สำหรับข้อความข้อผิดพลาด

  const [localFilters, setLocalFilters] = useState({
    academicYear: '',
    subjectCode: '',
    passingGrade:0
  });

  useEffect(() => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);

    const fetchAcademicYears = async () => {
      try {
        const response = await axios.post('/api/reports/list_academicyear', {
          token: storedToken
        });
        setAcademicYears(response.data);
        if (response.data.length > 0)
          localFilters.academicYear = response.data[0];
      } catch (error) {
        console.error('There was an error fetching the academic years!', error);
      }

    };
  
    fetchAcademicYears();
  }, []);

    const handleChange = (event) => {
        if (event==null) return;
        if (event.target==null) return;

        const { name, value } = event.target;
        
        //alert(name + " " + value);

        setLocalFilters(prevFilters => ({
          ...prevFilters,
          [name]: value
        }));
      };

      const handleSubmit = () => {
      // ตรวจสอบว่าผู้ใช้ได้เลือกปีการศึกษาหรือไม่
        if (!localFilters.academicYear) {
          setError('Please select an academic year.');

          return;
        }

        // ล้างข้อความข้อผิดพลาดและส่งข้อมูล
        setError('');
        onFilterChange(localFilters);
      };
  
    return (
<>
  {/* ตัวกรองข้อมูล */}
  <Grid container spacing={1}>
    <Grid item xs={12} sm={2}> {/* ปรับขนาดเป็น 4 คอลัมน์สำหรับหน้าจอขนาดกลางขึ้นไป */}
      <Select
        label="ปีการศึกษา"
        name="academicYear"
        value={localFilters.academicYear}
        onChange={handleChange}
        error={!!error}
      >
        {academicYears.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </Grid>
    <Grid item xs={12} sm={4}> {/* ปรับขนาดเป็น 4 คอลัมน์ */}
      <SubjectCodeFinder academicYear={localFilters.academicYear} onChange={handleChange} />
    </Grid>
    <Grid item xs={12} sm={4}> {/* ปรับขนาดเป็น 4 คอลัมน์ */}
      <TextField
        label="Passing Grade"
        name="passingGrade"
        value={localFilters.passingGrade}
        onChange={handleChange}
        error={!!error}
        variant="outlined"
        type="number"
      />
    </Grid>
    <Grid item xs={12} > {/* ปรับขนาดเป็น 4 คอลัมน์ */}
      <MajorCodeFinder academicYear={localFilters.academicYear} onChange={handleChange} />
    </Grid>
    <Grid item xs={12}> {/* ปรับขนาดเป็น 12 คอลัมน์สำหรับปุ่ม Submit */}
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Search
      </Button>
    </Grid>
  </Grid>

  {/* ถ้ามีข้อผิดพลาด แสดงที่นี่ */}
  {error && (
    <Snackbar open={true} autoHideDuration={6000} onClose={() => setError('')}>
      <Alert onClose={() => setError('')} severity="error">
        {error}
      </Alert>
    </Snackbar>
  )}
</>

    );
  }
  