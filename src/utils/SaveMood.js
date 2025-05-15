const moodMap = {
  'very-sad': { label: 'Very Sad', value: 1 },
  'meh': { label: 'Meh', value: 2 },
  'okay': { label: 'Okay', value: 3 },
  'happy': { label: 'Happy', value: 4 },
  'very-happy': { label: 'Very Happy', value: 5 },
};

const valueToMoodKey = {
  1: 'very-sad',
  2: 'meh',
  3: 'okay',
  4: 'happy',
  5: 'very-happy',
};

function saveMood(moodInput) {
  try {
    let moodValue;
    if (typeof moodInput === 'string' && moodMap[moodInput]) {
      moodValue = moodMap[moodInput].value;
    } else if (typeof moodInput === 'number' && moodInput >= 1 && moodInput <= 5) {
      moodValue = moodInput;
    } else {
      throw new Error('Invalid mood input');
    }

    const today = new Date().toDateString();

    let moodArray = localStorage.getItem('moodArray');
    if (moodArray === null) {
      moodArray = [];
    } else {
      moodArray = JSON.parse(moodArray);
    }

    moodArray = moodArray.filter((entry) => entry.date !== today);

    moodArray.push({ date: today, mood: moodValue });

    moodArray.sort((a, b) => new Date(b.date) - new Date(a.date));
    moodArray = moodArray.slice(0, 7);

    localStorage.setItem('moodArray', JSON.stringify(moodArray));

    const moodValues = moodArray.map((entry) => entry.mood);
    const average = moodValues.length > 0
      ? moodValues.reduce((sum, val) => sum + val, 0) / moodValues.length
      : moodValue;
    const ceiledAverage = Math.ceil(average);
    const averageMoodKey = valueToMoodKey[ceiledAverage] || 'okay';

    return averageMoodKey;
  } catch (error) {
    console.error('Error saving mood:', error);
    return 'okay';
  }
}

export default saveMood;