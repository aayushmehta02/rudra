import { Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { StyledPaper } from './StyledComponents';

interface StatCardProps {
  title: string;
  value: string;
  width?: { xs?: string; sm?: string; md?: string };
  icon?: React.ReactNode;
  backgroundColor?: string;
  image?: string | React.ReactNode;
}

export const StatCard = ({ title, value, width = { xs: '100%', sm: '30%' }, icon, image }: StatCardProps) => {
  const theme = useTheme();
  
  const renderImage = () => {
    if (!image) return icon;
    if (typeof image === 'string') {
      return <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />;
    }
    return image;
  };

  return (
    <StyledPaper sx={{ 
      width, 
      backgroundColor: '#4984B5',
      display: 'flex',
      alignItems: 'center',
      padding: '24px',
      gap: 3
    }}>
      {/* Icon/Image Container */}
      <Box sx={{ 
        minWidth: '48px',
        minHeight: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {renderImage()}
      </Box>

      {/* Content Container */}
      <Box sx={{ flex: 1 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: alpha(theme.palette.common.white, 0.7),
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            display: 'block',
            mb: 0.5
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="h4" 
          sx={{ 
            color: theme.palette.common.white,
            fontWeight: 600,
            fontSize: '1.75rem'
          }}
        >
          {value}
        </Typography>
      </Box>
    </StyledPaper>
  );
}; 