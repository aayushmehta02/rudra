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
  useTheme
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { useState } from 'react';




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
    width: { xs: '100%', sm: '30%' },
    backgroundColor: '#4DABF7',
  },
  {
    image: '/Users.svg',
    title: 'HOTSPOT USERS',
    value: '23K/24.2K',
    width: { xs: '100%', sm: '30%' },
  },
  {
    image: '/router.png',
    title: 'ONLINE ROUTERS',
    value: '201/345',
    width: { xs: '100%', sm: '30%' },
  },
];

const bottomCards = [
  {
    image: '/cruise ship.png',
    title: 'FLEETS',
    value: '45',
    width: { xs: '100%', sm: '48%', md: '24%' },
  },
  {
    image: '/building.png',
    title: 'TENANTS',
    value: '23',
    width: { xs: '100%', sm: '48%', md: '24%' },
  },
];

// Navigation items


export default function Dashboard() {
  const theme = useTheme();
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBarComponent />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <DrawerComponent />
        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            bgcolor: theme.palette.background.default,
            color: theme.palette.text.primary,
            marginTop: '64px',
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            {topCards.map((card, index) => (
              <StatCard
                key={index}
                {...card}
              />
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            {bottomCards.map((card, index) => (
              <StatCard
                key={index}
                {...card}
              />
            ))}

            {/* Search and Filter */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              ml: 'auto', 
              width: { xs: '100%', sm: '48%', md: 'auto' } 
            }}>
              <SearchBox>
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
                  '.MuiSelect-icon': { color: theme.palette.text.primary },
                  '.MuiOutlinedInput-notchedOutline': { border: 'none' }
                }}
              >
                <MenuItem value="7">Last 7 Days</MenuItem>
                <MenuItem value="30">Last 30 Days</MenuItem>
                <MenuItem value="90">Last 90 Days</MenuItem>
              </Select>
            </Box>
          </Box>
          
          {/* Chart and Table Section */}
          <Paper 
            sx={{ 
              bgcolor: theme.palette.background.paper,
              p: 3, 
              color: theme.palette.text.primary,
              borderRadius: 2,
              boxShadow: theme.shadows[1],
              display: 'flex',
              gap: 4
            }}
          >
            {/* Chart Section */}
            <Box sx={{ flex: '1 1 60%' }}>
              <Box sx={{ height: 300 }}>
                <LineChart
                  xAxis={[{ 
                    data: chartDates,
                    scaleType: 'point',
                    tickLabelStyle: {
                      fill: theme.palette.text.primary,
                    }
                  }]}
                  yAxis={[{
                    tickLabelStyle: {
                      fill: theme.palette.text.primary,
                    }
                  }]}
                  series={[
                    {
                      data: chartValues,
                      area: true,
                      color: theme.palette.primary.main,
                      showMark: true,
                      curve: "linear"
                    }
                  ]}
                  height={300}
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

            {/* Table Section */}
            <Box sx={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <TableContainer>
                <Table sx={{ width: '100%' }} aria-label="tenants table">
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          padding: '12px 0'
                        }}
                      >
                        No.
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          padding: '12px 24px'
                        }}
                      >
                        Name
                      </TableCell>
                      <TableCell 
                        align="right" 
                        sx={{ 
                          color: theme.palette.text.secondary,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          padding: '12px 0'
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
                            padding: '12px 0'
                          }}
                        >
                          {tenant.id}
                        </TableCell>
                        <TableCell 
                          sx={{ 
                            color: theme.palette.text.primary,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            padding: '12px 24px'
                          }}
                        >
                          {tenant.name}
                        </TableCell>
                        <TableCell 
                          align="right" 
                          sx={{ 
                            color: theme.palette.text.primary,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            padding: '12px 0'
                          }}
                        >
                          {tenant.dataUsage}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}> 
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 2, 
                      color: theme.palette.text.primary,
                      fontWeight: 500
                    }}
                  >
                    Top Tenants
                  </Typography>
                </Box>
              </TableContainer>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}