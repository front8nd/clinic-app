import React, { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Typography,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useDispatch, useSelector } from 'react-redux';
import { appointmentByNewPatient, appointmentSlots, reset } from '../../redux/appointmentSlice';
import { useSnackbar } from '../../components/snackbar/snackbar';
import { useRouter } from '../../routes/hooks';
import PatientDetails from './patientDetails';

function NewPatientForm() {
  const dispatch = useDispatch();
  const { openSnackbar } = useSnackbar();

  const { todayAppointments, isSubmitted, isSuccess, isFailed, appointmentData } = useSelector(
    (state) => state.appointment
  );

  const [data, setData] = useState({
    // Personal Information
    name: '',
    age: '',
    gender: '',
    contact: '',
    address: '',

    // Appointment
    appointmentTime: '',
    type: 'online',
    status: 'scheduled',
  });

  const genderOptions = ['male', 'female'];

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
    };

    const appointmentInfo = {
      appointmentTime: data?.appointmentTime,
      type: data?.type,
      status: data?.status,
    };

    const additionalData = {
      appointmentInfo,
      personalInfo,
    };
    console.log(additionalData);
    await dispatch(appointmentByNewPatient(additionalData));
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

  console.log(appointmentData);

  return (
    <form className="space-y-4" onSubmit={handleClick}>
      {appointmentData && <PatientDetails appointmentData={appointmentData} />}
      <TextField
        name="name"
        label="Name"
        value={data.name}
        onChange={changeHandler}
        required
        fullWidth
      />
      <TextField
        name="birthYear"
        label="Year of Birth"
        type="number"
        value={data.birthYear}
        onChange={changeHandler}
        required
        fullWidth
      />
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
      <TextField
        name="contact"
        label="Contact Number"
        value={data.contact}
        onChange={changeHandler}
        type="tel"
        fullWidth
      />
      <TextField
        name="address"
        label="Address"
        value={data.address}
        onChange={changeHandler}
        fullWidth
      />
      <FormControl fullWidth>
        <Select
          name="appointmentTime"
          value={data.appointmentTime}
          onChange={changeHandler}
          displayEmpty
          fullWidth
          required
          renderValue={(selected) => selected?.toUpperCase() || <em>Select Appointment Time </em>}
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

export default NewPatientForm;
