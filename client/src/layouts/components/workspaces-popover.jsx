import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import ButtonBase from '@mui/material/ButtonBase';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { varAlpha } from '../../theme/styles';

import { Label } from '../../components/label';
import { Iconify } from '../../components/iconify';
import DocSVG from '../../../public/assets/icons/doctor.svg';

// ----------------------------------------------------------------------

export function WorkspacesPopover({ data = [], sx, ...other }) {
  const { userData } = useSelector((state) => state.auth);
  const [workspace, setWorkspace] = useState(data[0]);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = useCallback(
    (event) => {
      setOpenPopover(event.currentTarget);
    },
    [setOpenPopover]
  );

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, [setOpenPopover]);

  const handleChangeWorkspace = useCallback(
    (newValue) => {
      setWorkspace(newValue);
      handleClosePopover();
    },
    [handleClosePopover]
  );

  const renderAvatar = (alt, src) => (
    <Box component="img" alt={alt} src={src} sx={{ width: 24, height: 24, borderRadius: '50%' }} />
  );

  const renderLabel = (plan) => <Label color={plan === 'Free' ? 'default' : 'info'}>{plan}</Label>;

  return (
    <>
      <ButtonBase
        disableRipple
        onClick={handleOpenPopover}
        sx={{
          pl: 2,
          py: 3,
          gap: 1.5,
          pr: 1.5,
          width: 1,
          borderRadius: 1.5,
          textAlign: 'left',
          justifyContent: 'flex-start',
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
          ...sx,
        }}
        {...other}
      >
        {renderAvatar(workspace?.name, '/assets/icons/doctor.svg')}

        <Box
          gap={1}
          flexGrow={1}
          display="flex"
          alignItems="center"
          sx={{ typography: 'body2', fontWeight: 'fontWeightSemiBold' }}
        >
          {userData?.user?.name}
          {renderLabel(userData?.user?.role)}
        </Box>
      </ButtonBase>
    </>
  );
}
