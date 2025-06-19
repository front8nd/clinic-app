import { useState, useCallback, useEffect } from 'react';
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
import { visits } from '../../../redux/visitSlice';

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

export default function VisitView() {
  const dispatch = useDispatch();
  const router = useRouter();
  const table = useTable();

  // Initialize today's date for `dataByDate`
  const today = new Date().toISOString().split('T')[0];
  const [dataByDate, setDataByDate] = useState(today);
  const { visitList, loading } = useSelector((state) => state.visit);
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    dispatch(visits({ page: table.page + 1, limit: table.rowsPerPage, date: dataByDate }));
  }, [dispatch, table.page, table.rowsPerPage, dataByDate]);

  const dataFiltered = applyFilter({
    inputData: visitList?.visits || [],
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  console.log(visitList);

  const notFound = !dataFiltered?.length && !!filterName;
  const noData = !loading && dataFiltered.length === 0;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Patient Visits
        </Typography>
        <Button
          onClick={() => {
            router.push('/patient-profile');
          }}
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New Patient Visit
        </Button>
      </Box>

      <Card>
        <TableToolbar
          dataByDate={dataByDate}
          setDataByDate={setDataByDate}
          onFilterName={(event) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
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
                  { id: 'patientId', label: 'PatientID' },
                  { id: 'name', label: 'Name' },
                  { id: 'doctor', label: 'Doctor' },
                  { id: 'diagnosis', label: 'Diagnosis' },
                  { id: 'chiefComplaint', label: 'Chief Complaint' },
                ]}
              />
              <TableBody>
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
                  dataFiltered.map((row) => (
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
                  emptyRows={emptyRows(table.page, table.rowsPerPage, visitList?.totalVisits)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={visitList?.totalVisits || 0}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[10, 20, 50]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}
