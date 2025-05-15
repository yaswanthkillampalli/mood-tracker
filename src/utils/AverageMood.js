function calculateAverageMood() {
  try {
    // Retrieve mood array from localStorage
    const moodArray = localStorage.getItem('moodArray');
    if (!moodArray) {
      return 3; // Default to 'okay' (value: 3) if no data
    }

    // Parse mood array
    const parsedArray = JSON.parse(moodArray);
    if (!Array.isArray(parsedArray) || parsedArray.length === 0) {
      return 3; // Default to 'okay' if array is empty or invalid
    }

    // Extract mood values (1–5)
    const moodValues = parsedArray.map((entry) => {
      if (typeof entry.mood !== 'number' || entry.mood < 1 || entry.mood > 5) {
        throw new Error('Invalid mood value in array');
      }
      return entry.mood;
    });

    // Calculate average and ceil
    const average = moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length;
    const ceiledAverage = Math.ceil(average);

    // Ensure result is between 1 and 5
    return Math.max(1, Math.min(5, ceiledAverage));
  } catch (error) {
    console.error('Error calculating average mood:', error);
    return 3; // Default to 'okay' on error
  }
}

export default calculateAverageMood;