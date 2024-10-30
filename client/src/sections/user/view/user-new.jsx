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

import { register } from '../../../redux/authSlice';

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
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    c_password: '',
    role: 'admin',
  });

  const changeHandler = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    await dispatch(register(data));
  };
  useEffect(() => {
    if (authData.registrationSuccess) {
      openSnackbar('Registration Successfull', 'success');
    } else if (authData?.registrationError?.message) {
      openSnackbar(`Registration failed: ${authData?.registrationError?.message}`, 'error');
    }
  }, [authData.registrationSuccess, authData?.registrationError, router, openSnackbar]);
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
            <Grid item xs={12} sm={4} md={6}>
              <Box display="flex" alignItems="center" height="100%">
                <Label
                  sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
                >
                  Name
                </Label>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                name="name"
                label="Name"
                value={data.name}
                onChange={changeHandler}
                required
                fullWidth
                sx={{ minWidth: isMobile ? '100%' : '400px' }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={6}>
              <Box display="flex" alignItems="center" height="100%">
                <Label
                  sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
                >
                  Email
                </Label>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <TextField
                name="email"
                label="Email"
                value={data.email}
                onChange={changeHandler}
                required
                fullWidth
                sx={{ minWidth: isMobile ? '100%' : '400px' }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={6}>
              <Box display="flex" alignItems="center" height="100%">
                <Label
                  sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
                >
                  Role
                </Label>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={6}>
              <Select
                name="role"
                value={data.role}
                onChange={changeHandler}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <em>Select Role</em>;
                  }
                  const selectedRole = roles.find((e) => e === selected);
                  return selectedRole ? selectedRole.toUpperCase() : '';
                }}
                fullWidth
              >
                {roles.map((e, index) => (
                  <MenuItem key={index} value={e}>
                    {e.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={4} md={6}>
              <Box display="flex" alignItems="center" height="100%">
                <Label
                  sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
                >
                  Password
                </Label>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={6}>
              <TextField
                required
                name="password"
                label="Password"
                sx={{ minWidth: isMobile ? '100%' : '400px' }}
                fullWidth
                value={data.password}
                onChange={changeHandler}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={6}>
              <Box display="flex" alignItems="center" height="100%">
                <Label
                  sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
                >
                  Confirm Password
                </Label>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={6}>
              <TextField
                sx={{ minWidth: isMobile ? '100%' : '400px' }}
                fullWidth
                required
                name="c_password"
                label="Password"
                value={data.c_password}
                onChange={changeHandler}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={6}>
              <Box display="flex" alignItems="center" height="100%">
                <Label
                  sx={{ fontSize: '0.9rem', padding: '20px', width: isMobile ? 'auto' : 'auto' }}
                >
                  Submit
                </Label>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={6}>
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
