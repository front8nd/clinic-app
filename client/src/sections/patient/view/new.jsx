import { useEffect, useState } from 'react';
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
import { newPatientProfile, resetErrors } from '../../../redux/patientSlice';

export default function PatientNew() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();
  const { loading, registrationSuccess, registrationError } = useSelector((state) => state.patient);
  const { userData } = useSelector((state) => state.auth);

  const genderOptions = ['male', 'female'];

  const [data, setData] = useState({
    // Personal Information
    name: '',
    age: '',
    gender: '',
    contact: '',
    address: '',

    // Medical Information
    weight: '',
    height: '',
    pulse_rate: '',
    resp_rate: '',
    spo2: '',
    temp: '',
    rbs: '',
    blood_pressure_sys: '',
    blood_pressure_dia: '',
    allergies: '',
    chronic: '',
  });

  const [feeType, setFeeType] = useState('full'); // Manage fee type
  const [customFees, setCustomFees] = useState({ full: true, custom: '' });

  const changeHandler = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleFeesTypeChange = (e) => {
    const selectedType = e.target.value;
    setFeeType(selectedType);
    setCustomFees({ full: selectedType === 'full', custom: '' }); // Reset custom fees when toggling
  };

  const feesHandler = (e) => {
    const value = e.target.value;
    setCustomFees((prevData) => ({ ...prevData, custom: value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Separate the data into personal and medical info
    const personalInfo = {
      name: data.name,
      age: data.age,
      gender: data.gender,
      contact: data.contact,
      address: data.address,
      patientId: null,
      allergies: data.allergies,
      chronic: data.chronic,
      assistedBy: {
        id: userData?.user?._id,
        name: userData?.user?.name,
        email: userData?.user?.email,
        role: userData?.user?.role,
      },
    };

    const medicalInfo = {
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
      fees: { full: customFees.full, custom: customFees.custom },
      assistedBy: {
        id: userData?.user?._id,
        name: userData?.user?.name,
        email: userData?.user?.email,
        role: userData?.user?.role,
      },
    };

    const additionalData = {
      personalInfo,
      medicalInfo,
    };
    await dispatch(newPatientProfile(additionalData));
  };

  useEffect(() => {
    if (registrationSuccess) {
      openSnackbar('Patient Added Successfully', 'success');
    } else if (registrationError?.message || registrationError?.error) {
      openSnackbar(`${registrationError?.message || registrationError?.error}`, 'error');
    }
    return () => {
      dispatch(resetErrors());
    };
  }, [registrationSuccess, registrationError, router, openSnackbar, dispatch]);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Add New Patient
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
            {/* Personal Information Section */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Personal Information
              </Typography>
            </Grid>

            {/* Personal Information Fields */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="name"
                label="Name"
                value={data.name}
                onChange={changeHandler}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="age"
                label="Age"
                type="number"
                value={data.age}
                onChange={changeHandler}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Select
                name="gender"
                value={data.gender}
                onChange={changeHandler}
                displayEmpty
                fullWidth
                required
                renderValue={(selected) => selected?.toUpperCase() || <em>Select Gender</em>}
              >
                {genderOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="contact"
                label="Contact Number"
                value={data.contact}
                onChange={changeHandler}
                type="tel"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="address"
                label="Address"
                value={data.address}
                onChange={changeHandler}
                fullWidth
              />
            </Grid>

            {/* Fees Information Section */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Fees
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={4}>
                  <Select
                    name="feeToggler"
                    value={feeType}
                    onChange={handleFeesTypeChange}
                    displayEmpty
                    fullWidth
                    required
                    renderValue={(selected) => selected?.toUpperCase() || <em>Select Fees Type</em>}
                  >
                    <MenuItem value="full">FULL</MenuItem>
                    <MenuItem value="custom">CUSTOM</MenuItem>
                  </Select>
                </Grid>
                {feeType === 'custom' && (
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      name="customFees"
                      label="Custom Fees"
                      type="number"
                      value={customFees.custom}
                      onChange={feesHandler}
                      fullWidth
                      required
                    />
                  </Grid>
                )}
              </Grid>
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
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="allergies"
                label="Allergies"
                value={data.allergies}
                onChange={changeHandler}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                name="chronic"
                label="Chronic Conditions"
                value={data.chronic}
                onChange={changeHandler}
                fullWidth
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
                  Create Profile
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Card>
    </DashboardContent>
  );
}
