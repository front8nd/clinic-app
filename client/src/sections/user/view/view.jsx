import { useState, useCallback, useEffect, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { TableCell, TableRow } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { _users } from '../../../_mock';
import { DashboardContent } from '../../../layouts/dashboard/index';

import { Iconify } from '../../../components/iconify';
import { Scrollbar } from '../../../components/scrollbar';

import { TableNoData } from '../table-no-data';
import { CustomTableRow } from '../table-row';
import { CustomTableHead } from '../table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { TableToolbar } from '../table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import { useRouter } from '../../../routes/hooks';
import { users } from '../../../redux/userSlice';

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');

  const onSort = useCallback(
    (id) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked, newSelecteds) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}

// ----------------------------------------------------------------------

export default function UserView() {
  const dispatch = useDispatch();
  const router = useRouter();
  const table = useTable();

  const { data, loading } = useSelector((state) => state.user);

  const [filterName, setFilterName] = useState('');
  const [theRole, setRole] = useState('all');

  useEffect(() => {
    dispatch(users());
  }, [dispatch]);

  const selectedData = data?.filter((e) => {
    if (theRole === 'all') return data;
    return e.role === theRole;
  });

  const dataFiltered = applyFilter({
    inputData: selectedData?.length > 0 ? selectedData : [],
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  const noData = !loading && dataFiltered.length === 0;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Users
        </Typography>
        <Button
          onClick={() => {
            router.push('/new-user');
          }}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New user
        </Button>
      </Box>

      <Card>
        <TableToolbar
          onFilterName={(event) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          setRole={setRole}
          theRole={theRole}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CustomTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered?.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'contact', label: 'Contact' },
                  { id: 'address', label: 'Address' },
                  { id: 'role', label: 'Role' },
                  { id: 'positon', label: 'Position' },
                  { id: 'experince', label: 'EXP (Years)' },
                  { id: 'qualification', label: 'Qualification' },
                  { id: 'joined', label: 'Joined' },
                ]}
              />
              <TableBody>
                {}

                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      sx={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: 'inherit',
                        textAlign: 'center',
                      }}
                    >
                      Please Wait...
                    </TableCell>
                  </TableRow>
                ) : noData ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      sx={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: 'red',
                        textAlign: 'center',
                      }}
                    >
                      No Records Exist
                    </TableCell>
                  </TableRow>
                ) : (
                  dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <CustomTableRow
                        key={row._id}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                      />
                    ))
                )}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered?.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={dataFiltered?.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
