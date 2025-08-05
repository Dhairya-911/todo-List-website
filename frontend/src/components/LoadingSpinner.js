import React, { useEffect, useRef } from 'react';
import { gsapAnimations } from '../utils/animations';
import { gsap } from 'gsap';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  const spinnerRef = useRef(null);
  const dotsRef = useRef([]);

  useEffect(() => {
    if (spinnerRef.current) {
      gsapAnimations.loadingSpinner(spinnerRef.current);
    }

    // Animate dots
    dotsRef.current.forEach((dot, index) => {
      if (dot) {
        gsap.to(dot, {
          scale: [1, 1.5, 1],
          duration: 1,
          repeat: -1,
          delay: index * 0.2,
          ease: "power2.inOut"
        });
      }
    });
  }, []);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      fontFamily: "'Segoe UI', 'Roboto', sans-serif",
    },
    spinner: {
      width: '60px',
      height: '60px',
      border: '6px solid rgba(255, 255, 255, 0.3)',
      borderTop: '6px solid #fff',
      borderRadius: '50%',
      marginBottom: '1.5rem',
    },
    message: {
      fontSize: '1.2rem',
      fontWeight: '500',
      marginBottom: '1rem',
      letterSpacing: '0.5px',
    },
    dots: {
      display: 'flex',
      gap: '0.5rem',
    },
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    }
  };

  return (
    <div style={styles.container}>
      <div ref={spinnerRef} style={styles.spinner}></div>
      <div style={styles.message}>{message}</div>
      <div style={styles.dots}>
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            ref={el => dotsRef.current[index] = el}
            style={styles.dot}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;
