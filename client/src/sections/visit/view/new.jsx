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
import { newVisit, reset } from '../../../redux/visitSlice';

export default function VisitNew() {
  const router = useRouter();
  const { patientId } = useParams();
  const { openSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();
  const { loading, error, isSuccess, isFailed } = useSelector((state) => state.visit);
  const { userData } = useSelector((state) => state.auth);

  const [data, setData] = useState({
    visitNumber: '',
    visitType: 'initial',
    primaryDiagnosis: '',
    secondaryDiagnosis: '',
    diagnosisNotes: '',
    prescription: [
      { medicationName: '', dosage: '', frequency: '', duration: '', additionalInstructions: '' },
    ],
    chiefComplaint: '',
    knownComplaint: '',
    additionalComplaint: '',
    assessments: {
      heent: '',
      respiratory: '',
      gastrointestinal: '',
      genitourinary: '',
      musculoskeletal: '',
      cns: '',
    },
    investigations: [{ reportPicture: '', notes: '' }],
    instructions: { notes: '' },
    followUp: [{ followUpDate: '', consultationVia: 'offline', plan: '' }],
    referral: [{ specialty: '', doctor: '', hospital: '' }],
    notes: '',
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePrescriptionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPrescriptions = [...data.prescription];
    updatedPrescriptions[index][name] = value;
    setData((prevData) => ({ ...prevData, prescription: updatedPrescriptions }));
  };

  const handleInvestigationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedInvestigations = [...data.investigations];
    updatedInvestigations[index][name] = value;
    setData((prevData) => ({ ...prevData, investigations: updatedInvestigations }));
  };

  const handleFollowUpChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFollowUps = [...data.followUp];
    updatedFollowUps[index][name] = value;
    setData((prevData) => ({ ...prevData, followUp: updatedFollowUps }));
  };

  const handleReferralChange = (index, e) => {
    const { name, value } = e.target;
    const updatedReferrals = [...data.referral];
    updatedReferrals[index][name] = value;
    setData((prevData) => ({ ...prevData, referral: updatedReferrals }));
  };

  const handleAddPrescription = () => {
    setData((prevData) => ({
      ...prevData,
      prescription: [
        ...prevData.prescription,
        { medicationName: '', dosage: '', frequency: '', duration: '', additionalInstructions: '' },
      ],
    }));
  };

  const handleAddInvestigation = () => {
    setData((prevData) => ({
      ...prevData,
      investigations: [...prevData.investigations, { reportPicture: '', notes: '' }],
    }));
  };

  const handleAddFollowUp = () => {
    setData((prevData) => ({
      ...prevData,
      followUp: [...prevData.followUp, { followUpDate: '', consultationVia: 'offline', plan: '' }],
    }));
  };

  const handleAddReferral = () => {
    setData((prevData) => ({
      ...prevData,
      referral: [...prevData.referral, { specialty: '', doctor: '', hospital: '' }],
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const visitInfo = {
      doctor: {
        id: userData?.user?._id,
        name: userData?.user?.name,
        email: userData?.user?.email,
        role: userData?.user?.role,
      },
      visitType: data.visitType,
      date: new Date(),
      diagnosis: {
        primary: data.primaryDiagnosis,
        secondary: data.secondaryDiagnosis,
        notes: data.diagnosisNotes,
      },
      prescription: data.prescription,
      complaints: {
        chiefComplaint: data.chiefComplaint,
        knownComplaint: data.knownComplaint,
        additionalComplaint: data.additionalComplaint,
      },
      assessments: data.assessments,
      investigations: data.investigations,
      instructions: data.instructions,
      followUp: data.followUp,
      referral: data.referral,
      notes: data.notes,
    };

    const additionalData = { patientId, visitInfo };

    console.log(additionalData);

    await dispatch(newVisit(additionalData));
  };

  useEffect(() => {
    if (isSuccess) {
      openSnackbar('Patient Visit Record Added Successfully', 'success');
    } else if (isFailed?.message || isFailed?.error || isFailed) {
      openSnackbar(`${isFailed?.message || isFailed?.error || isFailed}`, 'error');
    }
    return () => {
      dispatch(reset());
    };
  }, [isSuccess, isFailed, router, openSnackbar, dispatch]);

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
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Medical Visit Information
              </Typography>
            </Grid>

            {/* Visit Type */}
            <Grid item xs={12} sm={6} md={4}>
              <Select
                name="visitType"
                value={data.visitType}
                onChange={changeHandler}
                fullWidth
                required
              >
                <MenuItem value="initial">Initial</MenuItem>
                <MenuItem value="follow-up">Follow-up</MenuItem>
                <MenuItem value="emergency">Emergency</MenuItem>
              </Select>
            </Grid>

            {/* Diagnosis */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Diagnosis
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="primaryDiagnosis"
                label="Primary Diagnosis"
                value={data.primaryDiagnosis}
                onChange={changeHandler}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="secondaryDiagnosis"
                label="Secondary Diagnosis"
                value={data.secondaryDiagnosis}
                onChange={changeHandler}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="diagnosisNotes"
                label="Diagnosis Notes"
                value={data.diagnosisNotes}
                onChange={changeHandler}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>

            {/* Prescription Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Prescription
              </Typography>
              {data.prescription.map((prescription, index) => (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  sx={{
                    marginBottom: '20px',
                  }}
                >
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="medicationName"
                      label="Medication Name"
                      value={prescription.medicationName}
                      onChange={(e) => handlePrescriptionChange(index, e)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="dosage"
                      label="Dosage"
                      value={prescription.dosage}
                      onChange={(e) => handlePrescriptionChange(index, e)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="frequency"
                      label="Frequency"
                      value={prescription.frequency}
                      onChange={(e) => handlePrescriptionChange(index, e)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      name="duration"
                      label="Duration"
                      value={prescription.duration}
                      onChange={(e) => handlePrescriptionChange(index, e)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="additionalInstructions"
                      label="Additional Instructions"
                      value={prescription.additionalInstructions}
                      onChange={(e) => handlePrescriptionChange(index, e)}
                      fullWidth
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              ))}
              <Button variant="outlined" onClick={handleAddPrescription}>
                Add Prescription
              </Button>
            </Grid>

            {/* Complaints Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Complaints
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="chiefComplaint"
                label="Chief Complaint"
                value={data.chiefComplaint}
                onChange={changeHandler}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="knownComplaint"
                label="Known Complaint"
                value={data.knownComplaint}
                onChange={changeHandler}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="additionalComplaint"
                label="Additional Complaint"
                value={data.additionalComplaint}
                onChange={changeHandler}
                fullWidth
              />
            </Grid>

            {/* Assessments Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Assessments
              </Typography>
            </Grid>
            {Object.entries(data.assessments).map(([key, value]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <TextField
                  name={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={value}
                  onChange={(e) =>
                    setData((prevData) => ({
                      ...prevData,
                      assessments: { ...prevData.assessments, [key]: e.target.value },
                    }))
                  }
                  fullWidth
                />
              </Grid>
            ))}

            {/* Investigations Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Investigations
              </Typography>
              {data.investigations.map((investigation, index) => (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  sx={{
                    marginBottom: '20px',
                  }}
                >
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="reportPicture"
                      label="Report Picture URL"
                      value={investigation.reportPicture}
                      onChange={(e) => handleInvestigationChange(index, e)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="notes"
                      label="Notes"
                      value={investigation.notes}
                      onChange={(e) => handleInvestigationChange(index, e)}
                      fullWidth
                      multiline
                      rows={1}
                    />
                  </Grid>
                </Grid>
              ))}
              <Button variant="outlined" onClick={handleAddInvestigation}>
                Add Investigation
              </Button>
            </Grid>

            {/* Instructions Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              <TextField
                name="notes"
                label="Notes"
                value={data.instructions.notes}
                onChange={(e) =>
                  setData((prevData) => ({
                    ...prevData,
                    instructions: { notes: e.target.value },
                  }))
                }
                fullWidth
                multiline
                rows={4}
              />
            </Grid>

            {/* Follow Up Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Follow Up
              </Typography>
              {data.followUp.map((followUp, index) => (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  sx={{
                    marginBottom: '20px',
                  }}
                >
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name="followUpDate"
                      label="Follow Up Date"
                      type="date"
                      value={followUp.followUpDate}
                      onChange={(e) => handleFollowUpChange(index, e)}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Select
                      name="consultationVia"
                      value={followUp.consultationVia}
                      onChange={(e) => handleFollowUpChange(index, e)}
                      fullWidth
                    >
                      <MenuItem value="offline">Offline</MenuItem>
                      <MenuItem value="online">Online</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name="plan"
                      label="Plan"
                      value={followUp.plan}
                      onChange={(e) => handleFollowUpChange(index, e)}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              ))}
              <Button variant="outlined" onClick={handleAddFollowUp}>
                Add Follow Up
              </Button>
            </Grid>

            {/* Referral Section */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Referral
              </Typography>
              {data.referral.map((referral, index) => (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  sx={{
                    marginBottom: '20px',
                  }}
                >
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name="specialty"
                      label="Specialty"
                      value={referral.specialty}
                      onChange={(e) => handleReferralChange(index, e)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name="doctor"
                      label="Doctor"
                      value={referral.doctor}
                      onChange={(e) => handleReferralChange(index, e)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name="hospital"
                      label="Hospital"
                      value={referral.hospital}
                      onChange={(e) => handleReferralChange(index, e)}
                      fullWidth
                    />
                  </Grid>
                </Grid>
              ))}
              <Button variant="outlined" onClick={handleAddReferral}>
                Add Referral
              </Button>
            </Grid>

            {/* Additional Notes */}
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Additional Notes"
                value={data.notes}
                onChange={changeHandler}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>

            {/* Submit Button */}
            <Grid
              item
              xs={12}
              md={4}
              lg={4}
              sx={{
                margin: '0 auto',
              }}
            >
              <LoadingButton
                type="submit"
                size="large"
                variant="contained"
                loading={loading}
                fullWidth
              >
                Submit
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Card>
    </DashboardContent>
  );
}
