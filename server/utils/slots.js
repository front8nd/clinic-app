// Define clinic hours and slots
const clinicHours = [
  { start: 10, end: 14 }, // 10:00 am to 2:00 pm
  { start: 17, end: 21 }, // 5:00 pm to 9:00 pm
];
const slotsPerHour = 6; // Total slots per hour (3 online + 3 offline)

// Helper function to format time in 12-hour format
function formatTime12Hour(hour, minutes) {
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
  return `${formattedHour}:${minutes} ${period}`;
}

// Function to generate time slots and filter out past times
function generateTimeSlots() {
  const slots = [];
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  clinicHours.forEach(({ start, end }) => {
    for (let hour = start; hour < end; hour++) {
      for (let i = 0; i < slotsPerHour; i++) {
        const minutes = (i * 10).toString().padStart(2, "0"); // 6 slots per hour, every 10 minutes

        // Check if the slot has passed
        if (
          hour < currentHour ||
          (hour === currentHour && parseInt(minutes) <= currentMinute)
        ) {
          continue; // Skip past slots
        }

        slots.push(formatTime12Hour(hour, minutes));
      }
    }
  });
  return slots;
}

module.exports = generateTimeSlots;
