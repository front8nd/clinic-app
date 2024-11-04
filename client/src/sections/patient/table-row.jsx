import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { calculateAge } from '../../utils/calculateAge';

// ----------------------------------------------------------------------

export function CustomTableRow({ row, selected }) {
  const age = calculateAge(row?.birthYear);
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          {row?.patientId || ' - '}
        </TableCell>

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
          {age || ' - '}
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
