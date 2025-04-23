'use client';

import AppBarComponent from '@/components/common/AppBar';
import DrawerComponent from '@/components/common/Drawer';
import { StatCard } from '@/components/common/StatCard';
import { TenantsTable } from '@/components/home/TenantsTable';
import { UsageChart } from '@/components/home/UsageChart';
import { GET_TENANT_USAGE, GET_TENANTS } from '@/graphql/getData';
import { useLazyQuery, useQuery } from '@apollo/client';
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
  useMediaQuery,
  useTheme
} from '@mui/material';
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
  
  useEffect(() => {
    if (selectedTenantId) {
      console.log('Fetching usage data for tenant:', selectedTenantId);
      getTenantUsage({
        variables: {
          id: selectedTenantId.toString() 
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
            {isClient && (
              <Box sx={{ 
                flex: { xs: '1 1 100%', md: '1 1 60%' },
                minHeight: { xs: 250, sm: 300 }
              }}>
                <UsageChart
                  displayDates={displayDates}
                  displayValues={displayValues}
                  isLoading={usageLoading}
                  isMobile={isMobile}
                  selectedTenantId={selectedTenantId}
                />
              </Box>
            )}

            <TenantsTable
              filteredTenants={filteredTenants}
              isLoading={tenantsLoading}
              isMobile={isMobile}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}