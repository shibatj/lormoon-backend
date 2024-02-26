import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Config
import authConfig from 'src/configs/auth';

import PercentGradeList from 'src/views/reports/percent_grade_list'
import PercentGradeFilters from 'src/views/reports/percent_grade_filters'

export default function GradeReport() {

  const [filters, setFilters] = useState({
    academicYear: '',
    subjectCode: ''
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
        <Card>
      <CardHeader
      title='รายงานสรุปเกรดนักศึกษาแต่ละแผนก'
    />
          <CardContent sx={{ '& .MuiTabPanel-root': { p: 0 } }}>
      <PercentGradeFilters onFilterChange={handleFilterChange} />
      <PercentGradeList filters={filters} />
      </CardContent>
    </Card>
    </>
);
}
