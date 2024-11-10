import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { calculateAge } from '../../utils/calculateAge';
import { Label } from '../../components/label';

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
            {row?.patient?.name || ' - '}
          </Box>
        </TableCell>

        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          {row?.patient?.contact || ' - '}
        </TableCell>
        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          {row?.appointmentDateTime || ' - '}
        </TableCell>
        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          <Label
            color={
              row?.status === 'cancelled'
                ? 'warning'
                : row?.status === 'scheduled'
                  ? 'warning'
                  : row?.status === 'completed'
                    ? 'success'
                    : 'default'
            }
          >
            {row?.status?.toUpperCase()}
          </Label>
        </TableCell>
      </TableRow>
    </>
  );
}
