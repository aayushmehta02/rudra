// File: app/page.tsx
'use client';

import AppBarComponent from '@/components/common/AppBar';
import DrawerComponent from '@/components/common/Drawer';
import { StatCard } from '@/components/common/StatCard';
import { GET_TENANT_USAGE, GET_TENANTS } from '@/graphql/getData';
import { useLazyQuery, useQuery } from '@apollo/client';
import {
  Search as SearchIcon
} from '@mui/icons-material';
import {
  alpha,
  Box,
  CircularProgress,
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
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

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
interface TenantUsage {
  usage_time: string;
  data_usage_gb: number;
}

interface Tenant {
  id: string;
  name: string;
  data_usage_gb: number;
}




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
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);

  // Fetch tenants data
  const { data: tenantsData, loading: tenantsLoading } = useQuery(GET_TENANTS, {
    fetchPolicy: 'cache-and-network'
  });

  // Fetch tenant usage data
  const [getTenantUsage, { data: usageData, loading: usageLoading }] = useLazyQuery(GET_TENANT_USAGE);
  const total_data_exchanged = usageData?.tenant_data_usage_daily?.reduce((acc: number, curr: TenantUsage) => acc + curr.data_usage_gb, 0);
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
      value: (total_data_exchanged/1000).toFixed(2) + ' TB',
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
      value: tenantsData?.tenants?.length,
      width: { xs: '100%', sm: '48%', md: '24%', lg: '24%' },
    },
  ];
  // Effect to fetch usage data when tenant is selected
  useEffect(() => {
    if (selectedTenantId) {
      console.log('Fetching usage data for tenant:', selectedTenantId);
      getTenantUsage({
        variables: {
          id: selectedTenantId.toString() // Ensure ID is string
        }
      });
    }
  }, [selectedTenantId, getTenantUsage]);

  // Set initial selected tenant
  useEffect(() => {
    if (tenantsData?.tenants?.length > 0 && !selectedTenantId) {
      const firstTenantId = tenantsData.tenants[0].id;
      console.log('Setting initial tenant:', firstTenantId);
      setSelectedTenantId(firstTenantId);
    }
  }, [tenantsData, selectedTenantId]);

  // Filter and sort tenants
  const filteredTenants = useMemo(() => {
    if (!tenantsData?.tenants) return [];
    
    return tenantsData.tenants
      .filter((tenant: Tenant) =>
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a: Tenant, b: Tenant) => b.data_usage_gb - a.data_usage_gb);
  }, [tenantsData, searchQuery]);

  // Process usage data for chart
  const chartData = useMemo(() => {
    console.log('Usage data received:', usageData);
    console.log("total usage data", usageData?.tenant_data_usage_daily?.reduce((acc: number, curr: TenantUsage) => acc + curr.data_usage_gb, 0));
    
    if (!usageData?.tenant_data_usage_daily) {
      console.log('No usage data available');
      return { dates: [], values: [] };
    }

    const daysToShow = parseInt(filterDays);
    const now = dayjs();
    const startDate = now.subtract(daysToShow, 'day');

    const filteredData = usageData.tenant_data_usage_daily
      .filter((usage: TenantUsage) => {
        const usageDate = dayjs(usage.usage_time);
        return usageDate.isAfter(startDate);
      })
      .sort((a: TenantUsage, b: TenantUsage) => 
        dayjs(a.usage_time).valueOf() - dayjs(b.usage_time).valueOf()
      );

    console.log('Filtered data:', filteredData);

    return {
      dates: filteredData.map((usage: TenantUsage) => 
        dayjs(usage.usage_time).format('DD/MM')
      ),
      values: filteredData.map((usage: TenantUsage) => usage.data_usage_gb)
    };
  }, [usageData, filterDays]);

  // Get filtered data for mobile view
  const getFilteredChartData = (dates: string[], values: number[]) => {
    if (isMobile) {
      // Take every other point for mobile to reduce density
      return {
        dates: dates.filter((_, i) => i % 2 === 0),
        values: values.filter((_, i) => i % 2 === 0)
      };
    }
    return { dates, values };
  };

  const { dates: displayDates, values: displayValues } = getFilteredChartData(
    chartData.dates,
    chartData.values
  );

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
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {usageLoading ? (
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
                    {tenantsLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                          <CircularProgress size={40} />
                        </TableCell>
                      </TableRow>
                    ) : filteredTenants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No tenants found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTenants.map((tenant: Tenant, index: number) => (
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
                            {index + 1}
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
                            {tenant.data_usage_gb.toFixed(1)} GB
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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