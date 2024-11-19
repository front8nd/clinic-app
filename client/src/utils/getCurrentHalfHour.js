export default function getCurrentHalfHour() {
  const now = new Date();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  // Determine the start and end of the current half-hour range
  const startMinutes = minutes < 30 ? 0 : 30;
  const endMinutes = startMinutes === 0 ? 29 : 59;

  // Calculate the start and end times
  const startTime = new Date(now);
  startTime.setMinutes(startMinutes, 0, 0); // Set minutes to 0 or 30, and seconds to 0

  const endTime = new Date(now);
  endTime.setMinutes(endMinutes, 59, 999); // Set minutes to 29 or 59, and seconds to 59

  // Format the times as HH:MM AM/PM
  const formatTime = (time) => {
    let localHours = time.getHours(); // Renamed 'hours' to 'localHours'
    const localMinutes = time.getMinutes(); // Renamed 'minutes' to 'localMinutes'
    const period = localHours >= 12 ? 'PM' : 'AM';

    localHours %= 12; // Used operator assignment
    if (localHours === 0) localHours = 12; // 12 PM is 12, not 0

    const minutesFormatted = localMinutes < 10 ? `0${localMinutes}` : localMinutes;

    return `${localHours}:${minutesFormatted} ${period}`;
  };

  // Get the formatted start and end times
  const startFormatted = formatTime(startTime);
  const endFormatted = formatTime(endTime);

  return `${startFormatted} - ${endFormatted}`;
}
