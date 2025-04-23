import { FilterList as FilterIcon, Search as SearchIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputAdornment,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';


export const actionOptions = ['Create', 'Delete', 'Update', 'Download'];

export const categoryOptions = ['Admin', 'Firewall Rule', 'Router Certificate', 'Hotspot User', 'Firewall Template', 'Router'];

export interface FiltersProps {
  selectedCategory: string;
  selectedActions: string[];
  searchUser: string;
  fromDate: dayjs.Dayjs | null;
  toDate: dayjs.Dayjs | null;
  onCategoryChange: (category: string) => void;
  onActionChange: (action: string) => void;
  onSearchUserChange: (search: string) => void;
  onFromDateChange: (date: dayjs.Dayjs | null) => void;
  onToDateChange: (date: dayjs.Dayjs | null) => void;
  onClearFilters: () => void;
}

export default function Filters({
  selectedCategory,
  selectedActions,
  searchUser,
  fromDate,
  toDate,
  onCategoryChange,
  onActionChange,
  onSearchUserChange,
  onFromDateChange,
  onToDateChange,
  onClearFilters
}: FiltersProps) {
 
  const hasActiveFilters = selectedCategory !== '' || 
                         selectedActions.length > 0 || 
                         searchUser !== '' || 
                         fromDate !== null || 
                         toDate !== null;

  return (
    <Paper sx={{ 
      width: '100%', 

      bgcolor: '#1a2332', 
      color: 'white',
      p: 2,
      height: 'fit-content',
      borderRadius: '8px'
    }}>
      <Box sx={{ mb: 2 }}>
        {/* Header with Filter icon and title */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <FilterIcon sx={{ mr: 1 }} />
          <Typography variant="subtitle1">Filters</Typography>
        </Box>
        
        {/* Clear Filters button */}
        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            size="small"
            sx={{
              color: '#4299e1',
              fontSize: '0.75rem',
              textTransform: 'none',
              p: 0,
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline'
              }
            }}
          >
            Clear all filters
          </Button>
        )}
      </Box>

      {/* Category Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="rgba(255,255,255,0.7)" sx={{ mb: 1 }}>
          Category
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as string)}
            displayEmpty
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.05)',
              '.MuiSelect-icon': { color: 'white' },
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' }
            }}
            renderValue={(selected) => {
              if (!selected) {
                return <Typography color="rgba(255,255,255,0.5)">Select an option</Typography>;
              }
              return selected;
            }}
          >
            {categoryOptions.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Action Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="rgba(255,255,255,0.7)" sx={{ mb: 1 }}>
          Action
        </Typography>
        {actionOptions.map((action) => (
          <FormControlLabel
            key={action}
            control={
              <Checkbox
                checked={selectedActions.includes(action)}
                onChange={() => onActionChange(action)}
                sx={{ color: 'rgba(255,255,255,0.5)', '&.Mui-checked': { color: '#4299e1' } }}
              />
            }
            label={action}
            sx={{ display: 'block', mb: 0.5 }}
          />
        ))}
      </Box>

      {/* User Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" color="rgba(255,255,255,0.7)" sx={{ mb: 1 }}>
          User
        </Typography>
        <TextField
          size="small"
          value={searchUser}
          onChange={(e) => onSearchUserChange(e.target.value)}
          fullWidth
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            bgcolor: 'rgba(255,255,255,0.05)',
            '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
            input: { color: 'white' }
          }}
        />
      </Box>

      {/* Date Filter */}
      <Box>
        <Typography variant="subtitle2" color="rgba(255,255,255,0.7)" sx={{ mb: 1 }}>
          Date
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="From"
            value={fromDate}
            onChange={onFromDateChange}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                sx: {
                  mb: 2,
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                  input: { color: 'white' },
                  label: { color: 'rgba(255,255,255,0.5)' },
                  bgcolor: 'rgba(255,255,255,0.05)',
                }
              }
            }}
          />
          <DatePicker
            label="To"
            value={toDate}
            onChange={onToDateChange}
            slotProps={{
              textField: {
                size: "small",
                fullWidth: true,
                sx: {
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.1)' },
                  input: { color: 'white' },
                  label: { color: 'rgba(255,255,255,0.5)' },
                  bgcolor: 'rgba(255,255,255,0.05)',
                }
              }
            }}
          />
        </LocalizationProvider>
      </Box>
    </Paper>
  );
} 