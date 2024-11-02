import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { CircularProgress, Grid, MenuItem, Select, useMediaQuery, useTheme } from '@mui/material';

import { _users } from '../../../_mock';
import { DashboardContent } from '../../../layouts/dashboard/index';

import { Iconify } from '../../../components/iconify';
import { useRouter } from '../../../routes/hooks';

import { useSnackbar } from '../../../components/snackbar/snackbar';
import { Label } from '../../../components/label';
import generatePatientID from '../../../utils/patientID';
import { newPatientProfile, resetErrors } from '../../../redux/patientSlice';

export default function PatientNew() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();
  const { patient, loading, registrationSuccess, registrationError } = useSelector(
    (state) => state.patient
  );

  const { userData } = useSelector((state) => state.auth);

  const gender = ['male', 'female'];
  const blood_groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const [data, setData] = useState({});

  const changeHandler = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  // Handle submit with password validation
  const handleClick = async (e) => {
    e.preventDefault();

    const additionalData = {
      ...data,
      assistedBy: userData?.user?._id,
      patientId: generatePatientID(),
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
          New Patient Visit
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
            {/* Personal Information Heading */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Personal Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8} md={4}>
              <TextField
                name="name"
                label="Name"
                value={data.name}
                onChange={changeHandler}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={8} md={4}>
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
            <Grid item xs={12} sm={8} md={4}>
              <Select
                name="gender"
                value={data.gender}
                onChange={changeHandler}
                displayEmpty
                fullWidth
                required
                renderValue={(selected) => {
                  if (!selected) {
                    return <em>Select Gender</em>;
                  }
                  return selected.toUpperCase();
                }}
              >
                {gender.map((e, index) => (
                  <MenuItem key={index} value={e}>
                    {e.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={8} md={4}>
              <TextField
                name="contact"
                label="Contact Number"
                value={data.contact}
                type="number"
                onChange={changeHandler}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={8} md={4}>
              <TextField
                name="address"
                label="Address"
                value={data.address}
                onChange={changeHandler}
                fullWidth
              />
            </Grid>

            {/* Medical Information Heading */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Medical Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={8} md={4}>
              <Select
                name="blood_group"
                value={data.blood_group}
                onChange={changeHandler}
                displayEmpty
                fullWidth
                renderValue={(selected) => {
                  if (!selected) {
                    return <em>Select Blood Group</em>;
                  }
                  return selected.toUpperCase();
                }}
              >
                {blood_groups.map((e, index) => (
                  <MenuItem key={index} value={e}>
                    {e.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={8} md={4}>
              <TextField
                name="weight"
                label="Weight"
                type="number"
                required
                value={data.weight}
                onChange={changeHandler}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={8} md={4}>
              <TextField
                name="blood_pressure"
                label="Blood Pressure"
                type="text"
                required
                placeholder="SYS/DIA"
                value={data.blood_pressure}
                onChange={changeHandler}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={8} md={4}>
              <TextField
                name="allergies"
                label="Allergies"
                value={data.allergies}
                onChange={changeHandler}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={8} md={4}>
              <TextField
                name="chronic"
                label="Chronic Disease"
                value={data.chronic}
                onChange={changeHandler}
                fullWidth
              />
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
                  'Create Profile'
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
