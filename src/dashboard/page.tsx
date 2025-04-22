// File: app/page.tsx
'use client';

import DrawerComponent from '@/components/common/Drawer';
import {
    AccountCircle,
    Group as AdminsIcon,
    Assignment as AuditIcon,
    Payment as BillingIcon,
    Business as BusinessIcon,
    ChevronRight,
    Dashboard as DashboardIcon,
    Security as FirewallIcon,
    DirectionsBoat as FleetIcon,
    Wifi as HotspotIcon,
    Router as RouterIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import {
    alpha,
    Box,
    CssBaseline,
    IconButton,
    InputBase,
    MenuItem,
    AppBar as MuiAppBar,
    Paper,
    Select,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Toolbar,
    Typography,
    useTheme
} from '@mui/material';
import { useState } from 'react';
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
// Define styled components
const drawerWidth = 210;

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: '#0d1421',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#2a4465',
  color: 'white',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
}));

const StyledButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#2a4465',
  color: 'white',
  '&:hover': {
    backgroundColor: '#3a5475',
  },
  marginTop: theme.spacing(2),
  width: '80%',
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1),
  justifyContent: 'flex-start',
}));

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

// Mock data
const chartData: DataPoint[] = [
  { date: '05 Mar', value: 800 },
  { date: '06 Mar', value: 900 },
  { date: '07 Mar', value: 1000 },
  { date: '08 Mar', value: 1100 },
  { date: '09 Mar', value: 1050 },
  { date: '10 Mar', value: 900 },
  { date: '11 Mar', value: 600 }
];

const tenants: Tenant[] = [
  { id: 1, name: 'RUDRA', dataUsage: '22.4 GB' },
  { id: 2, name: 'Vashi Office', dataUsage: '34.5 GB' },
  { id: 3, name: 'Station Satcom', dataUsage: '64.2 GB' },
  { id: 4, name: 'Eastaway', dataUsage: '13.2 GB' },
  { id: 5, name: 'NPDL', dataUsage: '76.2 GB' },
  { id: 6, name: 'NDS', dataUsage: '29.3 GB' }
];

// Navigation items
const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, selected: true },
  { text: 'Tenants', icon: <BusinessIcon /> },
  { text: 'Fleets', icon: <FleetIcon /> },
  { text: 'Routers', icon: <RouterIcon /> },
  { text: 'Firewall Templates', icon: <FirewallIcon /> },
  { text: 'Hotspot Users', icon: <HotspotIcon /> },
  { text: 'Audit Trail', icon: <AuditIcon /> },
  { text: 'Billing', icon: <BillingIcon /> },
  { text: 'Admins', icon: <AdminsIcon /> }
];

export default function Dashboard() {
  const theme = useTheme();
  const [filterDays, setFilterDays] = useState('30');
  
  return (
    <Box sx={{ display: 'flex', bgcolor: '#111827', minHeight: '100vh' }}>
    <DrawerComponent/>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Typography component="span" sx={{ color: 'white', fontWeight: 'bold' }}>future</Typography>
            <Typography component="span" sx={{ color: '#4299e1', fontWeight: 'bold' }}>konnect</Typography>
          </Typography>
          <Typography color="white" sx={{ mr: 1 }}>John doe</Typography>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
          >
            <AccountCircle sx={{ color: '#f56565' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      
  
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          bgcolor: '#111827',
          color: 'white',
          marginTop: '64px'
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          {/* Total Data Exchanged Card */}
          <StyledPaper sx={{ width: { xs: '100%', sm: '30%' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ mr: 2 }}>
                <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ display: 'block', mb: 1 }}>
                  TOTAL DATA EXCHANGED
                </Typography>
                <Typography variant="h4" color="white">
                  80.4 TB
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </IconButton>
            </Box>
          </StyledPaper>
          
          {/* Hotspot Users Card */}
          <StyledPaper sx={{ width: { xs: '100%', sm: '30%' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ mr: 2 }}>
                <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ display: 'block', mb: 1 }}>
                  HOTSPOT USERS
                </Typography>
                <Typography variant="h4" color="white">
                  23K/24.2K
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <ChevronRight />
              </IconButton>
            </Box>
          </StyledPaper>
          
          {/* Online Routers Card */}
          <StyledPaper sx={{ width: { xs: '100%', sm: '30%' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ mr: 2 }}>
                <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ display: 'block', mb: 1 }}>
                  ONLINE ROUTERS
                </Typography>
                <Typography variant="h4" color="white">
                  201/345
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <ChevronRight />
              </IconButton>
            </Box>
          </StyledPaper>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          {/* Fleets Card */}
          <StyledPaper sx={{ width: { xs: '100%', sm: '48%', md: '24%' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ mr: 2 }}>
                <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ display: 'block', mb: 1 }}>
                  FLEETS
                </Typography>
                <Typography variant="h4" color="white">
                  45
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <ChevronRight />
              </IconButton>
            </Box>
          </StyledPaper>
          
          {/* Tenants Card */}
          <StyledPaper sx={{ width: { xs: '100%', sm: '48%', md: '24%' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box sx={{ mr: 2 }}>
                <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ display: 'block', mb: 1 }}>
                  TENANTS
                </Typography>
                <Typography variant="h4" color="white">
                  23
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                <ChevronRight />
              </IconButton>
            </Box>
          </StyledPaper>

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
              />
            </SearchBox>
            
            <Select
              value={filterDays}
              onChange={(e) => setFilterDays(e.target.value)}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.1)', 
                color: 'white',
                borderRadius: 1,
                height: 40,
                '.MuiSelect-icon': { color: 'white' },
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
            bgcolor: '#1a2332', 
            p: 3, 
            color: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Box sx={{ height: 300, mb: 4 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'white' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <YAxis 
                  tick={{ fill: 'white' }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickFormatter={(value) => `${value}.00`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#2a4465', color: 'white', border: 'none' }}
                  labelStyle={{ color: 'white' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4299e1" 
                  strokeWidth={2}
                  dot={{ fill: '#4299e1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <Typography variant="caption" align="center" sx={{ display: 'block', mt: 1 }}>
              Tenants Data Usage Pattern
            </Typography>
          </Box>
          
          <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>Top Tenants</Typography>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="tenants table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>No.</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Name</TableCell>
                  <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Data Usage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow
                    key={tenant.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:nth-of-type(odd)': { backgroundColor: 'rgba(255,255,255,0.03)' },
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      {tenant.id}
                    </TableCell>
                    <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{tenant.name}</TableCell>
                    <TableCell align="right" sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{tenant.dataUsage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
}