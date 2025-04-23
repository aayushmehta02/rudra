// src/theme.ts
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4299e1',
      light: '#63b3ed',
      dark: '#2b6cb0',
    },
    background: {
      default: '#111827',
      paper: '#1a2332',
    },
    
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    action: {
      hover: '#4DABF7',
    },
    divider: 'rgba(255, 255, 255, 0.05)',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#111827',
          minHeight: '100vh',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1a2332',
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
          background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
          boxShadow: 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #63b3ed 0%, #4299e1 100%)',
            boxShadow: '0 0 20px rgba(66, 153, 225, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            backgroundColor: 'rgba(26, 32, 44, 0.8)',
            backdropFilter: 'blur(5px)',
            '&:hover': {
              backgroundColor: 'rgba(26, 32, 44, 0.9)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(26, 32, 44, 0.9)',
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: 'rgba(255, 255, 255, 0.7)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
        body: {
          color: '#ffffff',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#111827',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
          '& .MuiListItemButton-root': {
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
          },
          '& .MuiListItemIcon-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiListItemText-primary': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },
});
