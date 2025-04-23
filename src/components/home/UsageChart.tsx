import { alpha, Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

interface UsageChartProps {
  displayDates: string[];
  displayValues: number[];
  isLoading: boolean;
  isMobile: boolean;
  selectedTenantId: string | null;
}

export const UsageChart = ({ displayDates, displayValues, isLoading, isMobile, selectedTenantId }: UsageChartProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      height: { xs: 250, sm: 300 },
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {isLoading ? (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CircularProgress />
        </Box>
      ) : displayDates.length > 0 ? (
        <>
          <LineChart
            xAxis={[{ 
              data: displayDates,
              scaleType: 'point',
              tickLabelStyle: {
                fill: theme.palette.text.primary,
                fontSize: isMobile ? 10 : 12
              }
            }]}
            yAxis={[{
              tickLabelStyle: {
                fill: theme.palette.text.primary,
                fontSize: isMobile ? 10 : 12
              }
            }]}
            series={[
              {
                data: displayValues,
                area: true,
                color: theme.palette.primary.main,
                showMark: false,
                curve: "linear"
              }
            ]}
            height={isMobile ? 250 : 300}
            margin={{
              left: isMobile ? 40 : 50,
              right: isMobile ? 10 : 20,
              top: isMobile ? 10 : 20,
              bottom: isMobile ? 30 : 40
            }}
            sx={{
              '.MuiLineElement-root': {
                strokeWidth: 2,
              },
              '.MuiAreaElement-root': {
                fill: `${alpha(theme.palette.primary.main, 0.1)}`,
              }
            }}
          />
          <Typography 
            variant="caption" 
            align="center" 
            sx={{ 
              display: 'block', 
              mt: 1, 
              color: theme.palette.text.secondary 
            }}
          >
            Data Usage Over Time (GB)
          </Typography>
        </>
      ) : (
        <Box sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}>
          <Typography color="text.secondary">
            No usage data available
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Selected Tenant ID: {selectedTenantId || 'None'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}; 