// Define clinic hours (hardcoded for now)
const clinicHours = [
  { start: 10, end: 14 }, // 10:00 am to 2:00 pm
  { start: 17, end: 21 }, // 5:00 pm to 9:00 pm
];

// Utility function to check if the current time is within working hours
export function isWithinWorkingHours() {
  const now = new Date();
  const currentHour = now.getHours();

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < clinicHours.length; i++) {
    const { start, end } = clinicHours[i];
    if (currentHour >= start && currentHour < end) {
      return true; // Return true if current time is within any defined range
    }
  }

  return false; // Return false if current time is outside all defined ranges
}

// Utility function to format working hours for display
export function getFormattedWorkingHours() {
  const formatTime = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
    return `${formattedHour}:00 ${period}`;
  };

  return clinicHours.map(({ start, end }) => `${formatTime(start)} - ${formatTime(end)}`);
}
