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
      padding: 40,
      fontFamily: 'Helvetica',
      backgroundColor: '#fff',
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 20,
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
    profileBox: {
      border: '1px solid #004d99',
      padding: 20,
      marginBottom: 20,
      backgroundColor: '#f0faff',
      borderRadius: 8,
    },
    subBox: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 8,
      alignItems: 'center',
    },
    subBoxHeading: {
      fontSize: 12,
      color: '#333',
      fontFamily: 'Helvetica-Bold',
      marginRight: 5,
    },
    subBoxText: {
      fontSize: 12,
      color: '#333',
      textDecorationLine: 'none',
    },

    medicalBox: {
      border: '1px solid #ccc',
      padding: 15,
      marginBottom: 20,
      borderRadius: 5,
      backgroundColor: '#f9f9f9',
      width: '50%',
    },
    sectionHeading: {
      fontSize: 14,
      fontFamily: 'Helvetica-Bold',
      color: '#333',
      marginBottom: 10,
    },
    subSection: {
      marginBottom: 15,
    },
    subSectionText: {
      fontSize: 12,
      fontFamily: 'Helvetica',
      color: '#333',
    },
    table: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    },
    tableRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderBottom: '1px solid #ccc',
      marginVertical: '5px',
    },
    tableCell: {
      fontSize: 12,
      fontFamily: 'Helvetica',
      color: '#333',
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

        {/* Profile Section */}
        <View style={styles.profileBox}>
          <Text style={styles.sectionHeading}>Patient Details</Text>
          <View style={styles.row}>
            {/* Column 1 */}
            <View style={styles.col}>
              <View style={styles.subBox}>
                <Text style={styles.subBoxHeading}>Name:</Text>
                <Text style={styles.subBoxText}>{patientData?.patient?.name || 'N/A'}</Text>
              </View>
              <View style={styles.subBox}>
                <Text style={styles.subBoxHeading}>Gender:</Text>
                <Text style={styles.subBoxText}>
                  {patientData?.patient?.gender?.toUpperCase() || 'N/A'}
                </Text>
              </View>
              <View style={styles.subBox}>
                <Text style={styles.subBoxHeading}>Age:</Text>
                <Text style={styles.subBoxText}>{age || 'N/A'}</Text>
              </View>
              <View style={styles.subBox}>
                <Text style={styles.subBoxHeading}>Contact:</Text>
                <Text style={styles.subBoxText}>{patientData?.patient?.contact || 'N/A'}</Text>
              </View>
              <View style={styles.subBox}>
                <Text style={styles.subBoxHeading}>Address:</Text>
                <Text style={styles.subBoxText}>{patientData?.patient?.address || 'N/A'}</Text>
              </View>
            </View>

            {/* Column 2 */}
            <View style={styles.col}>
              <View style={styles.subBox}>
                <Text style={styles.subBoxHeading}>Patient ID:</Text>
                <Text style={styles.subBoxText}>{patientData?.patient?.patientId || 'N/A'}</Text>
              </View>
              <View style={styles.subBox}>
                <Text style={styles.subBoxHeading}>Registered On:</Text>
                <Text style={styles.subBoxText}>
                  {patientData?.patient?.createdAt
                    ? new Date(patientData?.patient?.createdAt).toLocaleDateString()
                    : 'N/A'}
                </Text>
              </View>
              <View style={styles.subBox}>
                <Text style={styles.subBoxHeading}>Assisted By:</Text>
                <Text style={styles.subBoxText}>
                  {patientData?.patient?.assistedBy?.name
                    ? `${patientData?.patient?.assistedBy?.name} (${patientData?.patient?.assistedBy?.role?.toUpperCase()})`
                    : 'N/A'}
                </Text>
              </View>
              <View style={styles.subBox}>
                <Text style={styles.subBoxHeading}>Allergies:</Text>
                <Text style={styles.subBoxText}>
                  {patientData?.patient?.allergies || 'No allergies reported'}
                </Text>
              </View>
              <View style={styles.subBox}>
                <Text style={styles.subBoxHeading}>Chronic Conditions:</Text>
                <Text style={styles.subBoxText}>
                  {patientData?.patient?.chronicConditions || 'None'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Basic Medical Details */}
        <View style={styles.medicalBox}>
          <Text style={styles.sectionHeading}>Vital Signs</Text>

          {/* Vital Signs */}
          <View style={styles.subSection}>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Weight:</Text>
                <Text style={styles.tableCell}>{lastMedical?.weight || 'N/A'} kg</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Height:</Text>
                <Text style={styles.tableCell}>{lastMedical?.height || 'N/A'} cm</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Temperature:</Text>
                <Text style={styles.tableCell}>{lastMedical?.temp || 'N/A'} °F</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Blood Pressure:</Text>
                <Text style={styles.tableCell}>
                  {lastMedical?.blood_pressure?.sys || '--'}/
                  {lastMedical?.blood_pressure?.dia || '--'} mmHg
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Pulse Rate:</Text>
                <Text style={styles.tableCell}>{lastMedical?.pulse_rate || 'N/A'} bpm</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>Respiratory Rate:</Text>
                <Text style={styles.tableCell}>{lastMedical?.resp_rate || 'N/A'} breaths/min</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>SpO2:</Text>
                <Text style={styles.tableCell}>{lastMedical?.spo2 || 'N/A'} %</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>RBS:</Text>
                <Text style={styles.tableCell}>{lastMedical?.rbs || 'N/A'} mg/dL</Text>
              </View>
            </View>
          </View>
        </View>

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
        Download PDF
      </PDFDownloadLink>
    </div>
  );
};

export default PatientProfile;
