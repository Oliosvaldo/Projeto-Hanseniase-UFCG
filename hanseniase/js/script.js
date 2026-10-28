/**
 * PROJETO HANSENÍASE - UFCG (PROF. SALES)
 * JavaScript Vanilla (Puro): Contadores, Lightbox, Carrossel e Rota GPS
 */

document.addEventListener('DOMContentLoaded', () => {

  // ================= 1. MENU MOBILE & HEADER SCROLL =================
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Alterna o menu mobile
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active');
    });

    // Fecha o menu ao clicar em qualquer link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // Efeito de sombra e redução do header ao rolar a página
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  // ================= 2. CONTADORES ANIMADOS (INTERSECTION OBSERVER) =================
  const countersSection = document.getElementById('counters');
  const counterNumbers = document.querySelectorAll('.counter-number');
  let countersAnimated = false;

  const animateCounters = () => {
    counterNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000; // 2 segundos
      const stepTime = 20;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.innerText = target + suffix;
          clearInterval(timer);
        } else {
          counter.innerText = Math.floor(current) + suffix;
        }
      }, stepTime);
    });
  };

  if ('IntersectionObserver' in window && countersSection) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          animateCounters();
          countersAnimated = true;
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(countersSection);
  } else {
    // Fallback para navegadores antigos
    animateCounters();
  }


  // ================= 3. GALERIA COM LIGHTBOX MODAL =================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const fullSrc = item.getAttribute('data-src') || item.querySelector('img').src;
        lightboxImg.src = fullSrc;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // trava rolagem de fundo
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Tecla ESC fecha o lightbox
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }


  // ================= 4. CARROSSEL DE DEPOIMENTOS =================
  const track = document.getElementById('carouselTrack');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');

  let currentIndex = 0;
  const totalCards = cards.length;
  let autoPlayInterval = null;

  if (track && totalCards > 0) {
    // Cria os pontos (dots) dinamicamente
    for (let i = 0; i < totalCards; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.dot');

    const updateCarousel = () => {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    const goToSlide = (index) => {
      currentIndex = index;
      updateCarousel();
      resetAutoPlay();
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % totalCards;
      updateCarousel();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + totalCards) % totalCards;
      updateCarousel();
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    // Rotação automática a cada 6 segundos
    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, 6000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    };

    startAutoPlay();
  }


  // ================= 5. GEOLOCALIZAÇÃO: TRAÇAR ROTA ATÉ A UBS =================
  const btnTracarRota = document.getElementById('btnTracarRota');

  if (btnTracarRota) {
    btnTracarRota.addEventListener('click', () => {
      if ('geolocation' in navigator) {
        btnTracarRota.innerText = 'Buscando sua localização...';

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Abre o Google Maps traçando rota da localização atual até a UBS/Posto de Saúde mais próximo
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=Unidade+Basica+de+Saude+UBS+Posto+de+Saude&travelmode=driving`;
            window.open(mapsUrl, '_blank', 'noopener,noreferrer');
            btnTracarRota.innerHTML = '<span class="btn-icon">📍</span> Traçar Rota para UBS Próxima';
          },
          (error) => {
            // Em caso de recusa de permissão ou erro, abre a busca direta no Google Maps
            const fallbackUrl = 'https://www.google.com/maps/search/posto+de+saude+ubs+mais+proximo/';
            window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
            btnTracarRota.innerHTML = '<span class="btn-icon">📍</span> Traçar Rota para UBS Próxima';
          },
          { timeout: 10000 }
        );
      } else {
        // Fallback para navegadores sem API de geolocalização
        window.open('https://www.google.com/maps/search/posto+de+saude+ubs+mais+proximo/', '_blank');
      }
    });
  }

});
