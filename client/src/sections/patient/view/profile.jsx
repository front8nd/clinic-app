import { jsPDF } from 'jspdf';
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
  TableHead,
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

  // Helper function to find the visit record based on AppointmentNumber
  const getVisitByAppointmentNumber = (appointmentNumber) =>
    patientProfile.visits.find((e) => e.appointmentNumber === appointmentNumber);

  // Helper function to find the fees record based on AppointmentNumber
  const getFeesByAppointmentNumber = (appointmentNumber) =>
    patientProfile.feesInfo.find((e) => e.appointmentNumber === appointmentNumber);

  const createPdf = () => {
    // eslint-disable-next-line new-cap
    const doc = new jsPDF();

    const patient = patientProfile.patient;
    const firstMedicalInfo = patientProfile.medicalInfo[0];
    const firstVisit = patientProfile.visits[0];

    // Add Patient Profile to the PDF
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Patient Profile', 10, 10);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Name: ${patient.name}`, 10, 20);
    doc.text(`Patient ID: ${patient.patientId}`, 10, 30);
    doc.text(`Birth Year: ${patient.birthYear}`, 10, 40);
    doc.text(`Gender: ${patient.gender}`, 10, 50);
    doc.text(`Contact: ${patient.contact}`, 10, 60);
    doc.text(`Address: ${patient.address}`, 10, 70);
    doc.text(`Allergies: ${patient.allergies}`, 10, 80);
    doc.text(`Chronic Conditions: ${patient.chronicConditions}`, 10, 90);

    // Add Medical Information
    doc.setFont('Helvetica', 'bold');
    doc.text('Medical Information', 10, 110);

    doc.setFont('Helvetica', 'normal');
    doc.text(
      `Blood Pressure: ${firstMedicalInfo.blood_pressure.sys}/${firstMedicalInfo.blood_pressure.dia}`,
      10,
      120
    );
    doc.text(`Weight: ${firstMedicalInfo.weight} kg`, 10, 130);
    doc.text(`Height: ${firstMedicalInfo.height} cm`, 10, 140);
    doc.text(`Pulse Rate: ${firstMedicalInfo.pulse_rate} bpm`, 10, 150);
    doc.text(`Respiratory Rate: ${firstMedicalInfo.resp_rate} bpm`, 10, 160);
    doc.text(`SpO2: ${firstMedicalInfo.spo2} %`, 10, 170);
    doc.text(`Temperature: ${firstMedicalInfo.temp} °C`, 10, 180);
    doc.text(`RBS: ${firstMedicalInfo.rbs} mg/dL`, 10, 190);
    doc.text(`Fees: $${firstMedicalInfo.fees.final}`, 10, 200);

    // Add First Visit Information
    doc.setFont('Helvetica', 'bold');
    doc.text('First Visit Information', 10, 220);

    if (firstVisit) {
      doc.setFont('Helvetica', 'normal');
      doc.text(`Appointment Time: ${firstVisit.appointmentTime}`, 10, 230);
      doc.text(`Type: ${firstVisit.type}`, 10, 240);
      doc.text(`Status: ${firstVisit.status}`, 10, 250);
    } else {
      doc.text('No visit records available', 10, 230);
    }

    // Save the PDF
    doc.save('Patient_Profile.pdf');
  };

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
              <Button
                onClick={() => {
                  createPdf();
                }}
              >
                PDF
              </Button>
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
            sx={{
              marginBottom: 3,
            }}
          >
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
                <Avatar sx={{ bgcolor: theme.palette.primary.ligher, width: 64, height: 64 }}>
                  {/* <Iconify icon="carbon:user-avatar-filled" /> */}
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
                      {patientProfile?.patient?.assistedBy?.name} (
                      {patientProfile?.patient?.assistedBy?.role?.toUpperCase() || 'None'})
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

          {/* Loop through medicalInfo and visit records */}
          {patientProfile.medicalInfo && patientProfile.medicalInfo.length > 0 ? (
            patientProfile.medicalInfo.map((info) => {
              const correspondingVisit = getVisitByAppointmentNumber(info.appointmentNumber);

              const correspondingFees = getFeesByAppointmentNumber(info.appointmentNumber);

              return (
                <Card
                  key={info._id}
                  sx={{
                    padding: 2,
                    marginBottom: 4,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                >
                  <Grid container spacing={0}>
                    {/* Medical Record Section */}
                    <Grid
                      container
                      spacing={0}
                      sx={{
                        padding: 2,
                        background: '#ececec',
                        borderRadius: '10px',
                      }}
                    >
                      {/* Visit Details Section */}
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            borderLeft: '5px solid #0d2f55',
                            padding: '10px 15px',
                            color: ' #0d2f55',
                            marginBottom: '20px',
                            width: 'fit-content',
                            borderRadius: '4px',
                          }}
                        >
                          Medical Report #{info.appointmentNumber}
                        </Typography>
                        <Divider sx={{ marginBottom: 2 }} />
                        <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                          <strong>Visit Date:</strong>{' '}
                          {new Date(info.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                          <strong>Assisted By:</strong> {info.assistedBy.name} (
                          {info.assistedBy.role.toUpperCase()})
                        </Typography>
                        <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                          <strong>Fees Charged:</strong> {correspondingFees?.final} -/Rs
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

                    {/* Visit Record Section */}
                    {correspondingVisit ? (
                      <Grid container spacing={2} sx={{ padding: 1, marginTop: 3 }}>
                        {/* Visit Information Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" gutterBottom>
                            Basic Details
                            {/* Visit Record #{correspondingVisit.AppointmentNumber} */}
                          </Typography>
                          <Divider sx={{ marginBottom: 2 }} />
                          {/* <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                            <strong>Date:</strong>{' '}
                            {new Date(correspondingVisit.createdAt).toLocaleDateString()}
                          </Typography> */}
                          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                            <strong>Doctor:</strong> {correspondingVisit.doctor.name} (
                            {correspondingVisit.doctor.role.toUpperCase()})
                          </Typography>
                          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                            <strong>Chief Complaint:</strong>{' '}
                            {correspondingVisit.complaints.chiefComplaint}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                            <strong>Known Complaint:</strong>{' '}
                            {correspondingVisit.complaints.knownComplaint}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                            <strong>Additional Complaint:</strong>{' '}
                            {correspondingVisit.complaints.additionalComplaint}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
                            <strong>Diagnosis Notes:</strong> {correspondingVisit.diagnosis.notes}
                          </Typography>
                        </Grid>

                        {/* Investigations Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" gutterBottom>
                            Investigations
                          </Typography>
                          <Divider sx={{ marginBottom: 2 }} />
                          {correspondingVisit.investigations.map((inv) => (
                            <Typography key={inv._id} variant="subtitle1" sx={{ marginBottom: 1 }}>
                              <strong>Report:</strong> {inv.reportPicture}
                              <br />
                              <em>Notes:</em> {inv.notes}
                            </Typography>
                          ))}
                        </Grid>

                        {/* Prescriptions Section */}
                        <Grid item xs={12} md={12}>
                          <Typography variant="h6" gutterBottom>
                            Prescriptions
                          </Typography>
                          <Divider sx={{ marginBottom: 2 }} />
                          <Box sx={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 300 }}>
                            <Table size="small" aria-label="prescriptions table">
                              <TableHead>
                                <TableRow>
                                  <TableCell>
                                    <strong>#</strong>
                                  </TableCell>
                                  <TableCell>
                                    <strong>Medication Name</strong>
                                  </TableCell>
                                  <TableCell>
                                    <strong>Dosage</strong>
                                  </TableCell>
                                  <TableCell>
                                    <strong>Frequency</strong>
                                  </TableCell>
                                  <TableCell>
                                    <strong>Duration</strong>
                                  </TableCell>
                                  <TableCell>
                                    <strong>Instructions</strong>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {correspondingVisit.prescription.map((med, index) => (
                                  <TableRow key={med._id}>
                                    {/* Display the index, adding 1 to make it 1-based instead of 0-based */}
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{med.medicationName}</TableCell>
                                    <TableCell>{med.dosage}</TableCell>
                                    <TableCell>{med.frequency}</TableCell>
                                    <TableCell>{med.duration}</TableCell>
                                    <TableCell>{med.additionalInstructions}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </Box>
                        </Grid>

                        {/* Follow-Up Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
                            Follow-Up
                          </Typography>
                          <Divider sx={{ marginBottom: 2 }} />
                          {correspondingVisit.followUp.map((follow) => (
                            <Typography
                              key={follow._id}
                              variant="subtitle1"
                              sx={{ marginBottom: 1 }}
                            >
                              <strong>Date:</strong>{' '}
                              {new Date(follow.followUpDate).toLocaleDateString()}
                              <br />
                              <strong>Consultation:</strong> {follow.consultationVia?.toUpperCase()}
                              <br />
                              <strong>Plan:</strong> {follow.plan}
                            </Typography>
                          ))}
                        </Grid>

                        {/* Referrals Section */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" gutterBottom sx={{ marginTop: 3 }}>
                            Referrals
                          </Typography>
                          <Divider sx={{ marginBottom: 2 }} />
                          {correspondingVisit.referral.map((ref) => (
                            <Typography key={ref._id} variant="subtitle1" sx={{ marginBottom: 1 }}>
                              <strong>Specialty:</strong> {ref.specialty}
                              <br />
                              <strong>Doctor:</strong> {ref.doctor}
                              <br />
                              <strong>Hospital:</strong> {ref.hospital}
                            </Typography>
                          ))}
                        </Grid>

                        {/* Additional Notes Section */}
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" sx={{ marginTop: 3 }}>
                            <strong>Additional Notes:</strong> {correspondingVisit.notes}
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : (
                      <Card
                        sx={{
                          padding: 3,
                          marginTop: 3,
                          backgroundColor: theme.palette.warning.light,
                          width: '100%',
                        }}
                      >
                        <Typography variant="subtitle1" color="InfoText" align="center">
                          No Visit Record
                        </Typography>
                      </Card>
                    )}
                  </Grid>
                </Card>
              );
            })
          ) : (
            <Card sx={{ padding: 3, marginTop: 3, backgroundColor: theme.palette.warning.light }}>
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
