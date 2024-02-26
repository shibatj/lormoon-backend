import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, TextField, Autocomplete, Box } from '@mui/material';
import authConfig from 'src/configs/auth';
import CircularProgress from '@mui/material/CircularProgress';

export default function MajorCodeFinder({ academicYear, onChange }) {
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (academicYear) {
      setLoading(true);

      axios.post('/api/reports/list_majorcode_by_year', {
        token: window.localStorage.getItem(authConfig.storageTokenKeyName),
        academicYear,
      })
      .then(response => {
        if (response.data) {
          setOptions(response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      })
      .finally(() => {
        setLoading(false);
      });
    }
  }, [academicYear]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allMajorCodes = options.map(option => option.majorCode);
      setSelectedOptions(allMajorCodes);
      onChange(allMajorCodes);
    } else {
      setSelectedOptions([]);
      onChange([]);
    }
    setSelectAll(event.target.checked);
  };

  const handleChange = (event, values) => {
    // รับ objects ทั้งหมดแล้วแปลงเป็น majorCode เท่านั้น
    const newValues = values.map(item => item.majorCode);
    setSelectedOptions(newValues);

    const simulatedEvent = {
      target: {
        name: 'majorCodes', // ตั้งชื่อ field ว่า 'majorCodes' หรืออย่างอื่นที่เหมาะสม
        value: newValues, // ใช้ array ของ major codes ที่ถูกเลือก
      },
    };

    onChange(simulatedEvent);
  };

  return (
    <FormControl component="fieldset" variant="standard">
      <FormLabel component="legend">Select Major Code</FormLabel>
      <FormGroup>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <div>Select All</div>
            </Box>
            <Autocomplete
              multiple
              id="majorCode-autocomplete"
              options={options}
              disableCloseOnSelect
              getOptionLabel={(option) => `${option.majorCode} ${option.majorNameTh}`}
              isOptionEqualToValue={(option, value) => option.majorCode === value}
              onChange={handleChange}
              value={options.filter(option => selectedOptions.includes(option.majorCode))}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <FormControlLabel
                    control={<Checkbox checked={selected} />}
                    label={`${option.majorCode} ${option.majorNameTh}`}
                  />
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Major Codes"
                  placeholder="Select"
                />
              )}
            />
          </>
        )}
      </FormGroup>
    </FormControl>
  );
}
