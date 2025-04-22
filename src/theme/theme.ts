import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0ab4ff',
      light: '#3dc3ff',
      dark: '#007ecc',
    },
    background: {
      default: '#0e0e10',
      paper: 'rgba(20, 22, 26, 0.8)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0e0e10',
          minHeight: '100vh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(145deg, rgba(15, 17, 21, 0.9), rgba(20, 22, 26, 0.9))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
        contained: {
          background: 'linear-gradient(135deg, #0ab4ff 0%, #0099ff 100%)',
          boxShadow: 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #0ab4ff 20%, #0099ff 100%)',
            boxShadow: '0 0 20px rgba(10, 180, 255, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            backgroundColor: 'rgba(28, 28, 36, 0.8)',
            backdropFilter: 'blur(5px)',
            '&:hover': {
              backgroundColor: 'rgba(28, 28, 36, 0.9)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(28, 28, 36, 0.9)',
            },
          },
        },
      },
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
    },
  },
}); 