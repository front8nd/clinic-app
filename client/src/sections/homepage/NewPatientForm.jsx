import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

function NewPatientForm() {
  const loading = false;

  return (
    <form className="space-y-4">
      <TextField label="Name" fullWidth variant="outlined" required />
      <FormControl fullWidth>
        <InputLabel>Gender</InputLabel>
        <Select label="Gender" defaultValue="">
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>
      <TextField label="Age" type="number" fullWidth variant="outlined" required />
      <TextField label="Contact Number" type="tel" fullWidth variant="outlined" required />
      <FormControl fullWidth>
        <InputLabel>Choose Slot</InputLabel>
        <Select label="Choose Slot" defaultValue="">
          <MenuItem value="slot1">Slot 1</MenuItem>
          <MenuItem value="slot2">Slot 2</MenuItem>
          <MenuItem value="slot3">Slot 3</MenuItem>
        </Select>
      </FormControl>
      <LoadingButton fullWidth size="large" type="submit" variant="contained" color="inherit">
        {loading === false ? (
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
