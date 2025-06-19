// Function to generate a new date-based patient ID with a random 3 or 4-digit number
export default function generatePatientID() {
  // Get the current date
  const date = new Date();

  // Format the date as YYMM
  const year = date.getFullYear().toString().slice(-2); // Last two digits of year
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month with leading zero if needed
  const prefix = `${month}${year}`; // Combine year and month as YYMM

  // Generate a random 3 or 4-digit number
  const randomNumber = Math.floor(1 + Math.random() * 9999); // Random 4-digit number between 1 and 9999

  // Generate the ID in format YYMM-RANDOM (e.g., 2411-5734)
  return `${prefix}-${randomNumber}`;
}
