// ** MUI Imports
import { useRouter } from 'next/router'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'


const Dummy = () => {
  const router = useRouter()
  
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h6'>Dummy Page</Typography>
      </Grid>
      <Grid item xs={12}>
        Dummy Kollayut 5555
      </Grid>
    </Grid>
  )
}

export default Dummy
