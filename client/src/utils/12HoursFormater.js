export default function formatTime12Hour() {
  const now = new Date();

  // Format the time in 12-hour format using toLocaleString
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  const formattedTime = now.toLocaleString('en-US', options);

  return formattedTime;
}
