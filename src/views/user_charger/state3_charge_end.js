import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import axios from 'axios';

import  { forwardRef, useImperativeHandle } from 'react';

import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Config
import authConfig from 'src/configs/auth'

import ReactApexcharts from 'src/@core/components/react-apexcharts'
import { useTheme } from '@mui/material/styles'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const getAccountID = () => {
  const userData = localStorage.getItem('userData');

  return userData ? JSON.parse(userData).UserID : null;
}

const state3_charge_end = forwardRef(({ onStepSubmit }, ref) => {

  const [chargeDuration, setChargeDuration] = useState(0);
  const [chargeKw, setChargeKw] = useState(0.00);
  const [moneyUsed, setMoneyUsed] = useState(0.00);
  const [moneyRemained, setMoneyRemained] = useState(0.00);
  const [isEnd, setIsEnd] = useState(false);

  const [chartKey, setChartKey] = useState(Date.now());

  const hours = Math.floor(chargeDuration / 3600);
  const minutes = Math.floor((chargeDuration % 3600) / 60);
  const seconds = Math.floor(chargeDuration % 60);
  const durationText = `${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;
  const [chartSeries, setChartSeries] = useState([100]); // Initialize with default value


  const fetchChargingStatus = async () => {
    try {
      const response = await axios.get(authConfig.lormoonApiUrl + 'charging_status_info', {
        params: { AccountID: getAccountID() }
      });
      const data = response.data;

      //console.log(data)

      setChargeDuration(data.ChargeDuration);

      setMoneyUsed(parseFloat(data.MoneyUsed) || 0.00);
      setMoneyRemained(parseFloat(data.MoneyRemained) || 0.00); // Add this if you have a state for MoneyRemained
      setChargeKw(parseFloat(data.ChargeKw) || 0.00);
      setIsEnd(data.IsEnd);

      setChartOptions(prevOptions => ({
        ...prevOptions,
        labels: [`${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`], // อัพเดท labels
        plotOptions: {
          ...prevOptions.plotOptions,
          radialBar: {
            ...prevOptions.plotOptions.radialBar,
            dataLabels: {
              ...prevOptions.plotOptions.radialBar.dataLabels,
              value: {
                ...prevOptions.plotOptions.radialBar.dataLabels.value,
                formatter: value => `${chargeKw.toFixed(4)} กิโลวัตต์` // อัพเดท formatter
              }
            }
          }
        }
      }));

      setChartKey(Date.now());
      if (chartSeries[0]==100)
      {
        setChartSeries([99]);
        console.log("set series 99")
      }
      else
      {
        setChartSeries([100]);
        console.log("set series 100")

      }

    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };

  useEffect(() => {
    fetchChargingStatus();
  }, []);

  useEffect(() => {
    // Update chart options here
    setChartOptions(prevOptions => ({
      ...prevOptions,
      labels: [`${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`], // อัพเดท labels
      plotOptions: {
        ...prevOptions.plotOptions,
        radialBar: {
          ...prevOptions.plotOptions.radialBar,
          dataLabels: {
            ...prevOptions.plotOptions.radialBar.dataLabels,
            value: {
              ...prevOptions.plotOptions.radialBar.dataLabels.value,
              formatter: value => `${chargeKw.toFixed(4)} กิโลวัตต์` // อัพเดท formatter
            }
          }
        }
      }
    }));

    setChartKey(Date.now());
  }, [chargeDuration, chargeKw, moneyUsed, moneyRemained]);

  // ** Hook
  const theme = useTheme()



  const options = {
    chart: {
      sparkline: { enabled: true }
    },
    stroke: { dashArray: 10 },
    labels: [durationText],
    colors: [hexToRGBA(theme.palette.primary.main, 1),hexToRGBA(theme.palette.primary.main, 1)],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        opacityTo: 0.5,
        opacityFrom: 1,
        shadeIntensity: 0.5,
        stops: [30, 70, 100],
        inverseColors: false,
        gradientToColors: [theme.palette.primary.main]
      }
    },
    plotOptions: {
      radialBar: {
        endAngle: 180,
        startAngle: -170,
        hollow: { size: '60%' },
        track: { background: 'transparent' },
        dataLabels: {
          name: {
            offsetY: -10,
            color: theme.palette.text.disabled,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.h4.fontSize 
          },
          value: {
            show:true,
            offsetY: 15,
            fontWeight: 100,
            formatter: value => `${chargeKw.toFixed(4)} กิโลวัตต์`,
            color: theme.palette.text.primary,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.h4.fontSize
          }
        }
      }
    },
    grid: {
      padding: {
        top: -30,
        bottom: 12
      }
    },
    responsive: [
      {
        breakpoint: 1300,
        options: {
          grid: {
            padding: {
              left: 22
            }
          }
        }
      },
      {
        breakpoint: theme.breakpoints.values.md,
        options: {
          grid: {
            padding: {
              left: 0
            }
          }
        }
      }
    ]
  }

  const [chartOptions, setChartOptions] = useState(options);

  const handleGoSelectCharger = async () => {
    try {

      onStepSubmit()

    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }
  };  

  return (
    <Card>

      <CardContent>
              <Box
    sx={{
      display: 'flex', // ใช้ Flexbox
      flexDirection: 'column', // เรียงเนื้อหาในแนวตั้ง
      justifyContent: 'center', // จัดกึ่งกลางในแนวตั้ง
      alignItems: 'center', // จัดกึ่งกลางในแนวนอน
      width: '100%',
      padding: 0,
      margin: '0px'
    }}
          >


          <ReactApexcharts key={chartKey} type='radialBar' height={325} options={chartOptions} series={chartSeries} />
          <Typography variant="h3" component="h2" sx={{
              marginTop: 3,
              marginBottom:1
            }}>
            ค่าบริการ {moneyUsed.toFixed(2)} บาท
          </Typography>          
          <Typography variant="h3" component="h2" sx={{
              marginTop: 3,
              marginBottom:1
            }}>
            เงินคงเหลือ {moneyRemained.toFixed(2)} บาท
          </Typography>          

        </Box>
      </CardContent>

      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: 0,
            margin: '0px'
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<Icon icon='material-symbols:ev-charger-sharp' />}
            sx={{ width: '95%', borderRadius: '4px' }} // Square buttons
            onClick={() => handleGoSelectCharger()}
          >
            กลับสู่หน้าแรก
          </Button>
        </Box>
      </CardContent>

    </Card>
  );
});

export default state3_charge_end
