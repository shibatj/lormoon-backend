// ** MUI Imports
import { useRouter } from 'next/router'

import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'


const Dummy = () => {
  const router = useRouter()
  const videoUrl = 'https://lormoon.nkstec.ac.th/camerastream/static/clip.mp4';
  
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Typography variant='h6'>Dummy Page</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography>Dummy Kollayut 5555</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant='h6'>Video Stream</Typography>
        <video width="100%" height="auto" controls>
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Grid>
    </Grid>
  )
}

Dummy.getLayout = page => <BlankLayout>{page}</BlankLayout>
Dummy.guestGuard = true

export default Dummy
