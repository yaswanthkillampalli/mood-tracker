function calculateAverageMood() {
  try {
    const moodArray = localStorage.getItem('moodArray');
    if (!moodArray) {
      return 3; 
    }

    const parsedArray = JSON.parse(moodArray);
    if (!Array.isArray(parsedArray) || parsedArray.length === 0) {
      return 3;
    }

    const moodValues = parsedArray.map((entry) => {
      if (typeof entry.mood !== 'number' || entry.mood < 1 || entry.mood > 5) {
        throw new Error('Invalid mood value in array');
      }
      return entry.mood;
    });

    const average = moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length;
    const ceiledAverage = Math.ceil(average);

    return Math.max(1, Math.min(5, ceiledAverage));
  } catch (error) {
    console.error('Error calculating average mood:', error);
    return 3;
  }
}

export default calculateAverageMood;