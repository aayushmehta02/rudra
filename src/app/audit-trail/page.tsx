'use client';

import { AuditTrailTable } from '@/components/audit/AuditTrailTable';
import Filters from '@/components/audit/Filters';
import AppBarComponent from '@/components/common/AppBar';
import DrawerComponent from '@/components/common/Drawer';
import Loader from '@/components/common/Loader';
import { GET_AUDIT_LOGS } from '@/graphql/getData';
import { useSnackbar } from '@/providers/SnackbarProvider';
import { useQuery } from '@apollo/client';
import {
  FileDownload as DownloadIcon,
  ExpandMore as ExpandIcon
} from '@mui/icons-material';
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';


interface AuditLog {
  id: string;
  time: string;
  description: string;
  event: 'Create' | 'Delete' | 'Update' | 'Download';
  category: string;
  performed_by: string;
}


const EVENT_COLORS = {
  Create: '#2f855a',
  Delete: '#e53e3e',
  Update: '#3182ce',
  Download: '#6b46c1'
} as const;

const exportToCSV = (logs: AuditLog[]) => {

  const headers = ['Time', 'Description', 'Event', 'Category', 'Performed By'];
  
  const csvData = logs.map(log => {
    return [
      log.time,
      log.description,
      log.event,
      log.category,
      log.performed_by
    ].map(value => `"${value}"`).join(',');
  });


  const csvContent = [headers.join(','), ...csvData].join('\n');


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


export default function AuditTrail() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { showSnackbar } = useSnackbar();


  const { data: auditData, loading, error } = useQuery(GET_AUDIT_LOGS, {
    fetchPolicy: 'cache-and-network'
  });


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

  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});


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
    showSnackbar('Filters cleared successfully', 'success');
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

  const toggleRowExpansion = (id: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };


  const filteredLogs = useMemo(() => {
    if (!auditData?.audit_logs) return [];

    return auditData.audit_logs.filter((log: AuditLog) => {
      if (filters.category && log.category !== filters.category) return false;
      if (filters.actions.length > 0 && !filters.actions.includes(log.event)) return false;
      if (filters.user && !log.performed_by.toLowerCase().includes(filters.user.toLowerCase())) return false;
      
      if (filters.fromDate || filters.toDate) {
        const logDate = dayjs(log.time);
        if (filters.fromDate && logDate.isBefore(filters.fromDate, 'day')) return false;
        if (filters.toDate && logDate.isAfter(filters.toDate, 'day')) return false;
      }

      return true;
    });
  }, [auditData?.audit_logs, filters]);

  const paginatedLogs = filteredLogs.slice(
    pagination.page * pagination.rowsPerPage,
    pagination.page * pagination.rowsPerPage + pagination.rowsPerPage
  );

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: '#0d1421',
        color: 'white'
      }}>
        <Typography>Error loading audit logs. Please try again later.</Typography>
      </Box>
    );
  }

  if (loading) {
    return <Loader />;
  }
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
                disabled={loading || filteredLogs.length === 0}
                sx={{
                  color: 'white',
            
                }}
              >
                Download Log
              </Button>
            </Box>
        </Box>

        {/* Content Layout - Adjusted for responsiveness */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 3,
          height: '100%'
        }}>
          {/* Filters Section */}
          <Box sx={{ 
            width: { xs: '100%', lg: '60%' }, 
            mb: { xs: 3, lg: 0 }
          }}>
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
            <AuditTrailTable
              loading={loading}
              isMobile={isMobile}
              paginatedLogs={paginatedLogs}
              expandedRows={expandedRows}
              EVENT_COLORS={EVENT_COLORS}
              filteredLogs={filteredLogs}
              pagination={pagination}
              toggleRowExpansion={toggleRowExpansion}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              ExpandIcon={ExpandIcon}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}