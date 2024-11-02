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
          {row?.gender?.toUpperCase() || ' - '}
        </TableCell>
        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          {row?.age || ' - '}
        </TableCell>

        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          {row?.weight || ' - '}
        </TableCell>

        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          {row?.blood_pressure || ' - '}
        </TableCell>

        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          {row?.address || ' - '}
        </TableCell>

        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          {row?.contact || ' - '}
        </TableCell>
      </TableRow>
    </>
  );
}
