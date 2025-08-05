import { gsap } from 'gsap';
import anime from 'animejs';

// GSAP Animations
export const gsapAnimations = {
  // Page load animation
  pageLoad: (element) => {
    gsap.fromTo(element, 
      { 
        opacity: 0, 
        y: 50,
        scale: 0.9
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 0.8, 
        ease: "power3.out",
        stagger: 0.1
      }
    );
  },

  // Task item entrance animation
  taskEnter: (element) => {
    gsap.fromTo(element,
      {
        opacity: 0,
        x: -50,
        rotationY: -15,
        scale: 0.8
      },
      {
        opacity: 1,
        x: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.6,
        ease: "back.out(1.7)"
      }
    );
  },

  // Task item exit animation
  taskExit: (element, onComplete) => {
    gsap.to(element, {
      opacity: 0,
      x: 50,
      rotationY: 15,
      scale: 0.8,
      duration: 0.4,
      ease: "power2.in",
      onComplete
    });
  },

  // Button hover animation
  buttonHover: (element) => {
    gsap.to(element, {
      scale: 1.05,
      y: -2,
      duration: 0.3,
      ease: "power2.out"
    });
  },

  // Button unhover animation
  buttonUnhover: (element) => {
    gsap.to(element, {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: "power2.out"
    });
  },

  // Modal/Form entrance
  modalEnter: (element) => {
    gsap.fromTo(element,
      {
        opacity: 0,
        scale: 0.7,
        y: 100
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.4)"
      }
    );
  },

  // Error shake animation
  errorShake: (element) => {
    gsap.to(element, {
      x: [-10, 10, -8, 8, -6, 6, -4, 4, 0],
      duration: 0.6,
      ease: "power2.out"
    });
  },

  // Success pulse animation
  successPulse: (element) => {
    gsap.fromTo(element,
      { scale: 1 },
      {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      }
    );
  },

  // Loading spinner
  loadingSpinner: (element) => {
    gsap.to(element, {
      rotation: 360,
      duration: 1,
      ease: "none",
      repeat: -1
    });
  },

  // Stagger animation for lists
  staggerIn: (elements) => {
    gsap.fromTo(elements,
      {
        opacity: 0,
        y: 30,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1
      }
    );
  }
};

// Anime.js Animations
export const animeAnimations = {
  // Floating elements animation
  floatingElements: (selector) => {
    anime({
      targets: selector,
      translateY: [
        { value: -10, duration: 2000 },
        { value: 0, duration: 2000 }
      ],
      rotate: [
        { value: '1deg', duration: 1000 },
        { value: '-1deg', duration: 1000 }
      ],
      easing: 'easeInOutSine',
      loop: true,
      delay: anime.stagger(200)
    });
  },

  // Text typing animation
  textTyping: (element, text) => {
    element.innerHTML = '';
    const chars = text.split('');
    chars.forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      element.appendChild(span);
    });

    anime({
      targets: `${element.tagName.toLowerCase()} span`,
      opacity: [0, 1],
      duration: 50,
      delay: anime.stagger(50),
      easing: 'easeOutQuad'
    });
  },

  // Morphing shapes animation
  morphPath: (selector) => {
    anime({
      targets: selector,
      d: [
        { value: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z' },
        { value: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' }
      ],
      duration: 3000,
      easing: 'easeInOutQuart',
      loop: true,
      direction: 'alternate'
    });
  },

  // Particle system animation
  particles: (selector) => {
    anime({
      targets: selector,
      translateX: () => anime.random(-100, 100),
      translateY: () => anime.random(-100, 100),
      scale: [
        { value: 0.5, duration: 500 },
        { value: 1, duration: 1000 },
        { value: 0.5, duration: 500 }
      ],
      opacity: [
        { value: 0.7, duration: 500 },
        { value: 0.2, duration: 1000 },
        { value: 0.7, duration: 500 }
      ],
      duration: 2000,
      easing: 'easeInOutQuad',
      loop: true,
      delay: anime.stagger(100)
    });
  },

  // Wave animation
  wave: (selector) => {
    anime({
      targets: selector,
      translateY: [
        { value: -15, duration: 1000 },
        { value: 0, duration: 1000 }
      ],
      easing: 'easeInOutSine',
      loop: true,
      delay: anime.stagger(100, { from: 'center' })
    });
  },

  // Progress bar animation
  progressBar: (selector, percentage) => {
    anime({
      targets: selector,
      width: `${percentage}%`,
      duration: 1500,
      easing: 'easeOutCubic'
    });
  },

  // Counter animation
  counter: (element, endValue) => {
    const obj = { count: 0 };
    anime({
      targets: obj,
      count: endValue,
      duration: 2000,
      easing: 'easeOutExpo',
      update: () => {
        element.textContent = Math.round(obj.count);
      }
    });
  },

  // Card flip animation
  cardFlip: (selector) => {
    anime({
      targets: selector,
      rotateY: [
        { value: 0, duration: 0 },
        { value: 90, duration: 400 },
        { value: 0, duration: 400 }
      ],
      easing: 'easeInOutSine',
      complete: (anim) => {
        // Callback when animation completes
      }
    });
  }
};

// Combined animation presets
export const animationPresets = {
  // Hero section entrance
  heroEntrance: (heroElement, titleElement, subtitleElement) => {
    const tl = gsap.timeline();
    
    tl.fromTo(heroElement,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo(titleElement,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      "-=0.5"
    )
    .fromTo(subtitleElement,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
      "-=0.3"
    );

    // Add floating animation with Anime.js
    animeAnimations.floatingElements(heroElement);
  },

  // Task completion celebration
  taskComplete: (element) => {
    // GSAP success pulse
    gsapAnimations.successPulse(element);
    
    // Anime.js confetti-like effect
    anime({
      targets: element,
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      duration: 600,
      easing: 'easeInOutBack'
    });
  },

  // Loading sequence
  loadingSequence: (elements) => {
    gsap.timeline()
      .to(elements, {
        opacity: 0.3,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.inOut"
      })
      .to(elements, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.inOut"
      })
      .repeat(-1);
  }
};

// Utility functions
export const animationUtils = {
  // Check if element is in viewport
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Animate on scroll
  animateOnScroll: (selector, animation) => {
    const elements = document.querySelectorAll(selector);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animation(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
  },

  // Kill all animations
  killAll: () => {
    gsap.killTweensOf("*");
    anime.remove("*");
  }
};
