import React, { useEffect, useState } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useDispatch, useSelector } from 'react-redux';
import { appointmentByOldPatient, appointmentSlots, reset } from '../../redux/appointmentSlice';
import { useSnackbar } from '../../components/snackbar/snackbar';
import PatientDetails from './patientDetails';

function OldPatientForm() {
  const dispatch = useDispatch();
  const { openSnackbar } = useSnackbar();

  const { todayAppointments, isSubmitted, isSuccess, isFailed, appointmentData } = useSelector(
    (state) => state.appointment
  );

  const [data, setData] = useState({
    // Id
    patientId: null,

    // Appointment
    appointmentTime: '',
    type: 'online',
    status: 'scheduled',
  });

  const changeHandler = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const appointmentInfo = {
      appointmentTime: data?.appointmentTime,
      type: data?.type,
      status: data?.status,
    };

    const additionalData = {
      patientId: data?.patientId,
      appointmentInfo,
    };
    console.log(additionalData);
    await dispatch(appointmentByOldPatient(additionalData));
  };

  useEffect(() => {
    dispatch(appointmentSlots());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      openSnackbar('Appointment Booked Successfully', 'success');
    } else if (isFailed?.message || isFailed?.error || isFailed) {
      openSnackbar(`${isFailed?.message || isFailed?.error || isFailed}`, 'error');
    }
    return () => {
      dispatch(reset());
    };
  }, [isSuccess, isFailed, openSnackbar, dispatch]);

  return (
    <form className="space-y-4" onSubmit={handleClick}>
      {appointmentData && <PatientDetails appointmentData={appointmentData} />}

      <TextField
        label="Patient ID"
        fullWidth
        variant="outlined"
        required
        type="text"
        name="patientId"
        value={data.patientId}
        onChange={changeHandler}
      />
      <FormControl fullWidth>
        <Select
          name="appointmentTime"
          value={data.appointmentTime}
          onChange={changeHandler}
          displayEmpty
          fullWidth
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
      </FormControl>
      <LoadingButton fullWidth size="large" type="submit" variant="contained" color="inherit">
        {isSubmitted === false ? (
          'Book Slot'
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
}

export default OldPatientForm;
