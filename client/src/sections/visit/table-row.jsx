import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { calculateAge } from '../../utils/calculateAge';

// ----------------------------------------------------------------------

export function CustomTableRow({ row, selected }) {
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
          {row?.doctor?.name || ' - '}
        </TableCell>
        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          {row?.complaints?.chiefComplaint || ' - '}
        </TableCell>

        <TableCell
          sx={{
            textWrap: 'nowrap',
          }}
        >
          {row?.diagnosis?.primary || ' - '}
        </TableCell>
      </TableRow>
    </>
  );
}
