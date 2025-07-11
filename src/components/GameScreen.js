import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

const GameScreen = () => {
  const { level } = useParams();
  const navigate = useNavigate();

  const timerRef = useRef(null);
  const timeoutRef = useRef(null);
  const dingSoundRef = useRef(null);
  const timeupSoundRef = useRef(null);
  const failed2xSoundRef = useRef(null);

  const [gameKey, setGameKey] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [gameData, setGameData] = useState(null);
  const [found, setFound] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeExpired, setTimeExpired] = useState(false);
  const [scale, setScale] = useState(1);
  const [hasInteracted, setHasInteracted] = useState(false);

  const loadLevel = useCallback(() => {
    clearInterval(timerRef.current);
    clearTimeout(timeoutRef.current);

    import(`../data/${level}.json`)
      .then((data) => {
        setGameData(data.default || data);
        setFound([]);
        setCompleted(false);
        setTimeLeft(60);
        setTimeExpired(false);
        setHasInteracted(false);
      })
      .catch((error) => {
        console.error('Level not found or failed to load:', error);
        alert('Level not found');
      });
  }, [level]);

  useEffect(() => {
    loadLevel();
  }, [loadLevel, gameKey]);

  // Initializeee sound on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        dingSoundRef.current = new Audio('/ding.mp3');
        timeupSoundRef.current = new Audio('/timeup.mp3');
        failed2xSoundRef.current = new Audio('/failed.mp3');
        setHasInteracted(true);
      }
      window.removeEventListener('click', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, [hasInteracted]);

  useEffect(() => {
    if (!gameData || completed || timeExpired) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimeExpired(true);
          if (hasInteracted && timeupSoundRef.current) {
            timeupSoundRef.current.play().catch(() => {});
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameData, completed, timeExpired, hasInteracted]);

  // Auto redirect
  useEffect(() => {
    if (timeExpired && !completed) {
      timeoutRef.current = setTimeout(() => {
        navigate('/');
      }, 5000);
      return () => clearTimeout(timeoutRef.current);
    }
  }, [timeExpired, completed, navigate]);

  useEffect(() => {
    if (retryCount === 2 && timeExpired && !completed && hasInteracted) {
      failed2xSoundRef.current?.play().catch(err => {
        console.log('🔇 Failed2x sound error:', err);
      });
    }
  }, [retryCount, timeExpired, completed, hasInteracted]);

  useEffect(() => {
    if (gameData && found.length === gameData.differences.length) {
      setCompleted(true);
      clearInterval(timerRef.current);

      const currentLevelNum = parseInt(level.replace('level', ''), 10);
      const nextLevel = `level${currentLevelNum + 1}`;

      timeoutRef.current = setTimeout(() => {
        navigate(currentLevelNum >= 8 ? '/' : `/game/${nextLevel}`);
      }, currentLevelNum >= 8 ? 5000 : 3000);

      return () => clearTimeout(timeoutRef.current);
    }
  }, [found, gameData, level, navigate]);

  const handleImageLoad = useCallback((e) => {
    const img = e.target;
    if (gameData && img.naturalWidth) {
      const scaleFactor = img.naturalWidth / img.clientWidth;
      setScale(scaleFactor);
    }
  }, [gameData]);

  const handleClick = (e, img) => {
    if (completed || timeExpired) return;

    const rect = img.getBoundingClientRect();
    const x = (e.clientX - rect.left) * scale;
    const y = (e.clientY - rect.top) * scale;

    gameData.differences.forEach((diff, idx) => {
      const { x: dx, y: dy, width, height } = diff;
      if (
        x >= dx && x <= dx + width &&
        y >= dy && y <= dy + height &&
        !found.includes(idx)
      ) {
        setFound((prev) => [...prev, idx]);
        dingSoundRef.current?.play().catch(() => {});
      }
    });
  };

  const renderMarkers = () => {
    if (!gameData || scale === 0) return null;

    return found.map((index) => {
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
  };

  if (!gameData) return <p>Loading...</p>;

  const img1 = imageMap[gameData.images.image1];
  const img2 = imageMap[gameData.images.image2];
  const currentLevelNum = parseInt(level.replace('level', ''), 10);

  return (
    <div key={gameKey} style={{
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

      {completed && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          {currentLevelNum === 8 ? (
            <>
              <h3 style={{ color: '#28a745', fontSize: '1.7rem', marginBottom: '0.5rem' }}>
                🏁 You crushed all 8 levels! 🔥
              </h3>
              <p style={{ color: '#444', fontSize: '1rem' }}>
                🎖️ Spot-the-Diff Champion unlocked! Taking you home... 🏡
              </p>
            </>
          ) : (
            <>
              <h3 style={{ color: '#28a745', fontSize: '1.7rem', marginBottom: '0.5rem' }}>
                ✅ Nailed it in {60 - timeLeft}s!
              </h3>
              <p style={{ color: '#444', fontSize: '1rem' }}>
                ⏭️ Loading your next challenge... Get ready! 🧠🕵️
              </p>
            </>
          )}
        </div>
      )}

      {timeExpired && !completed && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h3 style={{ color: 'red', marginBottom: '1rem' }}>
            {retryCount >= 2 ? '😭 You failed 2 times!' :
              retryCount === 1 ? '😪 Failed again!' : '⏱ Time\'s up!'}
          </h3>

          {retryCount < 2 ? (
            <>
              <button
                onClick={() => {
                  clearInterval(timerRef.current);
                  clearTimeout(timeoutRef.current);
                  setTimeLeft(60);
                  setFound([]);
                  setCompleted(false);
                  setTimeExpired(false);
                  setHasInteracted(false);
                  setRetryCount(prev => prev + 1);
                  setGameKey(prev => prev + 1);
                }}
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
            </>
          ) : (
            <p style={{
              fontSize: '1rem',
              color: '#666'
            }}>
              Redirecting to home...
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default GameScreen;
