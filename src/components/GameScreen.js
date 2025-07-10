import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Image map for all levels
const imageMap = {
  'level1-image1.jpg': require('../assets/level1-image1.jpg'),
  'level1-image2.jpg': require('../assets/level1-image2.jpg'),
  'level2-image1.jpg': require('../assets/level2-image1.jpg'),
  'level2-image2.jpg': require('../assets/level2-image2.jpg'),
  'level3-image1.jpg': require('../assets/level3-image1.jpg'),
  'level3-image2.jpg': require('../assets/level3-image2.jpg'),
  'level4-image1.jpg': require('../assets/level4-image1.jpg'),
  'level4-image2.jpg': require('../assets/level4-image2.jpg'),
  'level5-image1.jpg': require('../assets/level5-image1.jpg'),
  'level5-image2.jpg': require('../assets/level5-image2.jpg'),
  'level6-image1.jpg': require('../assets/level6-image1.jpg'),
  'level6-image2.jpg': require('../assets/level6-image2.jpg'),
  'level7-image1.jpg': require('../assets/level7-image1.jpg'),
  'level7-image2.jpg': require('../assets/level7-image2.jpg'),
  'level8-image1.jpg': require('../assets/level8-image1.jpg'),
  'level8-image2.jpg': require('../assets/level8-image2.jpg')
};

const dingSound = new Audio('/ding.mp3');
const timeupSound = new Audio('/timeup.mp3');

const GameScreen = () => {
  const { level } = useParams();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const [gameData, setGameData] = useState(null);
  const [found, setFound] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeExpired, setTimeExpired] = useState(false);
  const [scale, setScale] = useState(1);

  // Load level JSON and reset all state
  useEffect(() => {
    import(`../data/${level}.json`)
      .then((data) => {
        setGameData(data.default || data);
        setFound([]);
        setCompleted(false);
        setTimeLeft(60);
        setTimeExpired(false);
      })
      .catch(() => alert('Level not found'));
  }, [level]);

  // Timer countdown
  useEffect(() => {
    if (!gameData || completed) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimeExpired(true);
          timeupSound.play();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameData, completed]);

  // Auto redirect to home if time runs out
  useEffect(() => {
    if (timeExpired && !completed) {
      const timeout = setTimeout(() => {
        navigate('/');
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [timeExpired]);

  // Auto redirect to next level if completed
  useEffect(() => {
    if (gameData && found.length === gameData.differences.length) {
      setCompleted(true);
      clearInterval(timerRef.current);

      const currentLevelNum = parseInt(level.replace('level', ''));
      const nextLevel = `level${currentLevelNum + 1}`;

      const timeout = setTimeout(() => {
        navigate(`/game/${nextLevel}`);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [found]);

  const handleImageLoad = (e) => {
    const displayedWidth = e.target.clientWidth;
    const expectedWidth = gameData.images.width;
    const scaleFactor = expectedWidth / displayedWidth;
    setScale(scaleFactor);
  };

  const handleClick = (e, img) => {
    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    console.log(`🖱️ Click at: x = ${Math.floor(x)}, y = ${Math.floor(y)}`);

    gameData.differences.forEach((diff, idx) => {
      const { x: dx, y: dy, width, height } = diff;
      if (
        x >= dx && x <= dx + width &&
        y >= dy && y <= dy + height &&
        !found.includes(idx)
      ) {
        setFound((prev) => [...prev, idx]);
        dingSound.play();
      }
    });
  };

  const renderMarkers = () =>
    found.map((index) => {
      const { x, y, width, height } = gameData.differences[index];
      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: y / scale,
            left: x / scale,
            width: width / scale,
            height: height / scale,
            border: '2px solid red',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
      );
    });

  if (!gameData) return <p>Loading...</p>;

  const img1 = imageMap[gameData.images.image1];
  const img2 = imageMap[gameData.images.image2];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #f0f2f5, #dfe9f3)',
      padding: '2rem',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: '2.2rem',
        marginBottom: '1rem',
        color: '#333'
      }}>
        🔍 {gameData.gameTitle}
      </h2>

      <div style={{
        textAlign: 'center',
        fontSize: '1.1rem',
        color: '#444',
        marginBottom: '2rem'
      }}>
        <p><strong>Found:</strong> {found.length} / {gameData.differences.length}</p>
        <p><strong>Time Left:</strong> {timeLeft}s</p>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '2rem',
        maxWidth: '1300px',
        margin: '0 auto'
      }}>
        {[img1, img2].map((src, i) => (
          <div key={i} style={{
            position: 'relative',
            border: '2px solid #ccc',
            borderRadius: '10px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            background: '#fff'
          }}>
            <img
              src={src}
              onClick={(e) => handleClick(e, e.target)}
              onLoad={handleImageLoad}
              style={{
                width: '90vw',
                maxWidth: '400px',
                cursor: 'pointer',
                display: 'block'
              }}
              alt=""
            />
            {renderMarkers()}
          </div>
        ))}
      </div>

      {/* ✅ Success UI */}
      {completed && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: '#28a745', fontSize: '1.7rem', marginBottom: '0.5rem' }}>
            🎉 Great job! You completed this level in {60 - timeLeft}s!
          </h3>
          <p style={{ color: '#444', fontSize: '1rem' }}>
            🚀 Redirecting to the next challenge...
          </p>
        </div>
      )}

      {/* ❌ Time's up UI */}
      {timeExpired && !completed && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'red', marginBottom: '1rem' }}>
            ⏱ Time's up!
          </h3>
          <button
            onClick={() => navigate(`/game/${level}`)}
            style={{
              padding: '0.7rem 2rem',
              backgroundColor: '#ff4d4d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500
            }}
          >
            🔁 Try Again
          </button>
          <p style={{
            marginTop: '1rem',
            fontSize: '0.95rem',
            color: '#444'
          }}>
            Or you'll be redirected to the Home Page in 5 seconds...
          </p>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
