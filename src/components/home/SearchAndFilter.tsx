'use client';

import { Search as SearchIcon } from '@mui/icons-material';
import { alpha, Box, InputBase, MenuItem, Select, styled, useTheme } from '@mui/material';

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

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterDays: string;
  setFilterDays: (days: string) => void;
}

export default function SearchAndFilter({
  searchQuery,
  setSearchQuery,
  filterDays,
  setFilterDays
}: SearchAndFilterProps) {
  const theme = useTheme();

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'flex-end',
      paddingBottom: '1rem',
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
  );
} 