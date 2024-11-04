import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { CircularProgress, Grid, Stack, useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from '../../../routes/hooks';
import { useSnackbar } from '../../../components/snackbar/snackbar';
import { patientCompleteProfile, resetErrors } from '../../../redux/patientProfileSlice';
import { Iconify } from '../../../components/iconify';
import { DashboardContent } from '../../../layouts/dashboard/index';
import { calculateAge } from '../../../utils/calculateAge';

export default function Profile() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { openSnackbar } = useSnackbar();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { patientProfile, loading, error } = useSelector((state) => state.patientProfile);
  const [data, setData] = useState('');

  const changeHandler = (e) => {
    setData(e.target.value);
  };

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
  const age = calculateAge(patientProfile?.patient?.birthYear);
  console.log(age);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Patient Profile
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

      <Card sx={{ padding: 3, marginBottom: 4 }}>
        <form onSubmit={handleClick}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Retrieve Patient Data
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8} md={6}>
              <TextField
                name="id"
                label="Patient ID"
                value={data}
                onChange={changeHandler}
                required
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                loadingIndicator={<CircularProgress size={24} color="inherit" />}
                loading={loading}
              >
                Get Patient Details
              </LoadingButton>
            </Grid>
            {patientProfile && (
              <Grid item xs={12} sm={8} md={5}>
                <Stack spacing={3}>
                  <Button
                    variant="outlined"
                    size="large"
                    color="primary"
                    startIcon={<Iconify icon="fa-solid:file-medical" />}
                    onClick={() => {
                      router.push(`/new-medical-record/${patientProfile?.patient?.patientId}`);
                    }}
                  >
                    New Medical Record (for Counter)
                  </Button>
                  <Button
                    size="large"
                    variant="outlined"
                    color="success"
                    startIcon={<Iconify icon="fa-solid:notes-medical" />}
                    onClick={() => {
                      router.push(`/new-visit/${patientProfile?.patient?.patientId}`);
                    }}
                  >
                    New Visit Record (for Doctor)
                  </Button>
                </Stack>
              </Grid>
            )}
          </Grid>
        </form>
      </Card>

      {/* Display Patient Profile and Medical Info */}
      {patientProfile && (
        <Card sx={{ padding: 3 }}>
          {/* Patient Details Section */}
          <Box
            sx={{ backgroundColor: theme.palette.grey[200], padding: 3, borderRadius: 1, mb: 3 }}
          >
            <Typography variant="h5" gutterBottom>
              Patient Profile
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Name:</strong> {patientProfile?.patient?.name}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Age:</strong> {age}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Gender:</strong> {patientProfile?.patient?.gender?.toUpperCase()}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Contact:</strong> {patientProfile?.patient?.contact}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Address:</strong> {patientProfile?.patient?.address}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1">
                  <strong>Patient ID:</strong> {patientProfile?.patient?.patientId}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Registration Date:</strong>{' '}
                  {new Date(patientProfile?.patient?.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Assisted By:</strong> {patientProfile?.patient?.assistedBy.name} (
                  {patientProfile?.patient?.assistedBy.role.toUpperCase()})
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Allergies:</strong> {patientProfile?.patient?.allergies}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Chronic Conditions:</strong> {patientProfile?.patient?.chronicConditions}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Medical Info Section */}
          <Typography variant="h6" gutterBottom>
            Medical Information
          </Typography>
          {patientProfile.medicalInfo && patientProfile.medicalInfo.length > 0 ? (
            patientProfile.medicalInfo.map((info, index) => (
              <Card
                key={info._id}
                sx={{ padding: 2, marginBottom: 2, backgroundColor: theme.palette.grey[100] }}
              >
                <Typography variant="h6">Medical Report #{index + 1}</Typography>
                <Typography variant="subtitle1">
                  <strong>Visit Number:</strong> {info.visitNumber}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Visit Date:</strong> {new Date(info.visitDate).toLocaleDateString()}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Assisted By:</strong> {info.assistedBy.name} (
                  {info.assistedBy.role.toUpperCase()})
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Fees Charged:</strong> {info.fees.final} Rs
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Weight:</strong> {info.weight} kg
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Height:</strong> {info.height} cm
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Pulse Rate:</strong> {info.pulse_rate} bpm
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Resp Rate:</strong> {info.resp_rate} bpm
                </Typography>
                <Typography variant="subtitle1">
                  <strong>SPO2:</strong> {info.spo2}%
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Temperature:</strong> {info.temp} °C
                </Typography>
                <Typography variant="subtitle1">
                  <strong>RBS:</strong> {info.rbs} mg/dL
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Blood Pressure:</strong> {info.blood_pressure.sys}/
                  {info.blood_pressure.dia} mmHg
                </Typography>
              </Card>
            ))
          ) : (
            <Card sx={{ padding: 2, marginTop: 2, backgroundColor: theme.palette.warning.light }}>
              <Typography variant="subtitle1" color="InfoText" align="center">
                No Medical Records
              </Typography>
            </Card>
          )}
        </Card>
      )}
    </DashboardContent>
  );
}
