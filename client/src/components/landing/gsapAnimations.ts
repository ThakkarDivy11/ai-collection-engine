import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateHeroSection = (container: HTMLElement) => {
  // Animate title with stagger effect
  const title = container.querySelector('.hero-title');
  if (title) {
    const text = title.textContent || '';
    title.innerHTML = text.split('').map((char, i) =>
      `<span class="inline-block" style="animation-delay: ${i * 0.05}s">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');

    gsap.fromTo(title.querySelectorAll('span'),
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.03, ease: 'power4.out' }
    );
  }

  // Animate subtitle
  gsap.fromTo('.hero-subtitle',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out' }
  );

  // Animate buttons
  gsap.fromTo('.hero-button',
    { y: 20, opacity: 0, scale: 0.9 },
    { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.2, delay: 0.8, ease: 'back.out(1.7)' }
  );

  // Animate dashboard preview
  gsap.fromTo('.hero-dashboard',
    { y: 100, opacity: 0, scale: 0.95 },
    { y: 0, opacity: 1, scale: 1, duration: 1.2, delay: 1, ease: 'power3.out' }
  );

  // Animate dashboard elements with stagger
  gsap.fromTo('.hero-dashboard > div > div',
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay: 1.2, ease: 'power2.out' }
  );
};

export const animateFeaturesSection = (container: HTMLElement) => {
  const features = container.querySelectorAll('.feature-card');

  features.forEach((feature, index) => {
    gsap.fromTo(feature,
      {
        y: 100,
        opacity: 0,
        scale: 0.95
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: index * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: feature,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Animate section title
  gsap.fromTo('.features-title',
    { x: -50, opacity: 0 },
    { x: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: {
      trigger: '.features-title',
      start: 'top 80%'
    }}
  );
};

export const animateStatsSection = (container: HTMLElement) => {
  const stats = container.querySelectorAll('.stat-item');

  stats.forEach((stat, index) => {
    // Animate container
    gsap.fromTo(stat,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: stat,
          start: 'top 90%'
        }
      }
    );

    // Animate number counter
    const numberEl = stat.querySelector('.stat-number');
    if (numberEl) {
      const targetValue = parseFloat(numberEl.textContent?.replace(/[^0-9.]/g, '') || '0');

      gsap.fromTo(numberEl,
        { textContent: 0 },
        {
          textContent: targetValue,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: stat,
            start: 'top 85%'
          },
          onUpdate: function() {
            const current = Math.round(this.targets()[0].textContent as any);
            const suffix = numberEl.textContent?.replace(/[0-9]/g, '') || '';
            numberEl.textContent = current.toLocaleString() + suffix;
          }
        }
      );
    }
  });
};

export const animateTestimonials = (container: HTMLElement) => {
  const testimonials = container.querySelectorAll('.testimonial-card');

  gsap.fromTo(testimonials,
    {
      x: 100,
      opacity: 0,
      rotationY: 15
    },
    {
      x: 0,
      opacity: 1,
      rotationY: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%'
      }
    }
  );
};

export const animatePricingSection = (container: HTMLElement) => {
  const cards = container.querySelectorAll('.pricing-card');

  cards.forEach((card, index) => {
    gsap.fromTo(card,
      {
        y: 80,
        opacity: 0,
        scale: 0.9
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: index * 0.2,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%'
        }
      }
    );
  });

  // Highlight popular plan
  const popularCard = container.querySelector('.pricing-card.popular');
  if (popularCard) {
    gsap.to(popularCard, {
      boxShadow: '0 0 60px rgba(75, 138, 172, 0.3)',
      duration: 1,
      scrollTrigger: {
        trigger: popularCard,
        start: 'top 70%'
      }
    });
  }
};

export const animateCTASection = (container: HTMLElement) => {
  gsap.fromTo('.cta-content',
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: {
      trigger: container,
      start: 'top 80%'
    }}
  );

  gsap.fromTo('.cta-button',
    { scale: 0.8, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.8, delay: 0.3, ease: 'back.out(2)', scrollTrigger: {
      trigger: container,
      start: 'top 75%'
    }}
  );
};

export const createParallaxEffect = (element: HTMLElement, speed: number = 0.5) => {
  gsap.to(element, {
    yPercent: -50 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
};

export const createFloatingElements = (selector: string) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el, index) => {
    gsap.to(el, {
      y: 'random(-20, 20)',
      x: 'random(-10, 10)',
      rotation: 'random(-5, 5)',
      duration: 'random(3, 6)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.2
    });
  });
};

export const createGlowPulse = (selector: string) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    gsap.to(el, {
      boxShadow: '0 0 30px rgba(75, 138, 172, 0.6), 0 0 60px rgba(75, 138, 172, 0.3)',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut'
    });
  });
};

export const createMagnetEffect = (selector: string) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    const trigger = el as HTMLElement;
    
    trigger.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = trigger.getBoundingClientRect();
      
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      gsap.to(trigger, {
        x: x * 0.4,
        y: y * 0.4,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    trigger.addEventListener('mouseleave', () => {
      gsap.to(trigger, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  });
};

export const cleanupScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};

// New advanced hero animations
export const createMouseParallax = (container: HTMLElement, elements: string[]) => {
  elements.forEach(selector => {
    const els = container.querySelectorAll(selector);
    els.forEach((el) => {
      const element = el as HTMLElement;

      container.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = container.getBoundingClientRect();

        const x = (clientX - left - width / 2) / width;
        const y = (clientY - top - height / 2) / height;

        gsap.to(element, {
          x: x * 30,
          y: y * 30,
          duration: 1,
          ease: 'power2.out'
        });
      });

      container.addEventListener('mouseleave', () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 1,
          ease: 'power2.out'
        });
      });
    });
  });
};

export const createScrollReveal = (selector: string, options = {}) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    const defaults = {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      ...options
    };

    gsap.fromTo(el,
      { y: defaults.y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: defaults.duration,
        ease: defaults.ease,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
};

export const createTextReveal = (selector: string) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    const text = el.textContent || '';
    el.innerHTML = text.split('').map((char, i) =>
      `<span class="inline-block overflow-hidden"><span class="inline-block" style="animation-delay: ${i * 0.03}s">${char === ' ' ? '&nbsp;' : char}</span></span>`
    ).join('');

    gsap.fromTo(el.querySelectorAll('span > span'),
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.6, stagger: 0.03, ease: 'power4.out' }
    );
  });
};

export const createScaleOnScroll = (selector: string) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    gsap.fromTo(el,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
};

export const createHeroFloatingElements = (container: HTMLElement) => {
  // Create floating particles
  const particleCount = 20;
  const particles: HTMLElement[] = [];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'absolute rounded-full bg-calypso-500/20 dark:bg-calypso-400/20 pointer-events-none';
    particle.style.cssText = `
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      will-change: transform, opacity;
    `;
    container.appendChild(particle);
    particles.push(particle);

    // Animate each particle
    gsap.to(particle, {
      y: 'random(-100, -20)',
      x: 'random(-20, 20)',
      opacity: 'random(0.3, 0.8)',
      duration: 'random(3, 8)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: Math.random() * 2
    });
  }

  return () => {
    particles.forEach(p => p.remove());
  };
};

export const createButtonGlow = (selector: string) => {
  const buttons = document.querySelectorAll(selector);

  buttons.forEach((button) => {
    const btn = button as HTMLElement;

    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, {
        boxShadow: '0 0 30px rgba(75, 138, 172, 0.5), 0 0 60px rgba(75, 138, 172, 0.3)',
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        boxShadow: '0 30px 60px rgba(0,0,0,0.1)',
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });
};

export const createStaggeredReveal = (container: HTMLElement, selector: string) => {
  const elements = container.querySelectorAll(selector);

  gsap.fromTo(elements,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%'
      }
    }
  );
};

export const createHeroScrollAnimations = () => {
  // Parallax effect on hero content
  gsap.to('.hero-title', {
    yPercent: -30,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-title',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.to('.hero-subtitle', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-subtitle',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // Scale down dashboard on scroll
  gsap.to('.hero-dashboard', {
    scale: 0.9,
    opacity: 0.8,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-dashboard',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
};