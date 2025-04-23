import { alpha, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

interface Tenant {
  id: string;
  name: string;
  data_usage_gb: number;
}

interface TenantsTableProps {
  filteredTenants: Tenant[];
  isLoading: boolean;
  isMobile: boolean;
}

export const TenantsTable = ({ filteredTenants, isLoading, isMobile }: TenantsTableProps) => {
  return (
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
          color: 'text.primary',
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
                  color: 'text.secondary',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  padding: isMobile ? '8px 0' : '12px 0',
                  fontSize: isMobile ? '0.75rem' : 'inherit'
                }}
              >
                No.
              </TableCell>
              <TableCell 
                sx={{ 
                  color: 'text.secondary',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  padding: isMobile ? '8px 12px' : '12px 24px',
                  fontSize: isMobile ? '0.75rem' : 'inherit'
                }}
              >
                Name
              </TableCell>
              <TableCell 
                align="right" 
                sx={{ 
                  color: 'text.secondary',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  padding: isMobile ? '8px 0' : '12px 0',
                  fontSize: isMobile ? '0.75rem' : 'inherit'
                }}
              >
                Data Usage
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
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
              filteredTenants.map((tenant, index) => (
                <TableRow
                  key={tenant.id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:nth-of-type(odd)': { backgroundColor: alpha('#fff', 0.03) },
                    '&:hover': { backgroundColor: alpha('#fff', 0.05) }
                  }}
                >
                  <TableCell 
                    component="th" 
                    scope="row" 
                    sx={{ 
                      color: 'text.primary',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      padding: isMobile ? '8px 0' : '12px 0',
                      fontSize: isMobile ? '0.75rem' : 'inherit'
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      color: 'text.primary',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      padding: isMobile ? '8px 12px' : '12px 24px',
                      fontSize: isMobile ? '0.75rem' : 'inherit'
                    }}
                  >
                    {tenant.name}
                  </TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      color: 'text.primary',
                      borderBottom: '1px solid',
                      borderColor: 'divider',
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
  );
}; 