import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { CircularProgress, Stack } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from '../../routes/hooks';

import { login, reset } from '../../redux/authSlice';

import { Iconify } from '../../components/iconify';

import { useSnackbar } from '../../components/snackbar/snackbar';

// ----------------------------------------------------------------------

export default function Login() {
  const router = useRouter();
  const { openSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const changeHandler = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    await dispatch(login(data));
  };

  useEffect(() => {
    if (isAuthenticated) {
      openSnackbar('Login Successful', 'success');
      router.push('/users');
    } else if (error?.message || error?.error || error) {
      openSnackbar(`${error?.message || error?.error || error}`, 'error');
    }
    return () => {
      dispatch(reset());
    };
  }, [isAuthenticated, error, router, openSnackbar, dispatch]);

  const renderForm = (
    <form onSubmit={handleClick}>
      <Stack spacing={3} className="mb-6">
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
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" color="inherit">
        {loading === false ? (
          'Login'
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
        <Typography variant="h5">Sign in</Typography>
        <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link
            className="cursor-pointer"
            onClick={() => {
              router.push('/register');
            }}
            variant="subtitle2"
            sx={{ ml: 0.5 }}
          >
            Get started
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
