import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import {
  Box,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import React from 'react';

export interface AuditLog {
  id: string;
  time: string;
  description: string;
  event: string;
  category: string;
  performed_by: string;
}

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
}

interface AuditTrailTableProps {
  loading: boolean;
  isMobile: boolean;
  paginatedLogs: AuditLog[];
  expandedRows: Record<string, boolean>;
  EVENT_COLORS: Record<string, string>;
  filteredLogs: AuditLog[];
  pagination: {
    page: number;
    rowsPerPage: number;
  };
  toggleRowExpansion: (id: string) => void;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  ExpandIcon: React.ComponentType<any>;
}

const TablePaginationActions = (props: TablePaginationActionsProps) => {
  const { count, page, rowsPerPage, onPageChange } = props;
  const totalPages = Math.ceil(count / rowsPerPage);
  
  
  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5, display: 'flex', alignItems: 'center' }}>
      <IconButton
        onClick={(e) => onPageChange(e, page - 1)}
        disabled={page === 0}
        sx={{ color: 'white' }}
      >
        <KeyboardArrowLeft />
      </IconButton>
      
      {getPageNumbers().map((pageNum) => (
        <Box
          key={pageNum}
          onClick={() => onPageChange(null, pageNum)}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mx: 0.5,
            width: '24px',
            height: '24px',
            color: 'white',
            
            cursor: 'pointer',
            bgcolor: page === pageNum ? '#2a4465' : 'transparent',
            '&:hover': {
              bgcolor: page === pageNum ? '#2a4465' : 'rgba(255,255,255,0.1)'
            }
          }}
        >
          {pageNum + 1}
        </Box>
      ))}

      <IconButton
        onClick={(e) => onPageChange(e, page + 1)}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        sx={{ color: 'white' }}
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
};

export const AuditTrailTable: React.FC<AuditTrailTableProps> = ({
  loading,
  isMobile,
  paginatedLogs,
  expandedRows,
  EVENT_COLORS,
  filteredLogs,
  pagination,
  toggleRowExpansion,
  handleChangePage,
  handleChangeRowsPerPage,
  ExpandIcon
}) => {
  return (
    <Box sx={{ width: '100%' }}>
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={40} sx={{ color: 'white' }} />
                  </TableCell>
                </TableRow>
              ) : paginatedLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'white' }}>
                    No audit logs found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedLogs.map((log: AuditLog) => (
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
                        }}>{dayjs(log.time).format('DD/MM/YY, hh:mm A')}</TableCell>
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
                          }}>{log.performed_by}</TableCell>
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
                                {dayjs(log.time).format('DD/MM/YY, hh:mm A')}
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
                                {log.performed_by}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
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
  );
}; 