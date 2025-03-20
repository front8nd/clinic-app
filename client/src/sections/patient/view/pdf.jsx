import React from 'react';
import {
  Document,
  Image,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';
import { calculateAge } from '../../../utils/calculateAge';
import { Button } from '@mui/material';
import { Iconify } from '../../../components/iconify';

export const PatientProfilePDF = ({ patientData }) => {
  const age = calculateAge(patientData?.patient?.birthYear);

  const getLatestRecord = (records, fallback = 'No Records Exist Yet') =>
    records?.length > 0 ? records[0] : fallback;

  const lastAppointment = getLatestRecord(patientData?.appointments);
  const lastFees = getLatestRecord(patientData?.feesInfo);
  const lastMedical = getLatestRecord(patientData?.medicalInfo);
  const lastVisit = getLatestRecord(patientData?.visits);
  const styles = StyleSheet.create({
    page: {
      padding: 20,
      fontFamily: 'Helvetica',
      backgroundColor: '#fff',
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 10,
    },
    headerRight: {
      textAlign: 'center',
      marginLeft: '10px',
    },
    hospitalName: {
      fontSize: 18,
      fontFamily: 'Helvetica-Bold',
      color: '#004d99',
      letterSpacing: 1.5,
    },
    doctorName: {
      fontSize: 14,
      color: '#2f2f2f',
      fontFamily: 'Helvetica-Bold',
      marginTop: 5,
    },
    doctorDetails: {
      fontSize: 12,
      color: '#2f2f2f',
      marginTop: 5,
    },
    divider: {
      borderTop: '2px solid #004d99',
      marginVertical: 20,
    },
    sectionHeading: {
      fontSize: 14,
      fontFamily: 'Helvetica-Bold',
      color: '#333',
      marginBottom: 10,
    },
    profileBox: {
      width: '100%',
      border: '1pt solid #004d99',
      padding: 10,
      marginBottom: 10,
      backgroundColor: '#f0faff',
      borderRadius: 8,
    },
    subBox: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 8,
      alignItems: 'center',
    },
    profileBoxHeading: {
      fontSize: 10,
      color: '#333',
      fontFamily: 'Helvetica-Bold',
      marginRight: 5,
      width: '50px',
    },
    profileBoxText: {
      fontSize: 10,
      color: '#333',
      textDecoration: 'underline',
      width: 100,
      flexShrink: 0,
    },

    medicalBox: {
      // border: '1px solid #ccc',
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      // backgroundColor: '#f9f9f9',
      width: '50%',
    },
    subSection: {
      marginBottom: 10,
    },
    subSectionText: {
      fontSize: 10,
      fontFamily: 'Helvetica',
      color: '#333',
    },

    ComplaintsBox: {
      // border: '1px solid #ccc',
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      // backgroundColor: '#f9f9f9',
      width: '50%',
    },

    Box: {
      width: '100%',
      // padding: '10px',
      // height: 50,
      // border: '1px solid #ccc',
      fontSize: '10px',
      borderRadius: 8,
      flexDirection: 'row',
      marginBottom: '10px',
    },
    BoxHeading: {
      fontSize: 10,
      color: '#333',
      fontFamily: 'Helvetica-Bold',
    },
    BoxText: {
      fontSize: 10,
      color: '#333',
    },
    Vitaltable: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
    VitaltableRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottom: '1px solid #ccc',
      marginVertical: '3px',
    },
    tableCellHeading: {
      fontSize: 10,
      fontFamily: 'Helvetica-Bold',
      color: '#333',
    },
    tableCellText: {
      fontSize: 10,
      fontFamily: 'Helvetica',
      color: '#333',
    },
    table: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: 20,
    },

    tableRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
      borderBottom: '1px solid #ccc',
      paddingBottom: 5,
    },
    tableHeader: {
      fontSize: 10,
      fontFamily: 'Helvetica-Bold',
      color: '#444444',
      backgroundColor: '#F4F6F8',
      width: '20%',
      textAlign: 'left',
      padding: 5,
    },
    tableCell: {
      fontSize: 10,
      fontFamily: 'Helvetica',
      color: '#333',
      width: '20%',
      textAlign: 'left',
      padding: 5,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    col: {
      width: '48%',
    },
    footer: {
      marginTop: 40,
      textAlign: 'center',
      fontSize: 12,
      color: '#777',
      padding: 10,
      borderTop: '2px solid #004d99',
    },
  });

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            style={{
              height: '70px',
              width: '70px',
            }}
            src="/assets/background/pdf.png"
          />
          <View style={styles.headerRight}>
            <Text style={styles.hospitalName}>Al Farooq Dar US Shifa Hospital</Text>
            <Text style={styles.doctorName}>Dr. Umar Farooq Dar</Text>
            <Text style={styles.doctorDetails}>
              MBBS, FCPS (Community Medicine) (PMDC #54176-P)
            </Text>
            <Text style={styles.doctorDetails}>
              Primary Care Physician & Preventive Medicine Specialist
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        <Text style={styles.sectionHeading}>Patient Information</Text>
        {/* Profile Section */}
        <View style={styles.profileBox}>
          <View style={styles.row}>
            {/* Column 1 */}
            <View style={styles.col}>
              <View style={styles.subBox}>
                <Text style={styles.profileBoxHeading}>Name:</Text>
                <Text style={styles.profileBoxText}>{patientData?.patient?.name || 'N/A'}</Text>
              </View>
              <View style={styles.subBox}>
                <Text style={styles.profileBoxHeading}>Gender:</Text>
                <Text style={styles.profileBoxText}>
                  {patientData?.patient?.gender?.toUpperCase() || 'N/A'}
                </Text>
              </View>
              <View style={styles.subBox}>
                <Text style={styles.profileBoxHeading}>Age:</Text>
                <Text style={styles.profileBoxText}>{age || 'N/A'}</Text>
              </View>
            </View>

            {/* Column 2 */}
            <View style={styles.col}>
              <View style={styles.subBox}>
                <Text style={styles.profileBoxHeading}>Patient ID:</Text>
                <Text style={styles.profileBoxText}>
                  {patientData?.patient?.patientId || 'N/A'}
                </Text>
              </View>
              <View style={styles.subBox}>
                <Text style={styles.profileBoxHeading}>Contact:</Text>
                <Text style={styles.profileBoxText}>{patientData?.patient?.contact || 'N/A'}</Text>
              </View>
              <View style={styles.subBox}>
                <Text style={styles.profileBoxHeading}>Address:</Text>
                <Text style={styles.profileBoxText}>{patientData?.patient?.address || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 2nd Box */}
        <View style={styles.row}>
          {/* Basic Medical Details */}
          <View style={styles.col}>
            <Text style={styles.sectionHeading}>Vital Signs</Text>
            <View style={styles.subSection}>
              <View style={styles.Vitaltable}>
                <View style={styles.VitaltableRow}>
                  <Text style={styles.tableCellHeading}>Weight:</Text>
                  <Text style={styles.tableCellText}>{lastMedical?.weight || 'N/A'} kg</Text>
                </View>
                <View style={styles.VitaltableRow}>
                  <Text style={styles.tableCellHeading}>Height:</Text>
                  <Text style={styles.tableCellText}>{lastMedical?.height || 'N/A'} cm</Text>
                </View>
                <View style={styles.VitaltableRow}>
                  <Text style={styles.tableCellHeading}>Temperature:</Text>
                  <Text style={styles.tableCellText}>{lastMedical?.temp || 'N/A'} °F</Text>
                </View>
                <View style={styles.VitaltableRow}>
                  <Text style={styles.tableCellHeading}>Blood Pressure:</Text>
                  <Text style={styles.tableCellText}>
                    {lastMedical?.blood_pressure?.sys || '--'}/
                    {lastMedical?.blood_pressure?.dia || '--'} mmHg
                  </Text>
                </View>
                <View style={styles.VitaltableRow}>
                  <Text style={styles.tableCellHeading}>Pulse Rate:</Text>
                  <Text style={styles.tableCellText}>{lastMedical?.pulse_rate || 'N/A'} bpm</Text>
                </View>
                <View style={styles.VitaltableRow}>
                  <Text style={styles.tableCellHeading}>Respiratory Rate:</Text>
                  <Text style={styles.tableCellText}>
                    {lastMedical?.resp_rate || 'N/A'} breaths/min
                  </Text>
                </View>
                <View style={styles.VitaltableRow}>
                  <Text style={styles.tableCellHeading}>SpO2:</Text>
                  <Text style={styles.tableCellText}>{lastMedical?.spo2 || 'N/A'} %</Text>
                </View>
                <View style={styles.VitaltableRow}>
                  <Text style={styles.tableCellHeading}>RBS:</Text>
                  <Text style={styles.tableCellText}>{lastMedical?.rbs || 'N/A'} mg/dL</Text>
                </View>
              </View>
            </View>
          </View>

          {/*  Complaints Details */}
          <View style={styles.col}>
            <Text style={styles.sectionHeading}>Complaints</Text>
            <View style={styles.subSection}>
              <View style={styles.Box}>
                <Text style={styles.BoxHeading}>Chief Complaints: </Text>
                <Text style={styles.BoxText}>{lastVisit?.complaints?.chiefComplaint || 'N/A'}</Text>
              </View>
              <View style={styles.Box}>
                <Text style={styles.BoxHeading}>Known Complaints: </Text>
                <Text style={styles.BoxText}>{lastVisit?.complaints?.knownComplaint || 'N/A'}</Text>
              </View>
              <View style={styles.Box}>
                <Text style={styles.BoxHeading}>Additional Complaints: </Text>
                <Text style={styles.BoxText}>
                  {lastVisit?.complaints?.additionalComplaint || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.col}>
              <Text style={styles.sectionHeading}>Diaganosis</Text>
              <View style={styles.subSection}>
                <View style={styles.Box}>
                  <Text style={styles.BoxHeading}>Primary: </Text>
                  <Text style={styles.BoxText}>{lastVisit?.diagnosis?.primary || 'N/A'}</Text>
                </View>
                <View style={styles.Box}>
                  <Text style={styles.BoxHeading}>Secondary: </Text>
                  <Text style={styles.BoxText}>{lastVisit?.diagnosis?.secondary || 'N/A'}</Text>
                </View>
                <View style={styles.Box}>
                  <Text style={styles.BoxHeading}>Notes: </Text>
                  <Text style={styles.BoxText}>{lastVisit?.diagnosis?.notes || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 3rd Box */}
        <View style={styles.row}>
          {/*  Diaganosis Details */}
          <View style={styles.col}>
            <Text style={styles.sectionHeading}>Assessments</Text>
            <View style={styles.subSection}>
              <View style={styles.Box}>
                <Text style={styles.BoxHeading}>CNS: </Text>
                <Text style={styles.BoxText}>{lastVisit?.assessments?.cns || 'N/A'}</Text>
              </View>
              <View style={styles.Box}>
                <Text style={styles.BoxHeading}>Gastrointestinal: </Text>
                <Text style={styles.BoxText}>
                  {lastVisit?.assessments?.gastrointestinal || 'N/A'}
                </Text>
              </View>
              <View style={styles.Box}>
                <Text style={styles.BoxHeading}>Genitourinary: </Text>
                <Text style={styles.BoxText}>{lastVisit?.assessments?.genitourinary || 'N/A'}</Text>
              </View>
              <View style={styles.Box}>
                <Text style={styles.BoxHeading}>Heent: </Text>
                <Text style={styles.BoxText}>{lastVisit?.assessments?.heent || 'N/A'}</Text>
              </View>
              <View style={styles.Box}>
                <Text style={styles.BoxHeading}>Musculoskeletal: </Text>
                <Text style={styles.BoxText}>
                  {lastVisit?.assessments?.musculoskeletal || 'N/A'}
                </Text>
              </View>
              <View style={styles.Box}>
                <Text style={styles.BoxHeading}>Respiratory: </Text>
                <Text style={styles.BoxText}>{lastVisit?.assessments?.respiratory || 'N/A'}</Text>
              </View>
            </View>
          </View>
          <View style={styles.col}>
            {/* Follow Up */}
            <Text style={styles.sectionHeading}>Follow Up</Text>
            {lastVisit?.followUp?.map((e, index) => (
              <View style={styles.subSection} key={index}>
                <View style={styles.Box}>
                  <Text style={styles.BoxHeading}>Follow-Up Date: </Text>
                  <Text style={styles.BoxText}>{e?.followUpDate || 'N/A'}</Text>
                </View>
                <View style={styles.Box}>
                  <Text style={styles.BoxHeading}>Plan: </Text>
                  <Text style={styles.BoxText}>{e?.plan || 'N/A'}</Text>
                </View>
                <View style={styles.Box}>
                  <Text style={styles.BoxHeading}>Consultation Via: </Text>
                  <Text style={styles.BoxText}>
                    {e?.consultationVia === 'online' ? 'Online' : 'In-Person'}
                  </Text>
                </View>
              </View>
            ))}

            {/* Notes */}
            <Text style={styles.sectionHeading}>Notes</Text>
            <View style={styles.subSection}>
              <View style={styles.Box}>
                <Text style={styles.BoxText}>{lastVisit?.notes || 'N/A'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Perceiption */}
        {lastVisit?.prescription?.length > 0 && (
          <View style={styles.table}>
            <View style={styles.tableRow}>
              {/* Table Header */}
              <Text style={[styles.tableHeader, { width: '30px' }]}>#</Text>
              <Text style={styles.tableHeader}>Name</Text>
              <Text style={styles.tableHeader}>Dosage</Text>
              <Text style={styles.tableHeader}>Frequency</Text>
              <Text style={styles.tableHeader}>Duration</Text>
              <Text style={styles.tableHeader}>Notes</Text>
            </View>

            {/* Table Rows */}
            {lastVisit?.prescription?.map((medication, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={[styles.tableCell, { width: '30px' }]}>{index + 1 || 'N/A'}</Text>
                <Text style={styles.tableCell}>{medication.medicationName || 'N/A'}</Text>
                <Text style={styles.tableCell}>{medication.dosage || 'N/A'}</Text>
                <Text style={styles.tableCell}>{medication.frequency || 'N/A'}</Text>
                <Text style={styles.tableCell}>{medication.duration || 'N/A'}</Text>
                <Text style={styles.tableCell}>{medication.additionalInstructions || 'N/A'}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer with Consent */}
        <View style={styles.footer}>
          <Text>
            By receiving this document, you acknowledge and consent to the collection and sharing of
            your health information as described in the hospitals privacy policy.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const PatientProfile = ({ patientData }) => {
  if (!patientData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PDFDownloadLink
        document={<PatientProfilePDF patientData={patientData} />}
        fileName="Patient_Medical_Profile.pdf"
      >
        <Button
          startIcon={<Iconify icon="fa-solid:notes-medical" />}
          size="large"
          variant="outlined"
          color="error"
          fullWidth
        >
          Download PDF
        </Button>
      </PDFDownloadLink>
    </div>
  );
};

export default PatientProfile;
