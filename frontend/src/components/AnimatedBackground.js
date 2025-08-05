import React, { useEffect, useRef } from 'react';
import { animeAnimations } from '../utils/animations';

const AnimatedBackground = () => {
  const particlesRef = useRef(null);

  useEffect(() => {
    // Create floating particles
    const createParticles = () => {
      const container = particlesRef.current;
      if (!container) return;

      // Clear existing particles
      container.innerHTML = '';

      // Create 15 particles (reduced for better performance)
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
          position: absolute;
          width: ${Math.random() * 4 + 2}px;
          height: ${Math.random() * 4 + 2}px;
          background: rgba(255, 255, 255, ${Math.random() * 0.6 + 0.2});
          border-radius: 50%;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          pointer-events: none;
        `;
        container.appendChild(particle);
      }

      // Simple floating animation using anime.js
      try {
        animeAnimations.floatingElements('.particle');
      } catch (error) {
        console.log('Animation library loading...', error);
      }
    };

    // Create particles after component mounts
    const timer = setTimeout(createParticles, 500);

    return () => clearTimeout(timer);
  }, []);

  const styles = {
    background: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      zIndex: -1,
      overflow: 'hidden',
    },
    particles: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `
        radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
      `,
    },
    mesh: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.1) 1px, transparent 0)
      `,
      backgroundSize: '50px 50px',
      animation: 'meshMove 20s linear infinite',
    }
  };

  return (
    <div style={styles.background}>
      <div style={styles.gradientOverlay}></div>
      <div style={styles.mesh}></div>
      <div ref={particlesRef} style={styles.particles}></div>
      <style>{`
        @keyframes meshMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
