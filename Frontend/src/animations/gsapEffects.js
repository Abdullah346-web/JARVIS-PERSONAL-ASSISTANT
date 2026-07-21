import gsap from 'gsap';

export const animateParticles = (element) => {
  const particles = element.querySelectorAll('.particle');
  particles.forEach((particle) => {
    gsap.to(particle, {
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      opacity: 0,
      duration: Math.random() * 2 + 1,
      ease: 'power2.out',
    });
  });
};

export const animateCard = (element) => {
  gsap.from(element, {
    opacity: 0,
    y: 50,
    duration: 0.6,
    ease: 'back.out',
  });

  element.addEventListener('mouseenter', () => {
    gsap.to(element, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  });
};

export const typewriterEffect = (element, text, speed = 50) => {
  let index = 0;
  element.textContent = '';

  const type = () => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  };

  type();
};

export const glitchEffect = (element) => {
  const originalText = element.textContent;

  gsap.timeline({ repeat: -1, repeatDelay: 3 }).to(element, {
    duration: 0.1,
    text: originalText.split('').sort(() => 0.5 - Math.random()).join(''),
  });
};
