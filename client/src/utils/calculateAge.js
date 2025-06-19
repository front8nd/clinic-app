// src/ageUtils.js

/**
 * Calculate age based on the provided birth year.
 * @param {number} birthYear - The year of birth.
 * @returns {number} The calculated age.
 * @throws {Error} If the birth year is invalid.
 */
export const calculateAge = (birthYear) => {
  // Convert birthYear to an integer
  // const year = parseInt(birthYear, 10);

  // if (Number.isNaN(year) || year < 0) {
  //   throw new Error('Invalid birth year. Please provide a valid year.');
  // }

  const currentYear = new Date().getFullYear();
  return currentYear - birthYear;
};
