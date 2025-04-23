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
    useMediaQuery,
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

// CSV Export Function
const exportToCSV = (logs: AuditLog[]) => {
  // Convert React nodes to plain text for description
  const processDescription = (desc: React.ReactNode): string => {
    if (typeof desc === 'string') return desc;
    if (!desc || typeof desc !== 'object') return '';

    // Handle array of nodes
    if (Array.isArray(desc)) {
      return desc.map(node => processDescription(node)).join('');
    }

    // Handle React element
    const element = desc as React.ReactElement<{ children?: React.ReactNode }>;
    if (element.props?.children) {
      if (Array.isArray(element.props.children)) {
        return element.props.children.map(processDescription).join('');
      }
      return processDescription(element.props.children);
    }

    return '';
  };

  // Prepare CSV data
  const headers = ['Time', 'Description', 'Event', 'Category', 'Performed By'];
  
  const csvData = logs.map(log => {
    const description = processDescription(log.description).replace(/"/g, '""');
    return [
      log.time,
      description,
      log.event,
      log.category,
      log.performedBy
    ].map(value => `"${value}"`).join(',');
  });

  // Create CSV content with proper line breaks
  const csvContent = [headers.join(','), ...csvData].join('\\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = dayjs().format('YYYY-MM-DD_HH-mm');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `audit_trail_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Main Component
export default function AuditTrail() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

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
    <Box sx={{ 
      display: 'flex', 
      bgcolor: '#0d1421', 
      minHeight: '100vh'
    }}>
      <AppBarComponent />
      <DrawerComponent />
      
      {/* Main Content */}
      <Box 
        component="main"
        sx={{ 
          flexGrow: 1,
          p: { xs: 1, sm: 2, md: 3 },
          marginTop: '64px',
          width: '100%',
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 3
        }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            color="white" 
            fontWeight="bold"
          >
            Audit Trail
          </Typography>
        </Box>

        {/* Content Layout */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}>
          {/* Filters Section */}
          <Box sx={{ width: '100%' }}>
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
          </Box>

          {/* Table Section */}
          <Box sx={{ width: '100%' }}>
            {/* Table Actions */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end',
              mb: 2 
            }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => exportToCSV(filteredLogs)}
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.3)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Download Log
              </Button>
            </Box>

            {/* Table */}
            <Paper sx={{ 
              bgcolor: '#1a2332', 
              color: 'white',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <TableContainer sx={{ 
                maxWidth: '100%',
                overflowX: 'auto'
              }}>
                <Table sx={{ minWidth: isMobile ? 'auto' : 650 }}>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                      <TableCell width="40px" sx={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        padding: { xs: 1, sm: 2 }
                      }}></TableCell>
                      {!isMobile && (
                        <TableCell sx={{ 
                          color: 'rgba(255,255,255,0.7)', 
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                          padding: { xs: 1, sm: 2 },
                          minWidth: 100
                        }}>Time</TableCell>
                      )}
                      <TableCell sx={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        padding: { xs: 1, sm: 2 },
                        minWidth: { xs: 150, sm: 200 }
                      }}>Description</TableCell>
                      <TableCell sx={{ 
                        color: 'rgba(255,255,255,0.7)', 
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        padding: { xs: 1, sm: 2 },
                        minWidth: 90
                      }}>Event</TableCell>
                      {!isMobile && (
                        <>
                          <TableCell sx={{ 
                            color: 'rgba(255,255,255,0.7)', 
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            padding: { xs: 1, sm: 2 },
                            minWidth: 100
                          }}>Category</TableCell>
                          <TableCell sx={{ 
                            color: 'rgba(255,255,255,0.7)', 
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            padding: { xs: 1, sm: 2 },
                            minWidth: 120
                          }}>Performed By</TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedLogs.map((log) => (
                      <React.Fragment key={log.id}>
                        <TableRow
                          sx={{ 
                            '&:nth-of-type(odd)': { backgroundColor: '#183b65' },
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                          }}
                        >
                          <TableCell sx={{ 
                            borderBottom: '1px solid rgba(255,255,255,0.1)', 
                            padding: { xs: 1, sm: 2 }
                          }}>
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
                          {!isMobile && (
                            <TableCell sx={{ 
                              color: 'white', 
                              borderBottom: '1px solid rgba(255,255,255,0.1)',
                              padding: { xs: 1, sm: 2 }
                            }}>{log.time}</TableCell>
                          )}
                          <TableCell sx={{ 
                            color: 'white', 
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            padding: { xs: 1, sm: 2 },
                            wordBreak: 'break-word'
                          }}>{log.description}</TableCell>
                          <TableCell sx={{ 
                            color: 'white', 
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            padding: { xs: 1, sm: 2 },
                            '& span': {
                              bgcolor: EVENT_COLORS[log.event],
                              px: { xs: 1, sm: 2 },
                              py: 0.5,
                              borderRadius: '4px',
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                              whiteSpace: 'nowrap',
                              display: 'inline-block'
                            }
                          }}>
                            <span>{log.event}</span>
                          </TableCell>
                          {!isMobile && (
                            <>
                              <TableCell sx={{ 
                                color: 'white', 
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                padding: { xs: 1, sm: 2 }
                              }}>{log.category}</TableCell>
                              <TableCell sx={{ 
                                color: 'white', 
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                padding: { xs: 1, sm: 2 }
                              }}>{log.performedBy}</TableCell>
                            </>
                          )}
                        </TableRow>
                        {/* Mobile Expanded Row */}
                        {isMobile && expandedRows[log.id] && (
                          <TableRow
                            sx={{ 
                              backgroundColor: '#183b65',
                            }}
                          >
                            <TableCell 
                              colSpan={4}
                              sx={{ 
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                padding: 2
                              }}
                            >
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Box>
                                  <Typography variant="caption" color="rgba(255,255,255,0.7)">
                                    Time
                                  </Typography>
                                  <Typography color="white">
                                    {log.time}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" color="rgba(255,255,255,0.7)">
                                    Category
                                  </Typography>
                                  <Typography color="white">
                                    {log.category}
                                  </Typography>
                                </Box>
                                <Box>
                                  <Typography variant="caption" color="rgba(255,255,255,0.7)">
                                    Performed By
                                  </Typography>
                                  <Typography color="white">
                                    {log.performedBy}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
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
                  padding: { xs: 1, sm: 2 }
                }}
              />
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}