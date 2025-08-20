import { createTheme } from '@mui/material/styles'

const getThemeConfigs = (language: string) => {
  const isRtl = ['fr'].includes(language)
  const fontFamily = isRtl
    ? 'Vazirmatn, sans-serif'
    : '"Roboto", "Helvetica", "Arial", sans-serif'
  return createTheme({
    direction: isRtl ? 'rtl' : 'ltr',
    typography: {
      fontFamily,
      fontSize: 14,
    },
    palette: {
      primary: {
        main: '#FF9800',
        contrastText: '#fff',
      },
      secondary: {
        main: '#dc004e',
        contrastText: '#fff',
      },
    },
  })
}


export default getThemeConfigs