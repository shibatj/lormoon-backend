// ** MUI Imports
import MuiBox from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'

// ** Custom Icon Import
import Icon from 'src/@core/components/icon'

// ** Hooks Imports
import useBgColor from 'src/@core/hooks/useBgColor'

// Styled Box component
const Box = styled(MuiBox)(() => ({
  width: 20,
  height: 20,
  borderWidth: 3,
  borderRadius: '50%',
  borderStyle: 'solid'
}))

const StateCustomDot = props => {
  // ** Props
  const { active, completed, error } = props

  // ** Hooks
  const theme = useTheme()
  const bgColors = useBgColor()
  if (error) {
    return <Icon icon='carbon:port-input' fontSize={15} color="#3e9af1" transform='scale(1.5)' />
  } else if (completed) {
    return <Icon icon='tabler:circle-check' fontSize={15} color={theme.palette.primary.main} transform='scale(1.2)' />
  } else {
    return (
      <Box
        sx={{
          borderColor: bgColors.primaryLight.backgroundColor,
          ...(active && {
            borderWidth: 5,
            borderColor: 'primary.main',
            backgroundColor: theme.palette.mode === 'light' ? 'common.white' : 'background.default'
          })
        }}
      />
    )
  }
}

export default StateCustomDot
