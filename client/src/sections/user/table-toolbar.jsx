import { useCallback, useState } from 'react';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import { menuItemClasses } from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import {
  FormControl,
  FormControlLabel,
  MenuItem,
  MenuList,
  Popover,
  Radio,
  RadioGroup,
} from '@mui/material';

import { Iconify } from '../../components/iconify';

// ----------------------------------------------------------------------

export function TableToolbar({ numSelected, filterName, onFilterName, setRole, theRole }) {
  const handleChange = (event) => {
    setRole(event.target.value);
  };

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = useCallback((event) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          fullWidth
          value={filterName}
          onChange={onFilterName}
          placeholder="Search user..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          sx={{ maxWidth: 320 }}
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={theRole}
              onChange={handleChange}
            >
              <MenuItem onClick={handleClosePopover}>
                <FormControlLabel value="all" control={<Radio />} label="All Users" />
              </MenuItem>
              <MenuItem onClick={handleClosePopover}>
                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
              </MenuItem>
              <MenuItem onClick={handleClosePopover}>
                <FormControlLabel value="doctor" control={<Radio />} label="Doctor" />
              </MenuItem>
              <MenuItem onClick={handleClosePopover}>
                <FormControlLabel value="staff" control={<Radio />} label="Staff" />
              </MenuItem>
            </RadioGroup>
          </FormControl>
        </MenuList>
      </Popover>
    </Toolbar>
  );
}
