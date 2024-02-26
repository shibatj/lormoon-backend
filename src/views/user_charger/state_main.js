// ** React Imports
import { Fragment, useState, useContext, useRef } from 'react'
import React from 'react';

import { useRouter } from 'next/router'

import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

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

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'

// ** Custom Components Imports
import StepperCustomDot from './state_customdot'
import AppContext from 'src/@core/components/mui/text-field'

import { ProjectAppContext } from 'src/views/user_charger/state_context'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/mystepper'
import Stepper1 from 'src/views/user_charger/state1_select_charger'
import Stepper2 from 'src/views/user_charger/state2_charging'
import Stepper3 from 'src/views/user_charger/state3_charge_end'

const getUserRole = () => {
  const userData = localStorage.getItem('userData');

  return userData ? JSON.parse(userData).Role : null;
}

const steps = [
  {
    title: <Typography variant="h6" sx={{ fontWeight: 'bold' }}>เตรียม</Typography>,
    subtitle: 'เตรียมความพร้อมการชาร์จ'
  },
  {
    title: <Typography variant="h6" sx={{ fontWeight: 'bold' }}>ชาร์จ</Typography>,
    subtitle: 'กำลังทำการอัดประจุไฟฟ้าไปยังรถจักรยานยนต์'
  },
  {
    title: <Typography variant="h6" sx={{ fontWeight: 'bold' }}>สรุป</Typography>,
    subtitle: 'รายงานสรุปการชาร์จ'
  },
]

const StepperMain = () => {
  const projectData = useContext(ProjectAppContext)

  const router = useRouter()

  // ** States
  const [activeStep, setActiveStep] = useState(0)

  const [hoveredStep, setHoveredStep] = useState(null);

  const stepperRefs = useRef([React.createRef(), React.createRef(), React.createRef()]);


  const onSubmit = () => {

    if (activeStep==0)
      setActiveStep(1)

      if (activeStep==1)
      setActiveStep(2)

      if (activeStep==2)
      setActiveStep(0)
  }



  const handleReset = () => {
    setActiveStep(0)
  }


  const handleClick = (index) => {
   // setActiveStep(index);
  };

  const getStepContent = step => {
    switch (step) {
      case 0:
        return <Stepper1 title={steps[0].title} subtitle={steps[0].subtitle} onStepSubmit={onSubmit}    ref={stepperRefs.current[0]} />
      case 1:
        return (
          <Stepper2
            title={steps[1].title}
            subtitle={steps[1].subtitle}
            onStepSubmit={onSubmit} 
            ref={stepperRefs.current[1]}
          />
        )
      case 2:
        return (
          <Stepper3
            title={steps[2].title}
            subtitle={steps[2].subtitle}
            onStepSubmit={onSubmit} 
            ref={stepperRefs.current[2]}
          />
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
    <Card  sx={{ p: 0,mt:-5 }}>
      <CardContent sx={{ p: 4 }}>
        <StepperWrapper>
          <Stepper activeStep={activeStep} orientation="horizontal">
            {steps.map((step, index) => {
              const labelProps = {
                onClick: () => handleClick(index),
                onMouseEnter: () => setHoveredStep(index),
                onMouseLeave: () => setHoveredStep(null),
                style: { cursor: 'pointer', backgroundColor: hoveredStep === index ? '#eee' : 'transparent' }
              };

              if (index === activeStep) {
                labelProps.error = true;
              }

              return (
                <Step key={index}><StepLabel {...labelProps} StepIconComponent={StepperCustomDot}>
                        <Typography className='step-title'>{step.title}</Typography>
  
                  </StepLabel>
                </Step>
              )
            })}
          </Stepper>
        </StepperWrapper>
      </CardContent>

      <Divider sx={{ m: '0 !important' }} />

      <CardContent  sx={{ p: 0 }}>{renderContent()}</CardContent>
    </Card>
  )
}

export default StepperMain
