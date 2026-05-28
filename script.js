// Birthday website for Saskia — cinematic interactions, particles, music, and reveals.
document.body.classList.add('is-loading');

gsap.registerPlugin(ScrollTrigger);

const state = {
    backgroundAudio: null,
    favoriteAudio: null,
    isBackgroundPlaying: false,
    isFavoritePlaying: false,
    typingStarted: false
};

const typedText = `Selamat ulang tahun, Saskia.

Di hari yang istimewa ini, aku berharap kamu bisa melihat dirimu seperti bagaimana orang-orang yang menyayangimu melihatmu: berharga, lembut, kuat, dan sangat pantas menerima kebahagiaan yang indah.

Terima kasih karena sudah hadir dengan caramu yang sederhana namun berarti. Semoga setiap doa yang kamu simpan diam-diam menemukan jalannya, semoga setiap lelahmu diganti dengan peluk hangat dari semesta, dan semoga tahun baru dalam hidupmu membawa lebih banyak tawa, cinta, dan ketenangan.

Hari ini bukan hanya tentang bertambah usia. Hari ini tentang merayakan kamu — Saskia yang manis, Saskia yang kuat, Saskia yang selalu punya tempat spesial di hati.`;

// Loading screen animation.
function initLoader() {
    const loader = document.querySelector('#loader');
    const bar = document.querySelector('#loader-bar');
    const count = document.querySelector('#loader-count');

    const loaderTimeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
            gsap.to(loader, {
                autoAlpha: 0,
                duration: 0.9,
                ease: 'power2.inOut',
                onComplete: () => {
                    loader.remove();
                    document.body.classList.remove('is-loading');
                    gsap.to('#main-content', { opacity: 1, duration: 0.9, ease: 'power2.out' });
                    runHeroIntro();
                    startAudio();
                }
            });
        }
    });

    loaderTimeline
        .to(bar, { width: '100%', duration: 2.15, ease: 'power2.inOut' }, 0)
        .to({ value: 0 }, {
            value: 100,
            duration: 2.15,
            ease: 'power2.inOut',
            onUpdate() {
                count.textContent = Math.round(this.targets()[0].value);
            }
        }, 0)
        .to('.loader-orb', { scale: 1.18, opacity: 0.72, duration: 0.8, yoyo: true, repeat: 1 }, 0.35);
}

// Hero cinematic reveal.
function runHeroIntro() {
    gsap.from('#hero .reveal > *', {
        y: 36,
        opacity: 0,
        duration: 1.15,
        stagger: 0.16,
        ease: 'power3.out'
    });
}

// Smooth scroll reveal for every section.
function initReveals() {
    gsap.utils.toArray('.reveal').forEach((element) => {
        gsap.fromTo(element,
            { y: 58, opacity: 0, filter: 'blur(10px)' },
            {
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
                duration: 1.05,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 82%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });
}

// Romantic typing effect starts when the greeting card is visible.
function initTypingEffect() {
    ScrollTrigger.create({
        trigger: '#greeting',
        start: 'top 62%',
        once: true,
        onEnter: () => typeMessage()
    });
}

function typeMessage() {
    if (state.typingStarted) return;
    state.typingStarted = true;

    const target = document.querySelector('#typed-message');
    let index = 0;

    const type = () => {
        target.textContent = typedText.slice(0, index);
        index += 1;

        if (index <= typedText.length) {
            const character = typedText[index - 1];
            const delay = character === '\n' ? 130 : character === '.' ? 55 : 24;
            window.setTimeout(type, delay);
        }
    };

    type();
}

// Floating hearts for the entire page.
function createFloatingHearts() {
    const field = document.querySelector('#heart-field');
    const fragment = document.createDocumentFragment();
    const totalHearts = window.innerWidth < 768 ? 22 : 42;

    for (let i = 0; i < totalHearts; i += 1) {
        const heart = document.createElement('span');
        heart.className = 'float-heart';
        heart.textContent = Math.random() > 0.28 ? '♡' : '♥';
        heart.style.setProperty('--start-x', `${Math.random() * 100}vw`);
        heart.style.setProperty('--end-x', `${Math.random() * 100}vw`);
        heart.style.setProperty('--size', `${Math.random() * 1.15 + 0.65}rem`);
        heart.style.setProperty('--opacity', `${Math.random() * 0.46 + 0.16}`);
        heart.style.setProperty('--duration', `${Math.random() * 18 + 18}s`);
        heart.style.animationDelay = `${Math.random() * -28}s`;
        fragment.appendChild(heart);
    }

    field.appendChild(fragment);
}

// Heart rain becomes visible near the final emotional section.
function createHeartRain() {
    const rain = document.querySelector('#heart-rain');
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 36; i += 1) {
        const heart = document.createElement('span');
        heart.className = 'rain-heart';
        heart.textContent = '♥';
        heart.style.setProperty('--rain-x', `${Math.random() * 100}vw`);
        heart.style.setProperty('--rain-size', `${Math.random() * 1.1 + 0.55}rem`);
        heart.style.setProperty('--rain-duration', `${Math.random() * 8 + 7}s`);
        heart.style.animationDelay = `${Math.random() * -10}s`;
        fragment.appendChild(heart);
    }

    rain.appendChild(fragment);

    ScrollTrigger.create({
        trigger: '#final',
        start: 'top 70%',
        end: 'bottom top',
        onEnter: () => gsap.to(rain, { opacity: 1, duration: 1.1 }),
        onLeaveBack: () => gsap.to(rain, { opacity: 0, duration: 0.8 })
    });
}

// Lightweight star canvas for dreamy moving background.
function initStarCanvas() {
    const canvas = document.querySelector('#star-canvas');
    const context = canvas.getContext('2d');
    const stars = [];
    const starCount = window.innerWidth < 768 ? 70 : 130;
    let width = 0;
    let height = 0;

    function resize() {
        width = canvas.width = window.innerWidth * window.devicePixelRatio;
        height = canvas.height = window.innerHeight * window.devicePixelRatio;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
    }

    function seedStars() {
        stars.length = 0;
        for (let i = 0; i < starCount; i += 1) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.35,
                speed: Math.random() * 0.25 + 0.05,
                alpha: Math.random() * 0.72 + 0.2
            });
        }
    }

    function draw() {
        context.clearRect(0, 0, width, height);
        stars.forEach((star) => {
            star.y -= star.speed * window.devicePixelRatio;
            if (star.y < -8) star.y = height + 8;

            context.beginPath();
            context.arc(star.x, star.y, star.radius * window.devicePixelRatio, 0, Math.PI * 2);
            context.fillStyle = `rgba(255, 225, 236, ${star.alpha})`;
            context.shadowBlur = 12;
            context.shadowColor = 'rgba(255, 59, 125, .75)';
            context.fill();
        });
        requestAnimationFrame(draw);
    }

    resize();
    seedStars();
    draw();

    window.addEventListener('resize', () => {
        resize();
        seedStars();
    });
}

// Cursor glow follows mouse and enlarges on interactive elements.
function initCursorGlow() {
    const cursor = document.querySelector('#cursor-glow');
    const interactiveSelector = 'a, button, .gallery-card, .fact-card';

    window.addEventListener('pointermove', (event) => {
        gsap.to(cursor, { x: event.clientX, y: event.clientY, duration: 0.18, ease: 'power2.out' });
    });

    document.querySelectorAll(interactiveSelector).forEach((element) => {
        element.addEventListener('pointerenter', () => cursor.classList.add('is-hovering'));
        element.addEventListener('pointerleave', () => cursor.classList.remove('is-hovering'));
    });
}

// Magnetic hover for premium buttons.
function initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach((button) => {
        button.addEventListener('mousemove', (event) => {
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            gsap.to(button, { x: x * 0.18, y: y * 0.22, duration: 0.35, ease: 'power3.out' });
        });

        button.addEventListener('mouseleave', () => {
            gsap.to(button, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1, .45)' });
        });
    });
}

// Smooth scroll button.
function initMemoryButton() {
    document.querySelector('#open-memories').addEventListener('click', () => {
        document.querySelector('#greeting').scrollIntoView({ behavior: 'smooth' });
        startAudio();
    });
}

// Scroll progress indicator.
function initScrollProgress() {
    const progress = document.querySelector('#scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progress.style.width = `${percentage}%`;
    }, { passive: true });
}

// Gallery fullscreen modal with smooth animation.
function initGalleryModal() {
    const modal = document.querySelector('#gallery-modal');
    const modalImage = document.querySelector('#modal-img');
    const modalCaption = document.querySelector('#modal-caption');
    const closeButton = document.querySelector('#modal-close');

    function openModal(card) {
        const image = card.querySelector('img');
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalCaption.textContent = card.dataset.caption;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.classList.add('modal-open');
        gsap.fromTo(modal, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 });
        gsap.fromTo('.modal-panel', { scale: 0.92, y: 28, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' });
    }

    function closeModal() {
        gsap.to('.modal-panel', { scale: 0.96, y: 20, opacity: 0, duration: 0.28, ease: 'power2.in' });
        gsap.to(modal, {
            autoAlpha: 0,
            duration: 0.32,
            delay: 0.05,
            onComplete: () => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.classList.remove('modal-open');
            }
        });
    }

    document.querySelectorAll('.gallery-card').forEach((card) => {
        card.addEventListener('click', () => openModal(card));
    });

    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });
}

// Parallax accents on portrait and final text.
function initParallax() {
    gsap.to('.parallax-card', {
        yPercent: -7,
        ease: 'none',
        scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.1
        }
    });

    gsap.to('#final .reveal', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
            trigger: '#final',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        }
    });
}

// HTML audio tracks: opening music and favorite song.
function setupAudio() {
    const playButton = document.querySelector('#play-toggle');
    const replayButton = document.querySelector('#replay-music');

    state.backgroundAudio = document.querySelector('#background-audio');
    state.favoriteAudio = document.querySelector('#favorite-audio');

    if (state.backgroundAudio) state.backgroundAudio.volume = 0.36;
    if (state.favoriteAudio) state.favoriteAudio.volume = 0.76;

    playButton.addEventListener('click', toggleFavoriteAudio);
    replayButton.addEventListener('click', () => {
        startAudio(true);
        gsap.fromTo('#final .reveal', { scale: 0.97 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, .45)' });
    });

    if (state.favoriteAudio) {
        state.favoriteAudio.addEventListener('play', () => {
            stopBackgroundAudio();
            state.isFavoritePlaying = true;
            document.body.classList.add('audio-playing');
            updatePlayIcon(true);
        });

        state.favoriteAudio.addEventListener('pause', () => {
            state.isFavoritePlaying = false;
            document.body.classList.remove('audio-playing');
            updatePlayIcon(false);
        });

        state.favoriteAudio.addEventListener('ended', () => {
            state.isFavoritePlaying = false;
            document.body.classList.remove('audio-playing');
            updatePlayIcon(false);
            startAudio(true);
        });
    }

    window.addEventListener('pointerdown', () => {
        if (!state.isFavoritePlaying) startAudio();
    }, { once: true });
}

function startAudio(restart = false) {
    const audio = state.backgroundAudio;
    if (!audio || state.isFavoritePlaying) return;

    audio.volume = 0.36;
    if (restart) audio.currentTime = 0;

    const playPromise = audio.play();
    if (playPromise) {
        playPromise
            .then(() => {
                state.isBackgroundPlaying = true;
            })
            .catch(() => {
                state.isBackgroundPlaying = false;
            });
    } else {
        state.isBackgroundPlaying = true;
    }
}

function stopBackgroundAudio() {
    const audio = state.backgroundAudio;
    if (!audio) return;

    audio.pause();
    state.isBackgroundPlaying = false;
}

function playFavoriteAudio() {
    const audio = state.favoriteAudio;
    if (!audio) return;

    stopBackgroundAudio();
    audio.volume = 0.76;
    audio.currentTime = 0;

    const playPromise = audio.play();
    if (playPromise) {
        playPromise.catch(() => {
            state.isFavoritePlaying = false;
            updatePlayIcon(false);
            startAudio();
        });
    }
}

function stopFavoriteAudio() {
    const audio = state.favoriteAudio;
    if (!audio) return;

    audio.pause();
    state.isFavoritePlaying = false;
    document.body.classList.remove('audio-playing');
    updatePlayIcon(false);
    startAudio();
}

function toggleFavoriteAudio() {
    if (state.isFavoritePlaying) {
        stopFavoriteAudio();
    } else {
        playFavoriteAudio();
    }
}

function updatePlayIcon(isPlaying) {
    const button = document.querySelector('#play-toggle');
    button.innerHTML = `<i data-lucide="${isPlaying ? 'pause' : 'play'}" class="h-7 w-7"></i>`;
    lucide.createIcons();
}

// Decorative visualizer bars, synced to audio state through CSS and GSAP.
function initVisualizer() {
    const visualizer = document.querySelector('#visualizer');
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 34; i += 1) {
        const bar = document.createElement('span');
        bar.className = 'visual-bar';
        fragment.appendChild(bar);
    }

    visualizer.appendChild(fragment);

    gsap.to('.visual-bar', {
        scaleY: () => gsap.utils.random(0.28, 1.85),
        duration: () => gsap.utils.random(0.38, 0.86),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { each: 0.035, from: 'center' }
    });
}

// Gentle 3D card motion for gallery and fact cards.
function initHoverTilt() {
    document.querySelectorAll('.gallery-card, .fact-card, .glass-card').forEach((card) => {
        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 7;
            const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -7;
            gsap.to(card, { rotateX, rotateY, transformPerspective: 900, duration: 0.35, ease: 'power2.out' });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power3.out' });
        });
    });
}

// Local image placeholders fall back to remote demo images until real files are dropped in.
function initMediaFallbacks() {
    document.querySelectorAll('img[data-fallback-src]').forEach((image) => {
        const fallback = image.dataset.fallbackSrc;
        const useFallback = () => {
            if (fallback && image.src !== fallback) image.src = fallback;
        };

        image.addEventListener('error', useFallback, { once: true });
        if (image.complete && image.naturalWidth === 0) useFallback();
    });
}

// Bootstrap all interactions.
window.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initMediaFallbacks();
    setupAudio();
    initLoader();
    initReveals();
    initTypingEffect();
    initStarCanvas();
    createFloatingHearts();
    createHeartRain();
    initCursorGlow();
    initMagneticButtons();
    initMemoryButton();
    initScrollProgress();
    initGalleryModal();
    initParallax();
    initVisualizer();
    initHoverTilt();
});
