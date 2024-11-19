function generateTimeSlots(appointmentConfig) {
  const slots = [];
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const { morning, evening } = appointmentConfig.clinicHours;

  function formatTime12Hour(hour, minutes) {
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes.toString().padStart(2, "0")} ${period}`;
  }

  function generateSessionSlots(start, end) {
    const sessionSlots = [];
    for (let hour = start; hour < end; hour++) {
      for (let half = 0; half < 2; half++) {
        const startMinute = half * 30;
        const endMinute = startMinute + 29;

        if (
          hour < currentHour ||
          (hour === currentHour && startMinute <= currentMinute)
        ) {
          continue; // Skip past slots
        }

        const slotStart = formatTime12Hour(hour, startMinute);
        const slotEnd = formatTime12Hour(hour, endMinute);

        sessionSlots.push({
          timeRange: `${slotStart} - ${slotEnd}`,
          counter: 0,
          maxSlots: appointmentConfig.maxSlots, // Use the config maxSlots
        });
      }
    }
    return sessionSlots;
  }

  const morningSlots = generateSessionSlots(morning.start, morning.end);
  const eveningSlots = generateSessionSlots(evening.start, evening.end);

  slots.push(...morningSlots, ...eveningSlots);
  return slots;
}

module.exports = generateTimeSlots;
