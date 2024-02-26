// ** MUI Imports
import { useRouter } from 'next/router'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Demo Components Imports
import StepperLinearWithValidation from 'src/views/forms/form-wizard/StepperLinearWithValidation'

const FormWizard = () => {
  const router = useRouter()
  const { ProjectCode } = router.query
  console.log('Open Form Wizard', ProjectCode)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h6'>แบบรายงานผลการดำเนินงาน</Typography>
      </Grid>
      <Grid item xs={12}>
        <StepperLinearWithValidation />
      </Grid>
    </Grid>
  )
}

export default FormWizard
