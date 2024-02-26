// ** React Imports
import { Fragment, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Stepper from '@mui/material/Stepper'
import MenuItem from '@mui/material/MenuItem'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import InputAdornment from '@mui/material/InputAdornment'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import StepperCustomDot from './StepperCustomDot'
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'

const steps = [
  {
    title: 'ข้อมูลพื้นฐาน (กรอกครั้งเดียว)',
    subtitle: 'ข้อมูลพื้นฐานของโครงการ'
  },
  {
    title: 'ความสอดคล้องกับแผนระดับต่าง ๆ หลักการและเหตุผล (กรอกครั้งเดียว)',
    subtitle: 'ข้อมูลยุทธศาสตร์ชาติ แผนปฏิรูปและนโยบายรัฐบาล หลักการและเหตุผล'
  },
  {
    title: 'ตัวชี้วัดของโครงการ (กรอกครั้งเดียว ครั้งแรก แก้ไขได้)',
    subtitle: 'ตัวชี้วัดของโครงการ กลุ่มเป้าหมาย ระยะเวลาและสถานที่ดำเนินการ'
  },
  {
    title: 'ผลการดำเนินงาน งบประมาณ (รายงานทุกเดือน และงบประมาณทุกไตรมาส)',
    subtitle: 'ผลการดำเนินงาน งบประมาณ'
  },
  {
    title:
      'ปัญหา อุปสรรค และแนวทางแก้ไข ภาพกิจกรรม (ครั้งสุดท้าย เมื่อจบโครงการ รูปภาพเพิ่มเติมได้ตลอดนับตั้งแต่เริ่มรายงาน)',
    subtitle: 'ปัญหา อุปสรรค และแนวทางแก้ไข ภาพกิจกรรม'
  }
]

const defaultBasicValues = {
  projectname: '',
  ovecbureau: '',
  changeproject: '',
  monthlyreport: ''
}

const defaultConsistencyValues = {
  strategy: '',
  masterplan: '',
  subplan: '',
  reformplan: '',
  economicplan: '',
  stability: '',
  policy: '',
  quickwin: '',
  controlledstrategic: '',
  textconsistency: '',
  basicchecked: '',
  textprinciple: '',
  textobjective: '',
  basicplanchecked: '',
  strategicplanchecked: '',
  integrationplanchecked: ''
}

const defaultIndicatorValues = {
  textarea: ''
}

const defaultPerformanceValues = {
  textarea: ''
}

const defaultSolutionValues = {
  textarea: ''
}

const basicSchema = yup.object().shape({
  projectname: yup.string().required(),
  ovecbureau: yup.string().required(),
  monthlyreport: yup.string().required()
})

const consistencySchema = yup.object().shape({
  strategy: yup.string().required(),
  masterplan: yup.string().required(),
  subplan: yup.string().required(),
  reformplan: yup.string().required(),
  economicplan: yup.string().required(),
  stability: yup.string().required(),
  policy: yup.string().required(),
  quickwin: yup.string().required(),
  controlledstrategic: yup.string().required(),
  textconsistency: yup.string().required(),
  basicchecked: yup.string().required(),
  textprinciple: yup.string().required(),
  textobjective: yup.string().required(),
  basicplanchecked: yup.string().required(),
  strategicplanchecked: yup.string().required(),
  integrationplanchecked: yup.string().required()
})

const indicatorSchema = yup.object().shape({
  textarea: yup.string().required()
})

const performanceSchema = yup.object().shape({
  textarea: yup.string().required()
})

const solutionSchema = yup.object().shape({
  textarea: yup.string().required()
})

const StepperLinearWithValidation = () => {
  // ** States
  const [activeStep, setActiveStep] = useState(0)

  const [value, setValue] = useState('controlled-checked')

  const handleChange = event => {
    setValue(event.target.value)
  }

  // ** Hooks
  const {
    reset: basicReset,
    control: basicControl,
    handleSubmit: handleBasicSubmit,
    formState: { errors: basicErrors }
  } = useForm({
    defaultValues: defaultBasicValues,
    resolver: yupResolver(basicSchema)
  })

  const {
    reset: consistencyReset,
    control: consistencyControl,
    handleSubmit: handleConsistencySubmit,
    formState: { errors: consistencyErrors }
  } = useForm({
    defaultValues: defaultConsistencyValues,
    resolver: yupResolver(consistencySchema)
  })

  const {
    reset: indicatorReset,
    control: indicatorControl,
    handleSubmit: handleIndicatorSubmit,
    formState: { errors: indicatorErrors }
  } = useForm({
    defaultValues: defaultIndicatorValues,
    resolver: yupResolver(indicatorSchema)
  })

  const {
    reset: performanceReset,
    control: performanceControl,
    handleSubmit: handlePerformanceSubmit,
    formState: { errors: performanceErrors }
  } = useForm({
    defaultValues: defaultPerformanceValues,
    resolver: yupResolver(performanceSchema)
  })

  const {
    reset: solutionReset,
    control: solutionControl,
    handleSubmit: handleSolutionSubmit,
    formState: { errors: solutionErrors }
  } = useForm({
    defaultValues: defaultSolutionValues,
    resolver: yupResolver(solutionSchema)
  })

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
    basicReset(0)
    consistencyReset(0)
    indicatorReset(0)
    performanceReset(0)
    solutionReset(0)
  }

  const onSubmit = () => {
    setActiveStep(activeStep + 1)
    if (activeStep === steps.length - 1) {
      toast.success('บันทึกข้อมูลสำเร็จ')
    }
  }

  const getStepContent = step => {
    switch (step) {
      case 0:
        return (
          <form key={0} onSubmit={handleBasicSubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[0].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[0].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Controller
                  name='ovecbureau'
                  control={basicControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      type='text'
                      value={value}
                      label='1.สำนัก/หน่วย/กลุ่ม/ศูนย์'
                      variant='h3'
                      onChange={onChange}
                      placeholder='ดึงจาก login ชื่อสำนัก/หน่วย/กลุ่ม/ศูนย์ และ disabled ไว้'
                      error={Boolean(basicErrors.ovecbureau)}
                      aria-describedby='stepper-linear-ovecbureau'
                      {...(basicErrors.ovecbureau && { helperText: 'จำเป็นต้องระบุข้อมูลนี้' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Controller
                  name='projectname'
                  control={basicControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      type='text'
                      value={value}
                      label='2.ชื่อโครงการ'
                      onChange={onChange}
                      placeholder='ดึงจากชื่อโครงการที่เลือก และ disabled ไว้'
                      error={Boolean(basicErrors.projectname)}
                      aria-describedby='stepper-linear-projectname'
                      {...(basicErrors.projectname && { helperText: 'จำเป็นต้องระบุข้อมูลนี้' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography>การปรับเปลี่ยนโครงการ/กิจกรรม</Typography>
                <RadioGroup row aria-label='controlled' name='controlled' value={value} onChange={handleChange}>
                  <FormControlLabel value='controlled-checked' control={<Radio />} label='มีการปรับเปลี่ยน' />
                  <FormControlLabel value='controlled-unchecked' control={<Radio />} label='ไม่มีการปรับเปลี่ยน' />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Controller
                  name='projectname'
                  control={basicControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      type='text'
                      value={value}
                      label='ปรับเปลี่ยนโครงการ/กิจกรรม เป็น'
                      onChange={onChange}
                      placeholder='ดึงจากชื่อโครงการที่เลือก และ disabled ไว้'
                      error={Boolean(basicErrors.projectname)}
                      aria-describedby='stepper-linear-projectname'
                      {...(basicErrors.projectname && { helperText: 'จำเป็นต้องระบุข้อมูลนี้' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography>3.โครงการ/กิจกรรมตาม</Typography>
                <RadioGroup row aria-label='controlled' name='controlled' value={value} onChange={handleChange}>
                  <FormControlLabel value='controlled-checked' control={<Radio />} label='พ.ร.บ.' />
                  <FormControlLabel value='controlled-unchecked' control={<Radio />} label='ภาระงานปกติ' />
                  <FormControlLabel value='controlled-unchecked' control={<Radio />} label='นโยบายเร่งด่วน/สั่งการ' />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Controller
                  name='monthlyreport'
                  control={basicControl}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      fullWidth
                      type='text'
                      value={value}
                      label='4.รายงานประจำเดือน (ประจำปีงบประมาณ 2566 - ดึงจากฐานข้อมูล)'
                      onChange={onChange}
                      placeholder='ดึงจากระบบตอนสร้างปีงบประมาณอัตโนมัติไม่ต้องกรอกอ้างอิงช่วงเดือนวันที่กรอก และ disabled ไว้'
                      error={Boolean(basicErrors.projectname)}
                      aria-describedby='stepper-linear-monthlyreport'
                      {...(basicErrors.projectname && { helperText: 'จำเป็นต้องระบุข้อมูลนี้' })}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography>5.สถานะโครงการ</Typography>
                <RadioGroup row aria-label='controlled' name='controlled' value={value} onChange={handleChange}>
                  <FormControlLabel value='controlled-checked' control={<Radio />} label='อยู่ระหว่างดำเนินการ' />
                  <FormControlLabel value='controlled-unchecked' control={<Radio />} label='สิ้นสุดโครงการแล้ว' />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='tonal' color='secondary' disabled>
                  ย้อนกลับ
                </Button>
                <Button type='submit' variant='contained'>
                  ถัดไป
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 1:
        return (
          <form key={1} onSubmit={handleConsistencySubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[1].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[1].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Controller
                  name='strategy'
                  control={consistencyControl}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      value={value}
                      label='6.1 ยุทธศาสตร์ชาติ'
                      onChange={onChange}
                      id='stepper-linear-strategy'
                      error={Boolean(consistencyErrors.strategy)}
                      aria-describedby='stepper-linear-strategy-helper'
                      {...(consistencyErrors.strategy && { helperText: 'จำเป็นต้องระบุข้อมูลนี้' })}
                    >
                      <MenuItem value='English'>English</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Controller
                  name='masterplan'
                  control={consistencyControl}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      value={value}
                      label='6.2 แผนแม่บทภายใต้ยุทธศาสตร์ชาติ'
                      onChange={onChange}
                      id='stepper-linear-masterplan'
                      error={Boolean(consistencyErrors.masterplan)}
                      aria-describedby='stepper-linear-masterplan-helper'
                      {...(consistencyErrors.masterplan && { helperText: 'จำเป็นต้องระบุข้อมูลนี้' })}
                    >
                      <MenuItem value='English'>English</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Controller
                  name='subplan'
                  control={consistencyControl}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      value={value}
                      label='6.3 แผนย่อยภายใต้แผนแม่บท'
                      onChange={onChange}
                      id='stepper-linear-subplan'
                      error={Boolean(consistencyErrors.subplan)}
                      aria-describedby='stepper-linear-subplan-helper'
                      {...(consistencyErrors.subplan && { helperText: 'จำเป็นต้องระบุข้อมูลนี้' })}
                    >
                      <MenuItem value='English'>English</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='tonal' color='secondary' onClick={handleBack}>
                  ย้อนกลับ
                </Button>
                <Button type='submit' variant='contained'>
                  ถัดไป
                </Button>
              </Grid>
            </Grid>
          </form>
        )
      case 2:
        return (
          <form key={2} onSubmit={handleConsistencySubmit(onSubmit)}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {steps[2].title}
                </Typography>
                <Typography variant='caption' component='p'>
                  {steps[2].subtitle}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Controller
                  name='strategy'
                  control={indicatorControl}
                  rules={{ required: false }}
                  render={({ field: { value, onChange } }) => (
                    <CustomTextField
                      select
                      fullWidth
                      value={value}
                      label='6.1 ยุทธศาสตร์ชาติ'
                      onChange={onChange}
                      id='stepper-linear-strategy'
                      error={Boolean(consistencyErrors.strategy)}
                      aria-describedby='stepper-linear-strategy-helper'
                      {...(consistencyErrors.strategy && { helperText: 'จำเป็นต้องระบุข้อมูลนี้' })}
                    >
                      <MenuItem value='English'>English</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant='tonal' color='secondary' onClick={handleBack}>
                  ย้อนกลับ
                </Button>
                <Button type='submit' variant='contained'>
                  ถัดไป
                </Button>
              </Grid>
            </Grid>
          </form>
        )

      default:
        return null
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          <Typography>All steps are completed!</Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant='contained' onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Fragment>
      )
    } else {
      return getStepContent(activeStep)
    }
  }

  return (
    <Card>
      <CardContent>
        <StepperWrapper>
          <Stepper activeStep={activeStep}>
            {steps.map((step, index) => {
              const labelProps = {}
              if (index === activeStep) {
                labelProps.error = false
                if (activeStep === 0) {
                  labelProps.error = true
                } else if (activeStep === 1) {
                  labelProps.error = true
                } else if (activeStep === 2) {
                  labelProps.error = true
                } else if (activeStep === 3) {
                  labelProps.error = true
                } else if (activeStep === 4) {
                  labelProps.error = true
                } else {
                  labelProps.error = false
                }
              }

              return (
                <Step key={index}>
                  <StepLabel {...labelProps} StepIconComponent={StepperCustomDot}>
                    <div className='step-label'>
                      <Typography className='step-number'>{`${index + 1}`}</Typography>
                      <div>
                        <Typography className='step-title'>{step.title}</Typography>
                        <Typography className='step-subtitle'>{step.subtitle}</Typography>
                      </div>
                    </div>
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <Divider sx={{ m: '0 !important' }} />

      <CardContent>{renderContent()}</CardContent>
    </Card>
  )
}

export default StepperLinearWithValidation
