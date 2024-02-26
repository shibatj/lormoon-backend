// ** MUI Import
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Demo Component Imports
import PinList from 'src/views/pininfo/admin_pinlist'

// ** Custom Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

const information = () => {
  return (
    <Card>
      <CardHeader
      title='ข้อมูลสถานที่จัดงานวันเด็ก'
    />
      <CardContent sx={{ '& .MuiTabPanel-root': { p: 0 } }}>
        <PinList />
      </CardContent>
    </Card>

  )
}

export default information

/*
export default function DepartmentProject() {
  return <h1>โครงการในหน่วยงาน</h1>
}
*/
