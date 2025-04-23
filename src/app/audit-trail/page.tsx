// File: app/audit-trail/page.tsx
'use client';

import Filters from '@/components/audit/Filters';
import AppBarComponent from '@/components/common/AppBar';
import DrawerComponent from '@/components/common/Drawer';
import {
    FileDownload as DownloadIcon,
    ExpandMore as ExpandIcon,
    FirstPage,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage,
} from '@mui/icons-material';
import {
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
    useTheme
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';

// Types
interface AuditLog {
  id: number;
  time: string;
  description: React.ReactNode;
  event: 'Create' | 'Delete' | 'Update' | 'Download';
  category: string;
  performedBy: string;
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

// Constants
const EVENT_COLORS = {
  Create: '#2f855a',
  Delete: '#e53e3e',
  Update: '#3182ce',
  Download: '#6b46c1'
} as const;

// Sample Data
const auditLogs: AuditLog[] = [
  {
    id: 1,
    time: '11/02/24, 02:33 PM',
    description: <>Admin user <strong>Roshani Agarwal</strong> with the role <strong>Tenant Admin</strong> was created</>,
    event: 'Create',
    category: 'Admin',
    performedBy: 'Fletcher Fernandes'
  },
  {
    id: 2,
    time: '11/02/24, 01:52 PM',
    description: <>A firewall rule allowing traffic from IP addresses to be accepted was created.</>,
    event: 'Create',
    category: 'Firewall Rule',
    performedBy: 'Sachin Gowda'
  },
  {
    id: 3,
    time: '11/02/24, 01:23 PM',
    description: <>Certificate downloaded for router <strong>Tranquil Sea</strong></>,
    event: 'Download',
    category: 'Router Certificate',
    performedBy: 'Mukesh Sai Kumar'
  },
  {
    id: 4,
    time: '11/02/24, 01:11 PM',
    description: <>Hotspot user <strong>JohnDoe</strong> was deleted from router <strong>Minstrim</strong> [HC00R3QN5NR]</>,
    event: 'Delete',
    category: 'Hotspot User',
    performedBy: 'Vishal Dubey'
  },
  {
    id: 5,
    time: '11/02/24, 01:01 PM',
    description: <>Firewall template <strong>Duolog</strong> was deleted</>,
    event: 'Delete',
    category: 'Firewall Template',
    performedBy: 'Vishal Dubey'
  },
  {
    id: 6,
    time: '11/02/24, 12:58 PM',
    description: <>New router <strong>RUDRA23</strong> [FF044QN5NF] was created</>,
    event: 'Update',
    category: 'Router',
    performedBy: 'Karan Sajnani'
  },
  {
    id: 7,
    time: '11/02/24, 12:58 PM',
    description: <>New router <strong>RUDRA23</strong> [FF044QN5NF] was created</>,
    event: 'Create',
    category: 'Router',
    performedBy: 'Karan Sajnani'
  },
  {
    id: 8,
    time: '11/02/24, 12:58 PM',
    description: <>New router <strong>RUDRA23</strong> [FF044QN5NF] was created</>,
    event: 'Create',
    category: 'Router',
    performedBy: 'Karan Sajnani'
  }
];

// Components
const TablePaginationActions: React.FC<TablePaginationActionsProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange
}) => {
  return (
    <Box sx={{ flexShrink: 0, ml: 2.5, display: 'flex' }}>
      <IconButton
        onClick={(e) => onPageChange(e, 0)}
        disabled={page === 0}
        sx={{ color: 'white' }}
      >
        <FirstPage />
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
        sx={{ color: 'white' }}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        mx: 2,
        minWidth: '30px', 
        color: 'white',
        borderRadius: '50%',
        bgcolor: '#2a4465'
      }}>
        {page + 1}
      </Box>
      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        sx={{ color: 'white' }}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={(e) => onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        sx={{ color: 'white' }}
      >
        <LastPage />
      </IconButton>
    </Box>
  );
};

// Main Component
export default function AuditTrail() {
  const theme = useTheme();

  // States
  const [filters, setFilters] = useState({
    category: '',
    actions: [] as string[],
    user: '',
    fromDate: null as dayjs.Dayjs | null,
    toDate: null as dayjs.Dayjs | null
  });

  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10
  });

  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  // Handlers
  const handleActionChange = (action: string) => {
    setFilters(prev => ({
      ...prev,
      actions: prev.actions.includes(action)
        ? prev.actions.filter(a => a !== action)
        : [...prev.actions, action]
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      actions: [],
      user: '',
      fromDate: null,
      toDate: null
    });
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination({
      page: 0,
      rowsPerPage: parseInt(event.target.value, 10)
    });
  };

  const toggleRowExpansion = (id: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filtered and paginated data
  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      if (filters.category && log.category !== filters.category) return false;
      if (filters.actions.length > 0 && !filters.actions.includes(log.event)) return false;
      if (filters.user && !log.performedBy.toLowerCase().includes(filters.user.toLowerCase())) return false;
      
      if (filters.fromDate || filters.toDate) {
        const logDate = dayjs(log.time, 'DD/MM/YY, hh:mm A');
        if (filters.fromDate && logDate.isBefore(filters.fromDate, 'day')) return false;
        if (filters.toDate && logDate.isAfter(filters.toDate, 'day')) return false;
      }

      return true;
    });
  }, [filters]);

  const paginatedLogs = filteredLogs.slice(
    pagination.page * pagination.rowsPerPage,
    pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
  );

  // Render
  return (
    <Box sx={{ display: 'flex', bgcolor: '#0d1421', minHeight: '100vh', p: 3 }}>
      <AppBarComponent />
      <DrawerComponent />
      <Box sx={{ width: '100%' }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h4" color="white" fontWeight="bold">
            Audit Trail
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<DownloadIcon />}
            sx={{ 
              color: 'white', 
              borderColor: 'rgba(255,255,255,0.3)',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Download log
          </Button>
        </Box>

        {/* Main Content */}
        <Box sx={{ display: 'flex', gap: 3 }}>
          {/* Filters */}
          <Filters
            selectedCategory={filters.category}
            selectedActions={filters.actions}
            searchUser={filters.user}
            fromDate={filters.fromDate}
            toDate={filters.toDate}
            onCategoryChange={(category) => setFilters(prev => ({ ...prev, category }))}
            onActionChange={handleActionChange}
            onSearchUserChange={(user) => setFilters(prev => ({ ...prev, user }))}
            onFromDateChange={(date) => setFilters(prev => ({ ...prev, fromDate: date }))}
            onToDateChange={(date) => setFilters(prev => ({ ...prev, toDate: date }))}
            onClearFilters={handleClearFilters}
          />

          {/* Table */}
          <Paper sx={{ 
            flexGrow: 1, 
            bgcolor: '#1a2332', 
            color: 'white',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <TableCell width="40px" sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}></TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Time</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Description</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Event</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Category</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.7)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Performed By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: '#183b65' },
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                      }}
                    >
                      <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)', p: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => toggleRowExpansion(log.id)}
                          sx={{ color: 'white' }}
                        >
                          <ExpandIcon
                            sx={{
                              transform: expandedRows[log.id] ? 'rotate(180deg)' : 'rotate(0)',
                              transition: 'transform 0.3s'
                            }}
                          />
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{log.time}</TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{log.description}</TableCell>
                      <TableCell sx={{ 
                        color: 'white', 
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        '& span': {
                          bgcolor: EVENT_COLORS[log.event],
                          px: 2,
                          py: 0.5,
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }
                      }}>
                        <span>{log.event}</span>
                      </TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{log.category}</TableCell>
                      <TableCell sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{log.performedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredLogs.length}
              rowsPerPage={pagination.rowsPerPage}
              page={pagination.page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
              sx={{
                color: 'white',
                '.MuiTablePagination-select': { color: 'white' },
                '.MuiTablePagination-selectIcon': { color: 'white' },
              }}
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}