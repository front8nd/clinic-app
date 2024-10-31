import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { Label } from '../../components/label';

// ----------------------------------------------------------------------

export function CustomTableRow({ row, selected }) {
  const formattedDate = dayjs(row?.createdAt).format('DD/MM/YYYY');

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
          component="th"
          scope="row"
        >
          <Box gap={2} display="flex" alignItems="center">
            {/* <Avatar alt={row?.name || ' - '} src={row?.avatarUrl} /> */}
            {row?.name || ' - '}
          </Box>
        </TableCell>

        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          {row?.email || ' - '}
        </TableCell>
        <TableCell>{row?.contact || ' - '}</TableCell>

        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          <Label
            color={
              row?.role === 'admin'
                ? 'warning'
                : row?.role === 'staff'
                  ? 'info'
                  : row?.role === 'doctor'
                    ? 'success'
                    : 'default'
            }
          >
            {row.role}
          </Label>
        </TableCell>

        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          {row?.specialization?.toUpperCase() || row?.staffRole?.toUpperCase() || ' - '}
        </TableCell>

        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          {row?.qualification || ' - '}
        </TableCell>

        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          {row?.experience || ' - '}
        </TableCell>

        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          {formattedDate || ' - '}
        </TableCell>
      </TableRow>
    </>
  );
}
