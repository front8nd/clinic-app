import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { CircularProgress, Grid, MenuItem, Select, useMediaQuery, useTheme } from '@mui/material';
import { DashboardContent } from '../../../layouts/dashboard/index';
import { Iconify } from '../../../components/iconify';
import { useRouter } from '../../../routes/hooks';
import { useSnackbar } from '../../../components/snackbar/snackbar';
import { newVisit, resetErrors } from '../../../redux/visitSlice';

export default function VisitNew() {
  const router = useRouter();
  const { patientId } = useParams();
  const { openSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();
  const { loading, error, newPatientVisit } = useSelector((state) => state.visit);
  const { userData } = useSelector((state) => state.auth);

  const [data, setData] = useState({
    weight: '',
    height: '',
    pulse_rate: '',
    resp_rate: '',
    spo2: '',
    temp: '',
    rbs: '',
    blood_pressure_sys: '',
    blood_pressure_dia: '',
  });

  const changeHandler = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const visitInfo = {
      weight: data.weight,
      height: data.height,
      pulse_rate: data.pulse_rate,
      resp_rate: data.resp_rate,
      spo2: data.spo2,
      temp: data.temp,
      rbs: data.rbs,
      blood_pressure: {
        sys: data.blood_pressure_sys,
        dia: data.blood_pressure_dia,
      },

      doctor: {
        id: userData?.user?._id,
        name: userData?.user?.name,
        email: userData?.user?.email,
        role: userData?.user?.role,
      },
    };

    const additionalData = {
      visitInfo,
      patientId,
    };
    console.log(additionalData);
    await dispatch(newVisit(additionalData));
  };

  useEffect(() => {
    if (newPatientVisit) {
      openSnackbar('Patient Visit Record Added Successfully', 'success');
    } else if (error?.message || error?.error) {
      openSnackbar(`${error?.message || error?.error}`, 'error');
    }
    return () => {
      dispatch(resetErrors());
    };
  }, [newPatientVisit, error?.message, error?.error, router, openSnackbar, dispatch]);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Add New Patient Visit
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="pajamas:go-back" />}
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </Box>

      <Card>
        <form onSubmit={handleClick}>
          <Grid container spacing={4} p={4}>
            {/* Fees Information Section */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Fees
              </Typography>
            </Grid>

            {/* Medical Information Section */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Medical Information
              </Typography>
            </Grid>
            {/* Medical Information Fields */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="weight"
                label="Weight (kg)"
                type="number"
                value={data.weight}
                onChange={changeHandler}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="height"
                label="Height (cm)"
                type="number"
                value={data.height}
                onChange={changeHandler}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="pulse_rate"
                label="Pulse Rate (bpm)"
                type="number"
                value={data.pulse_rate}
                onChange={changeHandler}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="resp_rate"
                label="Respiratory Rate (breaths/min)"
                type="number"
                value={data.resp_rate}
                onChange={changeHandler}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="spo2"
                label="SpO2 (%)"
                type="number"
                value={data.spo2}
                onChange={changeHandler}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="temp"
                label="Temperature (°C)"
                type="number"
                value={data.temp}
                onChange={changeHandler}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="rbs"
                label="Random Blood Sugar (mg/dL)"
                type="number"
                value={data.rbs}
                onChange={changeHandler}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="blood_pressure_sys"
                label="Blood Pressure (Systolic)"
                type="number"
                value={data.blood_pressure_sys}
                onChange={changeHandler}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="blood_pressure_dia"
                label="Blood Pressure (Diastolic)"
                type="number"
                value={data.blood_pressure_dia}
                onChange={changeHandler}
                fullWidth
                required
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <LoadingButton
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={loading}
                  loadingIndicator={<CircularProgress size={24} color="inherit" />}
                >
                  Add New Visit Record
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Card>
    </DashboardContent>
  );
}
