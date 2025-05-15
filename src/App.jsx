import { useState, useEffect } from 'react';
import face1 from './assets/face-sad-tear-regular.svg';
import face2 from './assets/face-meh-regular.svg';
import face3 from './assets/face-smile-regular.svg';
import face4 from './assets/face-laugh-beam-regular.svg';
import face5 from './assets/face-grin-stars-regular.svg';
import './App.css';
import saveMood from './utils/SaveMood';
import calculateAverageMood from './utils/AverageMood';

const moodMap = {
  'very-sad': { label: 'Very Sad', icon: face1, message: 'It’s okay to feel down. Better days are coming 💛', value: 1 },
  'meh': { label: 'Meh', icon: face2, message: 'Not every day is exciting, and that’s alright 🧘', value: 2 },
  'okay': { label: 'Okay', icon: face3, message: 'A calm day is still progress 🌿', value: 3 },
  'happy': { label: 'Happy', icon: face4, message: 'Glad you’re feeling good today! Keep shining 🌟', value: 4 },
  'very-happy': { label: 'Very Happy', icon: face5, message: 'You’re glowing! Spread the joy around ✨', value: 5 },
};

const valueToIcon = {
  1: face1,
  2: face2,
  3: face3,
  4: face4,
  5: face5,
};

function App() {
  const [date, setDate] = useState('');
  const [selectedMood, setSelectedMood] = useState('okay');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [staticMessage, setStaticMessage] = useState('');
  const [averageMood, setAverageMood] = useState(3); 
  const [moodArray, setMoodArray] = useState([]);

  useEffect(() => {
    const today = new Date().toDateString();
    setDate(today);

    const storedArray = localStorage.getItem('moodArray');
    if (storedArray) {
      try {
        const parsedArray = JSON.parse(storedArray);
        setMoodArray(parsedArray);
        setAverageMood(calculateAverageMood());
      } catch (error) {
        console.error('Error loading mood array:', error);
      }
    }
  }, []);

  const handleMoodClick = (moodKey) => {
    setSelectedMood(moodKey);
    setSelectedLabel(moodMap[moodKey].label);
    setStaticMessage(moodMap[moodKey].message);
  };

  const handleSaveMood = () => {
    if (!selectedMood || !moodMap[selectedMood]) {
      console.error('Invalid or null mood selected:', selectedMood);
      alert('Please select a valid mood!');
      return;
    }
    const newAverageMood = saveMood(selectedMood);
    const storedArray = localStorage.getItem('moodArray');
    if (storedArray) {
      try {
        const parsedArray = JSON.parse(storedArray);
        setMoodArray(parsedArray);
      } catch (error) {
        console.error('Error refreshing mood array:', error);
      }
    }
    setAverageMood(calculateAverageMood()); 
  };

  const geminiInsight = `Your average mood is "${moodMap[Object.keys(moodMap).find(key => moodMap[key].value === averageMood)]?.label || 'Okay'}". ${moodMap[Object.keys(moodMap).find(key => moodMap[key].value === averageMood)]?.message || 'A calm day is still progress 🌿'}`;

  return (
    <div className="d-flex flex-column">
      <div className="d-flex flex-row justify-content-center w-100 p-4">
        <div className="mainContainer text-center">
          <h1>MoodLens 🌥️</h1>
          <p>Today's Check-In</p>
          <p><strong>📅 {date}</strong></p>
          <p>Which vibe matches your day?</p>

          <div className="d-flex justify-content-center gap-2">
            {Object.keys(moodMap).map((moodKey) => (
              <button
                key={moodKey}
                onClick={() => handleMoodClick(moodKey)}
                className={`emojiButton ${selectedMood === moodKey ? 'selected' : ''}`}
              >
                <img
                  src={moodMap[moodKey].icon}
                  alt={moodMap[moodKey].label}
                  className="emojiSettings"
                />
              </button>
            ))}
          </div>

          {selectedMood && (
            <>
              <p className="mt-3">📍 <strong>Selected Mood:</strong> {selectedLabel}</p>
              <p>📝 <em>{staticMessage}</em></p>
            </>
          )}

          <button
            id="submitTodayMood"
            className="btn btn-primary mt-3"
            type="button"
            onClick={handleSaveMood}
            disabled={!selectedMood}
          >
            Save Mood
          </button>

          <p className="mt-4">
            📆 Past 7 Days Mood:{' '}
            {moodArray.length > 0 ? (
              <>
                {moodArray.map((entry, index) => (
                  <img
                    key={index}
                    src={valueToIcon[entry.mood]}
                    alt={moodMap[Object.keys(moodMap).find(key => moodMap[key].value === entry.mood)]?.label}
                    className="emojiSettings inline-emoji"
                    style={{ width: '24px', height: '24px', margin: '0 2px' }}
                  />
                ))}
                <br/>
                {' '}Average Mood:{' '}
                <img
                  src={valueToIcon[averageMood]}
                  alt={moodMap[Object.keys(moodMap).find(key => moodMap[key].value === averageMood)]?.label}
                  className="emojiSettings inline-emoji"
                  style={{ width: '24px', height: '24px' }}
                />
              </>
            ) : (
              'No mood history yet'
            )}
          </p>
          <p>
            🧠 Admini Insight: <span id="geminiMessage">{geminiInsight}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;