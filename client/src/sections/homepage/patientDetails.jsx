import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';

import { useDispatch } from 'react-redux';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { calculateAge } from '../../utils/calculateAge';
import { resetAppointment } from '../../redux/appointmentSlice';

export default function PatientDetails({ appointmentData }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (appointmentData) {
      setOpen(true);
    }
  }, [appointmentData]);

  const handleClose = () => {
    setOpen(false);
  };

  // Safely retrieve patient and appointment details
  const patient = appointmentData?.patient;
  const appointment = appointmentData?.appointment;
  const age = patient ? calculateAge(patient.birthYear) : null;

  const captureRef = useRef(null);

  const takeScreenshot = () => {
    if (captureRef.current) {
      html2canvas(captureRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  useEffect(
    () => () => {
      dispatch(resetAppointment());
    },
    [dispatch]
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={isFullScreen}
      aria-labelledby="responsive-dialog-title"
    >
      <div ref={captureRef}>
        <DialogTitle
          id="responsive-dialog-title"
          sx={{
            color: theme.palette.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6">Appointment Information</Typography>
          <Button onClick={handleClose} color="error" autoFocus>
            Close
          </Button>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <DialogContentText component="div">
            <Stack spacing={2} alignItems="center">
              {patient && (
                <>
                  <Avatar
                    alt={patient.name}
                    sx={{ width: 64, height: 64, bgcolor: theme.palette.primary.light }}
                  >
                    {patient.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6">{patient.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID: {patient.patientId}
                  </Typography>
                  {age && (
                    <Typography variant="body2" color="textSecondary">
                      Age: {age} years
                    </Typography>
                  )}
                </>
              )}
              {appointment && (
                <Typography variant="body1" color="inherit" align="center">
                  Your appointment is scheduled for today at {appointment.appointmentTime}. Please
                  be on time for the best experience.
                </Typography>
              )}
            </Stack>
          </DialogContentText>
        </DialogContent>
      </div>
      <Button variant="contained" onClick={takeScreenshot}>
        Download
      </Button>
    </Dialog>
  );
}
