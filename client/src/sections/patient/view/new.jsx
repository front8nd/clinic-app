import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Checkbox,
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
import { appointmentSlots } from '../../../redux/appointmentSlice';
import formatTime12Hour from '../../../utils/12HoursFormater';
import { configData } from '../../../redux/configSlice';
import getCurrentHalfHour from '../../../utils/getCurrentHalfHour';

export default function PatientNew() {
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();
  const { openSnackbar } = useSnackbar();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { userData } = useSelector((state) => state.auth);
  const { configDetails } = useSelector((state) => state.config);
  const { loading, isSuccess, isFailed } = useSelector((state) => state.patient);
  const { todayAppointments } = useSelector((state) => state.appointment);

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

    // Appointment
    appointmentTime: '',
    type: 'offline',
    status: 'scheduled',
  });

  // Define fee options with string keys for compatibility
  const feeOptions = {
    full: 600,
    discount: 600,
  };

  // Initialize state variables for fee type and fees data
  const [feesType, setFeesType] = useState('');
  const [feesData, setFeesData] = useState({
    amount: 0,
    discount: 0,
    final: 0,
    visitedOn5D: false,
  });
  const [discounted, setDiscounted] = useState(0); // Discount amount entered by the user

  useEffect(() => {
    if (configDetails?.Data) {
      const fullFee = configDetails?.Data?.appointmentFees;
      setFeesData({
        amount: fullFee,
        discount: 0,
        final: fullFee,
      });
    }
  }, [configDetails]);

  // Handle fees type selection
  const handleFeesType = (e) => {
    const selectedFeeType = e.target.value;
    setFeesType(selectedFeeType);

    if (selectedFeeType === 'full') {
      // Reset to full fee when 'full' is selected
      setFeesData({
        amount: configDetails?.Data?.appointmentFees,
        discount: 0,
        final: configDetails?.Data?.appointmentFees,
        visitedOn5D: false,
      });
    } else {
      // When discount is selected, apply the discount logic
      const discountAmount = discounted;
      setFeesData({
        amount: configDetails?.Data?.appointmentFees,
        discount: discountAmount,
        final: (configDetails?.Data?.appointmentFees ?? 0) - discounted,
        visitedOn5D: false,
      });
    }
  };

  // Handle discount input change
  const handleFeesDiscount = (e) => {
    let discountValue = parseInt(e.target.value, 10) || 0;

    // Ensure discount does not exceed the full fee
    if (discountValue > configDetails?.Data?.appointmentFees) {
      discountValue = configDetails?.Data?.appointmentFees; // Set discount to maximum allowable value
    }

    setDiscounted(discountValue);
  };

  useEffect(() => {
    if (feesType === 'discount') {
      // Update the final fee whenever the discount changes
      setFeesData((prevData) => ({
        ...prevData,
        discount: discounted,
        final: (configDetails?.Data?.appointmentFees ?? 0) - discounted,
        visitedOn5D: false,
      }));
    }
  }, [discounted, feesType, configDetails?.Data?.appointmentFees]);

  const [extendSlots, setExtentSlots] = useState(false);

  const slotsHandler = () => {
    setExtentSlots((prev) => !prev);
  };

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

    const currentHalfHour = getCurrentHalfHour();
    const appointmentInfo = {
      appointmentTime: extendSlots ? currentHalfHour : data?.appointmentTime,
      type: data?.type,
      status: data?.status,
      ...(extendSlots === false && { isSpecialSlot: false }),
      ...(extendSlots === true && { isSpecialSlot: true }),
    };

    const additionalData = {
      personalInfo,
      medicalInfo,
      appointmentInfo,
    };
    console.log(additionalData);
    await dispatch(newPatientProfile(additionalData));
  };

  useEffect(() => {
    dispatch(appointmentSlots());
  }, [dispatch]);

  useEffect(() => {
    dispatch(configData());
  }, [dispatch]);

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

  console.log(todayAppointments);

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
                  · Full Fees: Rs. {feesData.amount} Rs.
                </Typography>
                <Typography variant="caption" gutterBottom>
                  · Furthur Discount: {feesData.discount} Rs.
                </Typography>
                <Typography variant="caption" gutterBottom>
                  · Final Amount: {feesData.final} Rs.
                </Typography>
              </Stack>
            </Grid>

            {/* Appoinment Information Section */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Appoinment
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Select
                name="appointmentTime"
                value={data.appointmentTime}
                onChange={changeHandler}
                displayEmpty
                fullWidth
                required={!extendSlots}
                renderValue={(selected) =>
                  selected?.toUpperCase() || <em>Select Appointment Date Time </em>
                }
              >
                {todayAppointments?.slots.map((option) => (
                  <MenuItem
                    key={option?.time?.timeRange}
                    value={option?.time?.timeRange}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                      }}
                    >
                      {option?.time?.timeRange}
                    </Typography>
                    <Typography color={option?.available === true ? 'green' : 'red'}>
                      {option?.available === true ? 'Available' : 'Booked'}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Checkbox color="secondary" value={extendSlots} onChange={slotsHandler} />
              <Typography variant="caption">
                In Case of Non Workings or Slots Limit Reached, Check this Box.
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
                label="Chronic Conditions"
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
