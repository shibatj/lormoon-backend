// ** Next Import
import Link from 'next/link'
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

const Logologin = styled('img')(({ theme }) => ({
  zIndex: 2,
  marginTop: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

// Styled Components
const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize
}))

const ForgotPassword = () => {

    // ** States
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

  // ** Hooks
  const theme = useTheme()

  const router = useRouter();

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

    // ** Handler Function
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Validation
      if (!email || !email.includes('@')) {
        setError('กรุณาระบุอีเมล์ที่ถูกต้อง');

        return;
      }
  
      try {
        const response = await axios.post('/api/forget_password', { email });
        setMessage('Instructions to reset your password have been sent to your email.');
        setError('');

        router.push('/login');
      } catch (err) {
        setError(err.response?.data?.error || 'Error occurred while sending reset link');
        setMessage('');
      }
    };

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <ForgotPasswordIllustration
            alt='forgot-password-illustration'
            src={`/images/pages/auth-v2-forgot-password-illustration-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Logologin alt='login-ovecreport' src={`/images/oveclogo.png`} width={'30%'} />
            <Box sx={{ my: 6 }}>
              <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                ลืมรหัสผ่าน ? 🔒
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                กรอกอีเมล์ที่ลงทะเบียนไว้ในช่องข้างล่าง ระบบจะเปลี่ยนรหัสผ่านใหม่และแจ้งไปยังอีเมล์ที่ได้ลงทะเบียนไว้
              </Typography>
            </Box>
            <form noValidate autoComplete='off' onSubmit={handleSubmit}>
              <CustomTextField
                fullWidth autoFocus type='email' label='อีเมล์' sx={{ display: 'flex', mb: 4 }}
                value={email} onChange={(e) => setEmail(e.target.value)}
                error={!!error} helperText={error || message}
              />
              <Button fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                ส่งข้อมูลเพื่อขอรหัสผ่านใหม่
              </Button>
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
                <LinkStyled href='/login'>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                  <span>กลับไปที่หน้าล้อกอิน</span>
                </LinkStyled>
              </Typography>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}
ForgotPassword.getLayout = page => <BlankLayout>{page}</BlankLayout>
ForgotPassword.guestGuard = true

export default ForgotPassword
