import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { CircularProgress, Grid, useMediaQuery, useTheme } from '@mui/material';

import { _users } from '../../../_mock';
import { DashboardContent } from '../../../layouts/dashboard/index';

import { Iconify } from '../../../components/iconify';
import { useRouter } from '../../../routes/hooks';

import { useSnackbar } from '../../../components/snackbar/snackbar';
import { patientCompleteProfile, resetErrors } from '../../../redux/patientProfileSlice';

export default function VisitNew() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { openSnackbar } = useSnackbar();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { patientProfile, loading, error } = useSelector((state) => state.patientProfile);

  const [data, setData] = useState(null);

  const changeHandler = (e) => {
    setData(e.target.value);
  };

  // Handle submit with password validation
  const handleClick = async (e) => {
    e.preventDefault();
    dispatch(patientCompleteProfile(data));
  };

  useEffect(() => {
    if (patientProfile) {
      openSnackbar('Record Fetched Successfully', 'success');
    } else if (error?.message || error?.error) {
      openSnackbar(`${error?.message || error?.error}`, 'error');
    }
    return () => {
      dispatch(resetErrors());
    };
  }, [patientProfile, error?.message, error?.error, router, openSnackbar, dispatch]);

  console.log(patientProfile);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          New Patient Visit
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="pajamas:go-back" />}
          onClick={() => {
            router.back();
          }}
        >
          Go Back
        </Button>
      </Box>

      <Card>
        <form onSubmit={handleClick}>
          <Grid container spacing={4} p={4}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Retrive Patient Data
              </Typography>
            </Grid>

            {/* Submit Button */}

            <Grid
              item
              xs={12}
              sm={8}
              md={6}
              sx={{
                margin: '0 auto',
              }}
            >
              <TextField
                name="id"
                label="Patient ID"
                value={data}
                onChange={changeHandler}
                required
                fullWidth
                sx={{
                  marginBottom: '20px',
                }}
              />
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
              >
                {loading === false ? (
                  'Get Patient Details'
                ) : (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: 'white',
                    }}
                  />
                )}
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Card>
    </DashboardContent>
  );
}
