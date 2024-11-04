import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  CircularProgress,
  Avatar,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { useRouter } from '../../../routes/hooks';
import { useSnackbar } from '../../../components/snackbar/snackbar';
import { patientCompleteProfile, reset } from '../../../redux/patientProfileSlice';
import { Iconify } from '../../../components/iconify';
import { DashboardContent } from '../../../layouts/dashboard/index';
import { calculateAge } from '../../../utils/calculateAge';

export default function Profile() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { openSnackbar } = useSnackbar();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { patientProfile, loading, error, isSuccess } = useSelector(
    (state) => state.patientProfile
  );
  const [data, setData] = useState('');

  console.log(patientProfile);

  const changeHandler = (e) => {
    setData(e.target.value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch(patientCompleteProfile(data));
  };

  useEffect(() => {
    if (isSuccess) {
      openSnackbar('Record Fetched Successfully', 'success');
    } else if (error?.message || error?.error || error) {
      openSnackbar(`${error?.message || error?.error || error}`, 'error');
    }
    return () => {
      dispatch(reset());
    };
  }, [isSuccess, error, router, openSnackbar, dispatch]);

  const age = calculateAge(patientProfile?.patient?.birthYear);

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
        <Card sx={{ padding: 0 }}>
          {/* Patient Details Section */}

          <Box sx={{ position: 'relative', padding: 3 }}>
            {/* Header with Basic Information */}
            <Card
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                padding: 3,
                borderRadius: '10px 10px 0px 0px',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: theme.palette.secondary.light, width: 64, height: 64 }}>
                  {/* <AccountCircleIcon fontSize="large" /> */}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h5" gutterBottom>
                    {patientProfile?.patient?.name}
                  </Typography>
                  <Typography variant="subtitle1" color="inherit">
                    Age: {age} | Gender: {patientProfile?.patient?.gender?.toUpperCase()}
                  </Typography>
                </Box>
                {/* Basic Information on the Right Side */}
                <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                  <Typography variant="subtitle1" color="inherit">
                    <strong>Contact:</strong> {patientProfile?.patient?.contact}
                  </Typography>
                  <Typography variant="subtitle1" color="inherit">
                    <strong>Address:</strong> {patientProfile?.patient?.address}
                  </Typography>
                </Box>
              </Stack>
            </Card>

            {/* Medical Details Section */}
            <Box
              sx={{
                backgroundColor: '#fbfbfb',
                color: 'black',
                padding: 3,
                borderRadius: '0 0 10px 10px',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                <Stack direction="row" alignItems="center" spacing={1}>
                  Basic Details
                </Stack>
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {/* Medical Details in a Two-Column Layout */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    <strong style={{ color: '#4a4a4a', fontWeight: 'bold' }}>Patient ID:</strong>{' '}
                    <span style={{ color: '#4f4f4f', fontWeight: 'normal' }}>
                      {patientProfile?.patient?.patientId}
                    </span>
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    <strong style={{ color: '#4a4a4a', fontWeight: 'bold' }}>
                      Registration Date:
                    </strong>{' '}
                    <span style={{ color: '#4f4f4f', fontWeight: 'normal' }}>
                      {new Date(patientProfile?.patient?.createdAt).toLocaleDateString()}
                    </span>
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    <strong style={{ color: '#4a4a4a', fontWeight: 'bold' }}>Assisted By:</strong>{' '}
                    <span style={{ color: '#4f4f4f', fontWeight: 'normal' }}>
                      {patientProfile?.patient?.assistedBy.name} (
                      {patientProfile?.patient?.assistedBy.role.toUpperCase()})
                    </span>
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    <strong style={{ color: '#4a4a4a', fontWeight: 'bold' }}>Allergies:</strong>{' '}
                    <span style={{ color: '#4f4f4f', fontWeight: 'normal' }}>
                      {patientProfile?.patient?.allergies || 'None'}
                    </span>
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    <strong style={{ color: '#4a4a4a', fontWeight: 'bold' }}>
                      Chronic Conditions:
                    </strong>{' '}
                    <span style={{ color: '#4f4f4f', fontWeight: 'normal' }}>
                      {patientProfile?.patient?.chronicConditions || 'None'}
                    </span>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Medical Information */}

          <Box sx={{ position: 'relative', padding: 3 }}>
            <Typography
              variant="h6"
              sx={{
                borderLeft: '5px solid #0d2f55',

                padding: '10px 15px',
                color: ' #0d2f55',
                marginBottom: '20px',
                width: 'fit-content',
                borderRadius: '4px',
              }}
            >
              Medical Information
            </Typography>
            {patientProfile.medicalInfo && patientProfile.medicalInfo.length > 0 ? (
              patientProfile.medicalInfo.map((info, index) => (
                <Card
                  key={info._id}
                  sx={{
                    padding: 3,
                    marginBottom: 3,
                    backgroundColor: theme.palette.grey[100],
                    borderRadius: 2,
                    boxShadow: 2,
                  }}
                >
                  <Grid container spacing={3}>
                    {/* Visit Details Section */}
                    <Grid item xs={12} md={4}>
                      <Typography variant="h6" gutterBottom>
                        Medical Report #{info.visitNumber}
                      </Typography>
                      <Divider sx={{ marginBottom: 2 }} />
                      <Typography variant="subtitle1">
                        <strong>Visit Date:</strong> {new Date(info.visitDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="subtitle1">
                        <strong>Assisted By:</strong> {info.assistedBy.name} (
                        {info.assistedBy.role.toUpperCase()})
                      </Typography>
                      <Typography variant="subtitle1">
                        <strong>Fees Charged:</strong> {info.fees.final} Rs (Discount:{' '}
                        {info.fees.discount})
                      </Typography>
                    </Grid>

                    {/* Vital Signs Section */}
                    <Grid item xs={12} md={8}>
                      <Table size="small" aria-label="vital signs table">
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <strong>Weight</strong>
                            </TableCell>
                            <TableCell align="right">{info.weight} kg</TableCell>
                            <TableCell>
                              <strong>Height</strong>
                            </TableCell>
                            <TableCell align="right">{info.height} cm</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <strong>Pulse Rate</strong>
                            </TableCell>
                            <TableCell align="right">{info.pulse_rate} bpm</TableCell>
                            <TableCell>
                              <strong>Resp Rate</strong>
                            </TableCell>
                            <TableCell align="right">{info.resp_rate} bpm</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <strong>SPO2</strong>
                            </TableCell>
                            <TableCell align="right">{info.spo2}%</TableCell>
                            <TableCell>
                              <strong>Temperature</strong>
                            </TableCell>
                            <TableCell align="right">{info.temp} °C</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <strong>RBS</strong>
                            </TableCell>
                            <TableCell align="right">{info.rbs} mg/dL</TableCell>
                            <TableCell>
                              <strong>Blood Pressure</strong>
                            </TableCell>
                            <TableCell align="right">
                              {info.blood_pressure.sys}/{info.blood_pressure.dia} mmHg
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Grid>
                  </Grid>
                </Card>
              ))
            ) : (
              <Card sx={{ padding: 2, marginTop: 2, backgroundColor: theme.palette.warning.light }}>
                <Typography variant="subtitle1" color="InfoText" align="center">
                  No Medical Records
                </Typography>
              </Card>
            )}
          </Box>

          {/* Visits Section */}
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Visit Records
          </Typography>
          {patientProfile.visits && patientProfile.visits.length > 0 ? (
            patientProfile.visits.map((visit, index) => (
              <Card
                key={visit._id}
                sx={{ padding: 2, marginBottom: 2, backgroundColor: theme.palette.grey[100] }}
              >
                <Typography variant="h6">Visit Record #{visit.visitNumber}</Typography>
                <Typography variant="subtitle1">
                  <strong>Date:</strong> {new Date(visit.visitDate).toLocaleDateString()}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Doctor:</strong> {visit.doctor.name} ({visit.doctor.role.toUpperCase()})
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Chief Complaint:</strong> {visit.complaints.chiefComplaint}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Known Complaint:</strong> {visit.complaints.knownComplaint}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Additional Complaint:</strong> {visit.complaints.additionalComplaint}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Primary Diagnosis:</strong> {visit.diagnosis.primary}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Secondary Diagnosis:</strong> {visit.diagnosis.secondary}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Assessment - HEENT:</strong> {visit.assessments.heent}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Assessment - Respiratory:</strong> {visit.assessments.respiratory}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Assessment - Gastrointestinal:</strong>{' '}
                  {visit.assessments.gastrointestinal}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Assessment - Genitourinary:</strong> {visit.assessments.genitourinary}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Assessment - Musculoskeletal:</strong> {visit.assessments.musculoskeletal}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Assessment - CNS:</strong> {visit.assessments.cns}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Instructions:</strong> {visit.instructions.notes}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Follow-Up:</strong>{' '}
                  {visit.followUp.length > 0
                    ? visit.followUp.map((followUp, fIndex) => (
                        <span key={followUp._id}>
                          {followUp.plan} on {new Date(followUp.followUpDate).toLocaleDateString()}{' '}
                          (via {followUp.consultationVia})
                          {fIndex < visit.followUp.length - 1 ? ', ' : ''}
                        </span>
                      ))
                    : 'No follow-up required'}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Referral:</strong>{' '}
                  {visit.referral.length > 0
                    ? visit.referral.map((ref, rIndex) => (
                        <span key={ref._id}>
                          {ref.specialty} to {ref.doctor} at {ref.hospital}
                          {rIndex < visit.referral.length - 1 ? ', ' : ''}
                        </span>
                      ))
                    : 'No referrals made'}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Notes:</strong> {visit.notes}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Prescriptions:</strong>{' '}
                  {visit.prescription.length > 0
                    ? visit.prescription.map((med, mIndex) => (
                        <span key={med._id}>
                          {med.medicationName} ({med.dosage}, {med.frequency})
                          {mIndex < visit.prescription.length - 1 ? ', ' : ''}
                        </span>
                      ))
                    : 'No prescriptions issued'}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Investigations:</strong>{' '}
                  {visit.investigations.length > 0
                    ? visit.investigations.map((investigation, iIndex) => (
                        <span key={investigation._id}>
                          {investigation.notes} ({investigation.reportPicture})
                          {iIndex < visit.investigations.length - 1 ? ', ' : ''}
                        </span>
                      ))
                    : 'No investigations performed'}
                </Typography>
              </Card>
            ))
          ) : (
            <Card sx={{ padding: 2, marginTop: 2, backgroundColor: theme.palette.warning.light }}>
              <Typography variant="subtitle1" color="InfoText" align="center">
                No Visit Records
              </Typography>
            </Card>
          )}
        </Card>
      )}
    </DashboardContent>
  );
}
