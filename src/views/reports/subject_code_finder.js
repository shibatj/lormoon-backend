import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Autocomplete } from '@mui/material';
import authConfig from 'src/configs/auth';
import CircularProgress from '@mui/material/CircularProgress';


export default function SubjectCodeFinder({ academicYear, onChange }) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]); // สำหรับเก็บรายการข้อเสนอแนะ
  const [loading, setLoading] = useState(false); // ใช้สำหรับแสดงสถานะการโหลด
  const [selectedValue, setSelectedValue] = useState(null); // เก็บค่าที่เลือก


  useEffect(() => {
    let active = true;

    // ตรวจสอบว่ามีค่าใน inputValue หรือไม่ ถ้าไม่มีก็ไม่จำเป็นต้อง fetch suggestions
    if (inputValue === '') {
      setOptions([]);

      return;
    }

    setLoading(true); // เริ่มการโหลดข้อมูล

    (async () => {
      try {
        // ยิง request ไปยัง endpoint ที่กำหนด
        const response = await axios.post('/api/reports/list_subjectcode_by_year', {
          token: window.localStorage.getItem(authConfig.storageTokenKeyName),
          academicYear,
          query: inputValue,
        });

        if (active) {
          // คำนวณข้อมูลที่ได้รับ และอัปเดต options
          setOptions(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);

        // ในกรณีที่มีข้อผิดพลาด ควรจัดการให้เหมาะสม
        if (active) {
          setOptions([]);
        }
      } finally {
        if (active) {
          setLoading(false); // จบการโหลดข้อมูล
        }
      }
    })();

    return () => {
      active = false; // ป้องกันการเซ็ต state หลังจาก component ถูก unmount
    };
  }, [inputValue, academicYear]); // รัน effect เมื่อ inputValue หรือ academicYear เปลี่ยน

  return (
    <Autocomplete

      // options ต้องเป็นออบเจ็กต์ทั้งหมด ไม่ใช่เฉพาะ subjectCode
      options={options} 
      getOptionLabel={(option) => `${option.subjectCode} ${option.subjectName}`}
      loading={loading}
      value={selectedValue} // ค่าที่เลือกจาก dropdown
      onChange={(event, newValue) => {
        setSelectedValue(newValue); // ตั้งค่าที่เลือกใหม่

        if (newValue && newValue.subjectCode) {
          // สร้าง 'event' ปลอมแปลงมาจากการเลือกใหม่
          const modifiedEvent = {
            target: {
              name: 'subjectCode',
              value: newValue.subjectCode, // เราสนใจแค่ subjectCode ในที่นี้
            },
          };
    
          onChange(modifiedEvent); // ส่ง 'event' ไปยัง handler
        } else {
          // สำหรับกรณีที่ไม่มีการเลือก, คุณอาจต้องจัดการสถานะที่เกี่ยวข้อง
          onChange({ target: { name: 'subjectCode', value: '' } }); // ส่งค่าว่างถ้าไม่มีการเลือก
        }

      }}
      onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Subject"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
