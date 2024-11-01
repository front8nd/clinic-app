import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
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
import InputAdornment from '@mui/material/InputAdornment';

import { _users } from '../../../_mock';
import { DashboardContent } from '../../../layouts/dashboard/index';

import { Iconify } from '../../../components/iconify';
import { useRouter } from '../../../routes/hooks';

import { register, resetErrors } from '../../../redux/authSlice';

import { useSnackbar } from '../../../components/snackbar/snackbar';
import { Label } from '../../../components/label';

export default function UserNew() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const dispatch = useDispatch();
  const authData = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const roles = ['admin', 'staff', 'doctor'];
  const staff = ['receptionist', 'nurse'];
  const gender = ['male', 'female'];

  const [data, setData] = useState({
    name: '',
    email: '',
    gender: 'male',
    password: '',
    c_password: '',
    role: 'admin',
    dob: '',
    contact: '',
    address: '',
    specialization: '',
    staffRole: 'receptionist',
    qualification: '',
    experience: '',
  });

  console.log(data);

  const changeHandler = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  // Handle submit with password validation
  const handleClick = async (e) => {
    e.preventDefault();
    if (data.password !== data.c_password) {
      openSnackbar('Passwords do not match', 'error');
      return;
    }
    await dispatch(register(data));
  };

  // Handling field reset logic
  useEffect(() => {
    if (data?.role === 'doctor') {
      setData((prevData) => ({ ...prevData, staffRole: null }));
    } else if (data?.role === 'staff') {
      setData((prevData) => ({ ...prevData, specialization: null }));
    } else if (data?.role === 'admin') {
      setData((prevData) => ({ ...prevData, specialization: null, staffRole: null }));
    }
  }, [data?.role]);

  useEffect(() => {
    if (authData.registrationSuccess) {
      openSnackbar('Registration Successful', 'success');
    } else if (authData?.registrationError?.message || authData?.registrationError?.error) {
      openSnackbar(
        `${authData?.registrationError?.message || authData?.registrationError?.error}`,
        'error'
      );
    }
    return () => {
      dispatch(resetErrors());
    };
  }, [authData.registrationSuccess, authData?.registrationError, router, openSnackbar, dispatch]);

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Users
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

            {/* Name Field */}
            <Grid item xs={12} sm={4} md={6}>
              <Label
                sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
              >
                Name
              </Label>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                name="name"
                label="Name"
                value={data.name}
                onChange={changeHandler}
                required
                fullWidth
              />
            </Grid>

            {/* Email Field */}
            <Grid item xs={12} sm={4} md={6}>
              <Label
                sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
              >
                Email
              </Label>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                name="email"
                label="Email"
                value={data.email}
                onChange={changeHandler}
                required
                fullWidth
              />
            </Grid>

            {/* Date of Birth Field */}
            <Grid item xs={12} sm={4} md={6}>
              <Label
                sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
              >
                Date of Birth
              </Label>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                name="dob"
                label="Date of Birth"
                type="date"
                value={data.dob}
                onChange={changeHandler}
                required
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Gender Field */}
            <Grid item xs={12} sm={4} md={6}>
              <Label
                sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
              >
                Gender
              </Label>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <Select
                name="gender"
                value={data.gender}
                onChange={changeHandler}
                displayEmpty
                fullWidth
              >
                {gender.map((e, index) => (
                  <MenuItem key={index} value={e}>
                    {e.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* Contact Field */}
            <Grid item xs={12} sm={4} md={6}>
              <Label
                sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
              >
                Contact
              </Label>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                name="contact"
                label="Contact"
                type="text"
                value={data.contact}
                onChange={changeHandler}
                required
                fullWidth
              />
            </Grid>

            {/* Address Field */}
            <Grid item xs={12} sm={4} md={6}>
              <Label
                sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
              >
                Address
              </Label>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                name="address"
                label="Address"
                value={data.address}
                onChange={changeHandler}
                fullWidth
              />
            </Grid>

            {/* Role Information Heading */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Role Information
              </Typography>
            </Grid>

            {/* Role Field */}
            <Grid item xs={12} sm={4} md={6}>
              <Label
                sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
              >
                Role
              </Label>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <Select
                name="role"
                value={data.role}
                onChange={changeHandler}
                displayEmpty
                fullWidth
                onClick={changeHandler}
              >
                {roles.map((e, index) => (
                  <MenuItem key={index} value={e}>
                    {e.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* Conditional Fields for Doctor Role */}
            {data.role === 'doctor' && (
              <>
                <Grid item xs={12} sm={4} md={6}>
                  <Label
                    sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
                  >
                    Specialization
                  </Label>
                </Grid>
                <Grid item xs={12} sm={8} md={6}>
                  <TextField
                    name="specialization"
                    label="Specialization"
                    value={data.specialization}
                    onChange={changeHandler}
                    required
                    fullWidth
                  />
                </Grid>
              </>
            )}

            {/* Conditional Fields for Staff Role */}
            {data.role === 'staff' && (
              <>
                <Grid item xs={12} sm={4} md={6}>
                  <Label
                    sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
                  >
                    Staff Role
                  </Label>
                </Grid>
                <Grid item xs={12} sm={8} md={6}>
                  <Select
                    name="staffRole"
                    value={data.staffRole}
                    onChange={changeHandler}
                    displayEmpty
                    fullWidth
                  >
                    {staff.map((e, index) => (
                      <MenuItem key={index} value={e}>
                        {e.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </>
            )}

            <Grid item xs={12} sm={4} md={6}>
              <Label
                sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
              >
                Qualification
              </Label>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                name="qualification"
                label="Qualification"
                type="text"
                value={data.qualification}
                onChange={changeHandler}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4} md={6}>
              <Label
                sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
              >
                Years of Experience
              </Label>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                name="experience"
                label="Experience"
                type="number"
                value={data.experience}
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

            {/* Password Fields */}
            <Grid item xs={12} sm={4} md={6}>
              <Label
                sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
              >
                Password
              </Label>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                onChange={changeHandler}
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4} md={6}>
              <Label
                sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
              >
                Confirm Password
              </Label>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                name="c_password"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                value={data.c_password}
                onChange={changeHandler}
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                {authData?.loading === false ? (
                  'Register'
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
