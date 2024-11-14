import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FloatingWhatsApp } from 'react-floating-whatsapp';
import { Tabs, Tab, Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import NewPatientForm from './NewPatientForm';
import OldPatientForm from './OldPatientForm';
import { stylesMode } from '../../theme/styles';
import { isWithinWorkingHours, getFormattedWorkingHours } from '../../utils/workingHoursChecker';

function AppointmentView() {
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Minimal animation for a professional, calm effect
  const animationConfig = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  };
  const isWorkingHours = isWithinWorkingHours();
  const workingHours = getFormattedWorkingHours().join(', ');

  console.log(isWorkingHours);
  return (
    <div className="custom-message">
      {/*  WhatsApp Support  */}
      <FloatingWhatsApp
        phoneNumber="+923080639134"
        accountName="Dr. Umar Farooq"
        allowClickAway
        allowEsc
        placeholder="Need Help?"
        avatar="/assets/icons/doctor.svg"
      />
      <div
        className="min-h-screen p-6"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          width: '100%',
          margin: '0',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            opacity: 0.24,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundImage: `url(/assets/background/overlay.jpg)`,
            [stylesMode.dark]: { opacity: 0.08 },
          }}
        />

        <Card
          sx={{
            width: '100%',
            maxWidth: 500,
            boxShadow: 4,
            borderRadius: 2,
            zIndex: 2,
            paddingTop: 2,
            background: '#f9fafb',
          }}
        >
          <CardContent>
            {/* Main heading */}
            <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h4" fontWeight="bold" color={theme.palette.primary.main}>
                Schedule Your Appointment
              </Typography>
              {isWorkingHours && (
                <Typography variant="body2" color="text.secondary" align="center">
                  Select your patient type to proceed with the booking.
                </Typography>
              )}
              {/* {!isWorkingHours && (
                <div>
                  <Typography gutterBottom variant="body1" color="error" align="center">
                    No slots available due to non-working hours. For emergency cases, visit the
                    clinic or contact via phone number.
                  </Typography>
                  <Typography gutterBottom variant="subtitle1" color="textSecondary" align="center">
                    Our working hours are:
                  </Typography>
                  <Typography
                    gutterBottom
                    variant="body1"
                    color="textSecondary"
                    bgcolor="ButtonFace"
                    align="center"
                  >
                    {workingHours}
                  </Typography>

                  <Typography variant="body1" color="textSecondary" align="center">
                    Please try booking an appointment tomorrow.
                  </Typography>
                </div>
              )} */}
            </Box>

            <>
              {/* Tab navigation */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  centered
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab label="New Patient" />
                  <Tab label="Old Patient" />
                </Tabs>
              </Box>
              {/* Form rendering with smooth animations */}
              <AnimatePresence mode="wait">
                {selectedTab === 0 ? (
                  <motion.div key="new-patient" {...animationConfig} className="w-full mt-4">
                    <NewPatientForm />
                  </motion.div>
                ) : (
                  <motion.div key="old-patient" {...animationConfig} className="w-full mt-4">
                    <OldPatientForm />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AppointmentView;
