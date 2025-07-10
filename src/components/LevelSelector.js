import React from 'react';
import { useNavigate } from 'react-router-dom';
import level1Image from '../assets/level1-image1.jpg';
import level2Image from '../assets/level2-image1.jpg';
import level3Image from '../assets/level3-image1.jpg';
import level4Image from '../assets/level4-image1.jpg';
import level5Image from '../assets/level5-image1.jpg';
import level6Image from '../assets/level6-image1.jpg';
import level7Image from '../assets/level7-image1.jpg';
import level8Image from '../assets/level8-image1.jpg';

const levels = [
  { id: 'level1', title: 'Ladybugs 🐞', preview: level1Image },
  { id: 'level2', title: '🌲 Forest Animals', preview: level2Image },
  { id: 'level3', title: 'Fruits 🍎', preview: level3Image },
  { id: 'level4', title: '🚴 Cycling', preview: level4Image },
  { id: 'level5', title: 'Concert Fun 🎶', preview: level5Image },
  { id: 'level6', title: 'Fashion Designer 👗', preview: level6Image },
  { id: 'level7', title: "🦉 Jungle Tribe's", preview: level7Image },
  { id: 'level8', title: '🎨 Artist Painting', preview: level8Image }
];

function LevelSelector() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #141e30, #243b55)',
      padding: '2rem 1rem',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <h2 style={{
        textAlign: 'center',
        fontSize: '2.5rem',
        marginBottom: '2.5rem',
        color: '#fff',
        fontWeight: '700',
        letterSpacing: '1px'
      }}>
        🎮 Choose a Level to Begin
      </h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '2rem',
        maxWidth: '1300px',
        margin: '0 auto'
      }}>
        {levels.map((level) => (
          <div
            key={level.id}
            style={{
              width: '260px',
              height: '360px',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
              background: '#1c1c1c',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              position: 'relative'
            }}
            onClick={() => navigate(`/game/${level.id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 18px #667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
            }}
          >
            <img
              src={level.preview}
              alt={level.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.8)'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              background: 'rgba(0, 0, 0, 0.7)',
              color: '#fff',
              textAlign: 'center',
              padding: '1rem',
              backdropFilter: 'blur(6px)'
            }}>
              <h4 style={{
                fontSize: '1.2rem',
                fontWeight: 600,
                margin: '0 0 1rem'
              }}>
                {level.title}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/game/${level.id}`);
                }}
                style={{
                  padding: '0.6rem 1.4rem',
                  backgroundColor: '#667eea',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background 0.3s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a67d8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#667eea'}
              >
                ▶ Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LevelSelector;
