import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { CircularProgress, Grid, MenuItem, Select, useMediaQuery, useTheme } from '@mui/material';

import { _users } from '../../_mock';
import { DashboardContent } from '../../layouts/dashboard/index';

import { Iconify } from '../../components/iconify';
import { useRouter } from '../../routes/hooks';

import { reset, configData, updateConfigData } from '../../redux/configSlice';

import { useSnackbar } from '../../components/snackbar/snackbar';
import { Label } from '../../components/label';

export default function UserNew() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { openSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const hoursArray = [
    { hour: 1, label: '1:00 AM' },
    { hour: 2, label: '2:00 AM' },
    { hour: 3, label: '3:00 AM' },
    { hour: 4, label: '4:00 AM' },
    { hour: 5, label: '5:00 AM' },
    { hour: 6, label: '6:00 AM' },
    { hour: 7, label: '7:00 AM' },
    { hour: 8, label: '8:00 AM' },
    { hour: 9, label: '9:00 AM' },
    { hour: 10, label: '10:00 AM' },
    { hour: 11, label: '11:00 AM' },
    { hour: 12, label: '12:00 PM' },
    { hour: 13, label: '1:00 PM' },
    { hour: 14, label: '2:00 PM' },
    { hour: 15, label: '3:00 PM' },
    { hour: 16, label: '4:00 PM' },
    { hour: 17, label: '5:00 PM' },
    { hour: 18, label: '6:00 PM' },
    { hour: 19, label: '7:00 PM' },
    { hour: 20, label: '8:00 PM' },
    { hour: 21, label: '9:00 PM' },
    { hour: 22, label: '10:00 PM' },
    { hour: 23, label: '11:00 PM' },
    { hour: 24, label: '12:00 AM' },
  ];

  const { configDetails, isSuccess, isFailed, loading } = useSelector((state) => state.config);

  const [data, setData] = useState({
    morning_start: 1,
    morning_end: 1,
    evening_start: 1,
    evening_end: 1,
    maxSlots: 1,
    appointmentFees: 1,
    fifthDayDiscount: 1,
  });

  const changeHandler = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: parseInt(e.target.value, 10) }));
  };

  // Handle submit w
  const handleClick = async (e) => {
    e.preventDefault();

    const additionalData = {
      appointmentFees: data?.appointmentFees,
      fifthDayDiscount: data?.fifthDayDiscount,
      maxSlots: data?.maxSlots,
      clinicHours: {
        morning: {
          start: data?.morning_start,
          end: data?.morning_end,
        },
        evening: {
          start: data?.evening_start,
          end: data?.evening_end,
        },
      },
    };
    console.log(additionalData);

    await dispatch(updateConfigData(additionalData));
  };

  useEffect(() => {
    dispatch(configData());
  }, [dispatch]);

  useEffect(() => {
    if (configDetails) {
      setData({
        appointmentFees: configDetails?.Data?.appointmentFees,
        fifthDayDiscount: configDetails?.Data?.fifthDayDiscount,
        maxSlots: configDetails?.Data?.maxSlots,
        morning_start: configDetails?.Data?.clinicHours?.morning?.start,
        morning_end: configDetails?.Data?.clinicHours?.morning?.end,
        evening_start: configDetails?.Data?.clinicHours?.evening?.start,
        evening_end: configDetails?.Data?.clinicHours?.evening?.end,
      });
    }
  }, [configDetails]);

  console.log(configDetails);

  useEffect(() => {
    if (isSuccess) {
      openSnackbar('Settings Updated Successful', 'success');
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
          Settings
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
            {/* Clinic Hours */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Clinic Hours
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4} md={6}>
              <Label
                sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
              >
                Morning
              </Label>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Select
                name="morning_start"
                value={data.morning_start}
                onChange={changeHandler}
                displayEmpty
                fullWidth
                required
                renderValue={(selected) => {
                  const value = hoursArray.find((e) => e.hour === selected);
                  return value?.label?.toUpperCase() || <em> Ending Time </em>;
                }}
              >
                {hoursArray.map((option) => (
                  <MenuItem key={option.hour} value={option.hour}>
                    {option.label.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Select
                name="morning_end"
                value={data.morning_end}
                onChange={changeHandler}
                displayEmpty
                fullWidth
                required
                renderValue={(selected) => {
                  const value = hoursArray.find((e) => e.hour === selected);
                  return value?.label?.toUpperCase() || <em> Ending Time </em>;
                }}
              >
                {hoursArray.map((option) => (
                  <MenuItem key={option.hour} value={option.hour}>
                    {option.label.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={4} md={6}>
              <Label
                sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
              >
                Evening
              </Label>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Select
                name="evening_start"
                value={data.evening_start}
                onChange={changeHandler}
                displayEmpty
                fullWidth
                required
                renderValue={(selected) => {
                  const value = hoursArray.find((e) => e.hour === selected);
                  return value?.label?.toUpperCase() || <em> Ending Time </em>;
                }}
              >
                {hoursArray.map((option) => (
                  <MenuItem key={option.hour} value={option.hour}>
                    {option.label.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <Select
                name="evening_end"
                value={data.evening_end}
                onChange={changeHandler}
                displayEmpty
                fullWidth
                required
                renderValue={(selected) => {
                  const value = hoursArray.find((e) => e.hour === selected);
                  return value?.label?.toUpperCase() || <em> Ending Time </em>;
                }}
              >
                {hoursArray.map((option) => (
                  <MenuItem key={option.hour} value={option.hour}>
                    {option.label.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={8} md={6}>
              <Label
                sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
              >
                Maximum Slots
              </Label>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                name="maxSlots"
                label="Slots"
                type="number"
                value={data.maxSlots}
                onChange={changeHandler}
                required
                fullWidth
              />
            </Grid>

            {/* Clinic Fees */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Fees
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4} md={6}>
              <Label
                sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
              >
                Fees
              </Label>
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <TextField
                name="appointmentFees"
                label="Appointment Fees"
                type="number"
                value={data.appointmentFees}
                onChange={changeHandler}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <TextField
                name="fifthDayDiscount"
                label="5th Day Discount"
                type="number"
                value={data.fifthDayDiscount}
                onChange={changeHandler}
                required
                fullWidth
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Submit Details
              </Typography>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} sm={4} md={6}>
              <Box display="flex" alignItems="center" height="100%">
                <Label sx={{ fontSize: '0.9rem', padding: '20px' }}>Submit</Label>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="inherit"
              >
                {loading === false ? (
                  'Submit'
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
