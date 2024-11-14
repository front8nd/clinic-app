import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import { newPatientMedicalInfo, reset } from '../../../redux/medicalRecordSlice';
import { appointmentSlots } from '../../../redux/appointmentSlice';
import formatTime12Hour from '../../../utils/12HoursFormater';
import { isWithinWorkingHours } from '../../../utils/workingHoursChecker';

export default function MedicalNew() {
  const router = useRouter();
  const { patientId } = useParams();
  const { openSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();
  const { loading, error, isSuccess } = useSelector((state) => state.medicalRecord);
  const { patientProfile } = useSelector((state) => state.patientProfile);
  const { todayAppointments } = useSelector((state) => state.appointment);

  const { userData } = useSelector((state) => state.auth);

  const [data, setData] = useState({
    // Medical Info
    weight: '',
    height: '',
    pulse_rate: '',
    resp_rate: '',
    spo2: '',
    temp: '',
    rbs: '',
    blood_pressure_sys: '',
    blood_pressure_dia: '',

    // Appointment
    appointmentTime: '',
    type: 'offline',
    status: 'scheduled',
  });

  // Appoinment

  const appointmentType = ['online', 'offline'];
  const appoinmentStatus = ['scheduled', 'completed', 'cancelled'];

  // Define fee options with string keys for compatibility
  const feeOptions = {
    full: 600,
    discount: 600,
  };

  // Initialize state variables for fee type and fees data
  const [feesType, setFeesType] = useState(''); // full/discount
  const [feesData, setFeesData] = useState({
    amount: feeOptions.full,
    discount: 0,
    final: feeOptions.full,
    visitedOn5D: 0,
  });
  const [discounted, setDiscounted] = useState(0); // Discount amount entered by the user
  const [isWithin5Days, setIsWithin5Days] = useState(false); // Check if visit date is within 5 days

  // Date today
  const dateToday = new Date();

  // Handle fees type selection
  const handleFeesType = (e) => {
    const selectedFeeType = e.target.value;
    setFeesType(selectedFeeType); // Update selected fee type

    // Calculate the 5-day discount if applicable
    const visitDiscount = isWithin5Days ? 100 : 0;

    // Determine the combined discount, ensuring it does not exceed the full fee
    const totalDiscount = Math.min(discounted + visitDiscount, feeOptions.full);

    if (selectedFeeType === 'full') {
      // Full fee with 5-day discount if applicable
      setFeesData({
        amount: feeOptions.full,
        discount: 0,
        final: feeOptions.full - visitDiscount,
        visitedOn5D: visitDiscount,
      });
    } else {
      // Discounted fee with both discounts considered, capped to the full fee
      setFeesData({
        amount: feeOptions.full,
        discount: discounted,
        final: feeOptions.full - totalDiscount,
        visitedOn5D: visitDiscount,
      });
    }
  };

  // Handle discount input change with validation
  const handleFeesDiscount = (e) => {
    let discountValue = parseInt(e.target.value, 10) || 0; // Convert input to integer

    // Ensure that the discount value plus the 5-day discount does not exceed the full fee
    if (discountValue + (isWithin5Days ? 100 : 0) > feeOptions.full) {
      discountValue = feeOptions.full - (isWithin5Days ? 100 : 0);
    }

    setDiscounted(discountValue); // Update discounted amount
  };

  // Update feesData when discount changes and discount option is selected
  useEffect(() => {
    const visitDiscount = isWithin5Days ? 100 : 0; // Discount if within 5 days

    if (feesType === 'discount') {
      const totalDiscount = Math.min(discounted + visitDiscount, feeOptions.full);
      setFeesData((prevData) => ({
        ...prevData,
        discount: discounted,
        final: feeOptions.full - totalDiscount,
        visitedOn5D: visitDiscount,
      }));
    }
  }, [discounted, feesType, isWithin5Days, feeOptions.full]);

  // Check if visit date is within 5 days of today
  useEffect(() => {
    if (patientProfile && patientProfile?.medicalInfo[0]?.visitDate) {
      const visitDate = new Date(patientProfile?.medicalInfo[0]?.visitDate);
      const differenceInDays = (dateToday - visitDate) / (1000 * 60 * 60 * 24);

      if (differenceInDays >= 0 && differenceInDays <= 5) {
        setIsWithin5Days(true);
        const totalDiscount = Math.min(discounted + 100, feeOptions.full);
        setFeesData((prevData) => ({
          ...prevData,
          visitedOn5D: 100,
          final: feeOptions.full - totalDiscount,
        }));
      } else {
        setIsWithin5Days(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientProfile, discounted, feeOptions.full]);

  const [extendSlots, setExtentSlots] = useState(false);
  const slotsHandler = () => {
    setExtentSlots((prev) => !prev);
  };

  const changeHandler = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

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

    const appointmentInfo = {
      appointmentTime: extendSlots ? formatTime12Hour() : data?.appointmentTime,
      type: data?.type,
      status: data?.status,
    };

    const additionalData = {
      medicalInfo,
      patientId,
      appointmentInfo,
    };
    console.log(additionalData);
    await dispatch(newPatientMedicalInfo(additionalData));
  };

  useEffect(() => {
    dispatch(appointmentSlots());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      openSnackbar('Patient Medical Record Added Successfully', 'success');
    } else if (error?.message || error?.error || error) {
      openSnackbar(`${error?.message || error?.error || error}`, 'error');
    }
    return () => {
      dispatch(reset());
    };
  }, [isSuccess, error, router, openSnackbar, dispatch]);

  console.log(extendSlots);
  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Add New Patient Medical Record
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
                  · Visted Within 5 Day : - {feesData.visitedOn5D} Rs.
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
                    key={option?.time}
                    value={option?.time}
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
                      {option?.time}
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
                  Add New Medical Record
                </LoadingButton>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Card>
    </DashboardContent>
  );
}
