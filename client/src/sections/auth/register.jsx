import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { CircularProgress, Stack } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import { register, reset } from '../../redux/authSlice';
import { useRouter } from '../../routes/hooks';

import { Iconify } from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar/snackbar';

// ----------------------------------------------------------------------

export default function Register() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const { userData, loading, isSuccess, isFailed } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
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
    if (isSuccess) {
      openSnackbar('Registration Successful', 'success');
    } else if (isFailed?.message || isFailed?.error || isFailed) {
      openSnackbar(`${isFailed?.message || isFailed?.error || isFailed}`, 'error');
    }
    return () => {
      dispatch(reset());
    };
  }, [dispatch, isSuccess, isFailed, router, openSnackbar]);

  const renderForm = (
    <form onSubmit={handleClick}>
      <Stack spacing={3} className="mb-6">
        <TextField name="name" label="Name" value={data.name} onChange={changeHandler} required />

        <TextField
          name="email"
          label="Email Address"
          value={data.email}
          onChange={changeHandler}
          required
        />

        <TextField
          required
          name="password"
          label="Password"
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
        <TextField
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
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" color="inherit">
        {loading === false ? (
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
    </form>
  );

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Register Account</Typography>
        <Typography variant="body2" color="text.secondary">
          Already have an account?
          <Link
            onClick={() => {
              router.push('/login');
            }}
            className="cursor-pointer"
            variant="subtitle2"
            sx={{ ml: 0.5 }}
          >
            Login Here!
          </Link>
        </Typography>
      </Box>

      {renderForm}

      {/* <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box> */}
    </>
  );
}
