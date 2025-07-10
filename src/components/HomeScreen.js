import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Poppins', 'Segoe UI', sans-serif",
      padding: '2rem',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating Glow */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(102,126,234,0.25), transparent)',
        top: '-100px',
        right: '-100px',
        zIndex: 0,
        filter: 'blur(60px)'
      }} />

      <h1 style={{
        fontSize: '3.6rem',
        marginBottom: '1rem',
        textShadow: '2px 4px 10px rgba(0,0,0,0.3)',
        animation: 'fadeInDown 1s ease-out',
        zIndex: 1
      }}>
        🕵️ Spot the Difference
      </h1>

      <p style={{
        fontSize: '1.25rem',
        maxWidth: '620px',
        lineHeight: '1.7',
        color: '#d6e4f0',
        marginBottom: '2rem',
        animation: 'fadeIn 1.5s ease-in',
        zIndex: 1
      }}>
        A fun and challenging visual puzzle game. Spot all the hidden differences between two images before time runs out!
      </p>

      <button
        onClick={() => navigate('/levels')}
        style={{
          padding: '1rem 2.5rem',
          fontSize: '1.15rem',
          background: 'linear-gradient(to right, #667eea, #764ba2)',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 10px 24px rgba(102,126,234,0.3)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          animation: 'fadeInUp 1.2s ease-out',
          zIndex: 1
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.06)';
          e.currentTarget.style.boxShadow = '0 14px 28px rgba(118,75,162,0.35)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 10px 24px rgba(102,126,234,0.3)';
        }}
      >
        ▶ Start Game
      </button>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeInDown {
            0% { transform: translateY(-30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }

          @keyframes fadeInUp {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }

          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

export default HomeScreen;
