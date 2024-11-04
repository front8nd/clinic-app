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
  Grid,
  MenuItem,
  Select,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { DashboardContent } from '../../../layouts/dashboard/index';
import { Iconify } from '../../../components/iconify';
import { useRouter } from '../../../routes/hooks';
import { useSnackbar } from '../../../components/snackbar/snackbar';
import { newPatientProfile, reset } from '../../../redux/patientSlice';

export default function PatientNew() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();
  const { loading, isSuccess, isFailed } = useSelector((state) => state.patient);
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
    chronicConditions: '',
  });

  // Define fee options with string keys for compatibility
  const feeOptions = {
    full: 600,
    discount: 600,
  };

  // Initialize state variables for fee type and fees data
  const [feesType, setFeesType] = useState(''); // full/discount
  const [feesData, setFeesData] = useState({
    amount: 600,
    discount: 0,
    final: 600,
    visitedOn5D: false,
  });
  const [discounted, setDiscounted] = useState(0); // Discount amount entered by the user

  // Handle fees type selection
  const handleFeesType = (e) => {
    const selectedFeeType = e.target.value;
    setFeesType(selectedFeeType); // Update selected fee type

    if (selectedFeeType === 'full') {
      setFeesData({
        amount: feeOptions.full,
        discount: 0,
        final: feeOptions.full,
        visitedOn5D: false,
      });
    } else {
      // When discount is selected, calculate based on discounted amount
      const discountAmount = discounted;
      setFeesData({
        amount: feeOptions.full,
        discount: discountAmount,
        final: feeOptions.full - discountAmount,
        visitedOn5D: false,
      });
    }
  };

  // Handle discount input change
  const handleFeesDiscount = (e) => {
    let discountValue = parseInt(e.target.value, 10) || 0; // Convert input to integer

    // Ensure discount does not exceed the full fee
    if (discountValue > feeOptions.full) {
      discountValue = feeOptions.full; // Set discount to maximum allowable value
    }

    setDiscounted(discountValue); // Update discounted amount
  };

  // Update feesData when discount changes and discount option is selected
  useEffect(() => {
    if (feesType === 'discount') {
      setFeesData((prevData) => ({
        ...prevData,
        discount: discounted,
        final: feeOptions.full - discounted,
      }));
    }
  }, [discounted, feesType, feeOptions.full]);

  console.log(feesData);

  const changeHandler = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Separate the data into personal and medical info
    const personalInfo = {
      name: data.name,
      birthYear: data.birthYear,
      gender: data.gender,
      contact: data.contact,
      address: data.address,
      patientId: null,
      allergies: data.allergies,
      chronicConditions: data.chronicConditions,
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
      assistedBy: {
        id: userData?.user?._id,
        name: userData?.user?.name,
        email: userData?.user?.email,
        role: userData?.user?.role,
      },
      fees: feesData,
    };

    const additionalData = {
      personalInfo,
      medicalInfo,
    };
    console.log(additionalData);
    await dispatch(newPatientProfile(additionalData));
  };

  useEffect(() => {
    if (isSuccess) {
      openSnackbar('Patient Added Successfully', 'success');
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
                name="birthYear"
                label="Year of Birth"
                type="number"
                value={data.birthYear}
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
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Select
                value={feesType}
                onChange={handleFeesType}
                displayEmpty
                fullWidth
                required
                renderValue={(selected) =>
                  selected ? selected.toUpperCase() : <em>Select Fees</em>
                }
              >
                {Object.keys(feeOptions).map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            {feesType === 'discount' ? (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  name="discount Fees"
                  label="Discount Fees"
                  value={discounted}
                  onChange={handleFeesDiscount}
                  fullWidth
                />
              </Grid>
            ) : (
              ''
            )}
            <Grid item xs={12} sm={6} md={4}>
              <Stack>
                <Typography variant="caption" gutterBottom>
                  - Full Fees: Rs. {feesData.amount}
                </Typography>
                <Typography variant="caption" gutterBottom>
                  - Discount: Rs. {feesData.discount}
                </Typography>
                <Typography variant="caption" gutterBottom>
                  - Final Amount: Rs. {feesData.final}
                </Typography>
              </Stack>
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
                name="chronicConditions"
                label="chronic Conditions"
                value={data.chronicConditions}
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
