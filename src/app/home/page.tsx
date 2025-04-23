// File: app/page.tsx
'use client';

import AppBarComponent from '@/components/common/AppBar';
import DrawerComponent from '@/components/common/Drawer';
import { StatCard } from '@/components/common/StatCard';
import {
  Search as SearchIcon
} from '@mui/icons-material';
import {
  alpha,
  Box,
  InputBase,
  MenuItem,
  Paper,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useEffect, useState } from 'react';

const SearchBox = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

// Types
interface DataPoint {
  date: string;
  value: number;
}

interface Tenant {
  id: number;
  name: string;
  dataUsage: string;
}

// Mock data for different time periods
const generateChartData = (days: number) => {
  const data: DataPoint[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
      value: Math.floor(Math.random() * (1200 - 600) + 600)
    });
  }
  
  return data;
};

const chartDataMap = {
  '7': generateChartData(7),
  '30': generateChartData(30),
  '90': generateChartData(90)
};

const tenants: Tenant[] = [
  { id: 1, name: 'RUDRA', dataUsage: '22.4 GB' },
  { id: 2, name: 'Vashi Office', dataUsage: '34.5 GB' },
  { id: 3, name: 'Station Satcom', dataUsage: '64.2 GB' },
  { id: 4, name: 'Eastaway', dataUsage: '13.2 GB' },
  { id: 5, name: 'NPDL', dataUsage: '76.2 GB' },
  { id: 6, name: 'NDS', dataUsage: '29.3 GB' }
];

const topCards = [
  {
    icon: (
      <svg width="64" height="64" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" />
      <path d="M65 30H30M30 30L40 20M30 30L40 40" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M35 70H70M70 70L60 60M70 70L60 80" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    ),
    title: 'TOTAL DATA EXCHANGED',
    value: '80.4 TB',
    width: { xs: '100%', sm: '100%', md: '32%' },
    backgroundColor: '#4DABF7',
  },
  {
    image: '/Users.svg',
    title: 'HOTSPOT USERS',
    value: '23K/24.2K',
    width: { xs: '100%', sm: '48%', md: '32%' },
  },
  {
    image: '/router.png',
    title: 'ONLINE ROUTERS',
    value: '201/345',
    width: { xs: '100%', sm: '48%', md: '32%' },
  },
];

const bottomCards = [
  {
    image: '/cruise ship.png',
    title: 'FLEETS',
    value: '45',
    width: { xs: '100%', sm: '48%', md: '24%', lg: '24%' },
  },
  {
    image: '/building.png',
    title: 'TENANTS',
    value: '23',
    width: { xs: '100%', sm: '48%', md: '24%', lg: '24%' },
  },
];

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Add client-side only rendering for components that use browser APIs
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [filterDays, setFilterDays] = useState('30');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tenants based on search query
  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get chart data based on selected time period
  const currentChartData = chartDataMap[filterDays as keyof typeof chartDataMap];

  // Prepare data for MUI X-Charts
  const chartDates = currentChartData.map(item => item.date);
  const chartValues = currentChartData.map(item => item.value);

  // Ensure data lengths match for mobile view
  const getFilteredData = (dates: string[], values: number[]) => {
    if (isMobile) {
      // Take every other point for mobile to reduce density
      return {
        dates: dates.filter((_, i) => i % 2 === 0),
        values: values.filter((_, i) => i % 2 === 0)
      };
    }
    return { dates, values };
  };

  const { dates: displayDates, values: displayValues } = getFilteredData(chartDates, chartValues);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBarComponent />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <DrawerComponent />
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            p: { xs: 1, sm: 2, md: 3 }, 
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.primary,
            marginTop: '64px',
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          {/* Top Cards Section */}
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: { xs: 1, sm: 2 }, 
            mb: { xs: 2, sm: 3 } 
          }}>
            {topCards.map((card, index) => (
              <StatCard
                key={index}
                {...card}
              />
            ))}
          </Box>
          
          {/* Bottom Cards and Search Section */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            flexWrap: 'wrap', 
            gap: { xs: 1, sm: 2 },
            mb: { xs: 2, sm: 3 },
            alignItems: { xs: 'stretch', md: 'center' }
          }}>
            {/* Bottom Cards */}
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: { xs: 1, sm: 2 },
              width: { xs: '100%', md: '100%' }
            }}>
              {bottomCards.map((card, index) => (
                <StatCard
                  key={index}
                  {...card}
                />
              ))}
            </Box>

            {/* Search and Filter */}
            {isClient && (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center', 
                gap: { xs: 1, sm: 2 }, 
                mt: { xs: 1, sm: 0 },
                ml: { md: 'auto' }, 
                width: { xs: '100%', md: 'auto' } 
              }}>
                <SearchBox sx={{ width: { xs: '100%', sm: '200px' } }}>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search for Tenant"
                    inputProps={{ 'aria-label': 'search' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </SearchBox>
                
                <Select
                  value={filterDays}
                  onChange={(e) => setFilterDays(e.target.value)}
                  sx={{ 
                    bgcolor: alpha(theme.palette.common.white, 0.1),
                    color: theme.palette.text.primary,
                    borderRadius: 1,
                    height: 40,
                    width: { xs: '100%', sm: '150px' },
                    '.MuiSelect-icon': { color: theme.palette.text.primary },
                    '.MuiOutlinedInput-notchedOutline': { border: 'none' }
                  }}
                >
                  <MenuItem value="7">Last 7 Days</MenuItem>
                  <MenuItem value="30">Last 30 Days</MenuItem>
                  <MenuItem value="90">Last 90 Days</MenuItem>
                </Select>
              </Box>
            )}
          </Box>
          
          {/* Chart and Table Section */}
          <Paper 
            sx={{ 
              bgcolor: theme.palette.background.paper,
              p: { xs: 1, sm: 2, md: 3 }, 
              color: theme.palette.text.primary,
              borderRadius: 2,
              boxShadow: theme.shadows[1],
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 2, md: 4 }
            }}
          >
            {/* Chart Section */}
            {isClient && (
              <Box sx={{ 
                flex: { xs: '1 1 100%', md: '1 1 60%' },
                minHeight: { xs: 250, sm: 300 }
              }}>
                <Box sx={{ 
                  height: { xs: 250, sm: 300 },
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden'
                }}>
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
                    Tenants Data Usage Pattern
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Table Section */}
            <Box sx={{ 
              flex: { xs: '1 1 100%', md: '1 1 40%' }, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 2, 
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  alignSelf: { xs: 'center', md: 'flex-start' }
                }}
              >
                Top Tenants
              </Typography>
              
              <TableContainer sx={{ maxHeight: { xs: 250, sm: 'none' } }}>
                <Table 
                  sx={{ width: '100%' }} 
                  aria-label="tenants table"
                  size={isMobile ? "small" : "medium"}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          padding: isMobile ? '8px 0' : '12px 0',
                          fontSize: isMobile ? '0.75rem' : 'inherit'
                        }}
                      >
                        No.
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          padding: isMobile ? '8px 12px' : '12px 24px',
                          fontSize: isMobile ? '0.75rem' : 'inherit'
                        }}
                      >
                        Name
                      </TableCell>
                      <TableCell 
                        align="right" 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          padding: isMobile ? '8px 0' : '12px 0',
                          fontSize: isMobile ? '0.75rem' : 'inherit'
                        }}
                      >
                        Data Usage
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTenants.map((tenant) => (
                      <TableRow
                        key={tenant.id}
                        sx={{ 
                          '&:last-child td, &:last-child th': { border: 0 },
                          '&:nth-of-type(odd)': { backgroundColor: alpha(theme.palette.common.white, 0.03) },
                          '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.05) }
                        }}
                      >
                        <TableCell 
                          component="th" 
                          scope="row" 
                          sx={{ 
                            color: theme.palette.text.primary,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            padding: isMobile ? '8px 0' : '12px 0',
                            fontSize: isMobile ? '0.75rem' : 'inherit'
                          }}
                        >
                          {tenant.id}
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            color: theme.palette.text.primary,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            padding: isMobile ? '8px 12px' : '12px 24px',
                            fontSize: isMobile ? '0.75rem' : 'inherit'
                          }}
                        >
                          {tenant.name}
                        </TableCell>
                        <TableCell 
                          align="right" 
                          sx={{ 
                            color: theme.palette.text.primary,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            padding: isMobile ? '8px 0' : '12px 0',
                            fontSize: isMobile ? '0.75rem' : 'inherit'
                          }}
                        >
                          {tenant.dataUsage}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}