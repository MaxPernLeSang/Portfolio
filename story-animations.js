document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger, TextPlugin);

    // ============================================================
    // UNIVERSAL PIN → REVEAL → HIDE SEQUENCE
    // Each section pins itself. The background and text content
    // fade in as you scroll in, and fade out as you scroll out.
    // ============================================================
    
    const allPanels = document.querySelectorAll('.panel');
    
    allPanels.forEach((section) => {
        // S3 Custom Logic in DOM order
        if (section.id === 'endurance') {
            const tlEndurance = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: '+=400%', // 4 fois la hauteur de l'écran pour la séquence complète
                    scrub: 1,
                    pin: true,
                    pinSpacing: true
                }
            });

            // Filtres de base
            gsap.set('.endurance-bg-1', { filter: 'blur(0px) brightness(0.4)' });
            gsap.set('.endurance-bg-2', { xPercent: -50, yPercent: -50, top: '50%', left: '50%', scale: 0.8 });
            gsap.set('.endurance-text-1', { y: 60 });
            gsap.set('.endurance-text-2', { y: 60 });

            tlEndurance
                // PHASE 1
                .to('.endurance-bg-1', { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' }, 0)
                .to('.endurance-text-1', { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0.05)
                .to('.progress-bar-container', { opacity: 1, duration: 0.1 }, 0.05)
                .fromTo('.progress-bar', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none' }, 0)
                // PHASE 2
                .to('.endurance-bg-1', { filter: 'blur(25px) brightness(0.15)', duration: 0.2 }, 0.35)
                .to('.endurance-text-1', { filter: 'blur(8px)', opacity: 0.25, scale: 0.95, duration: 0.2 }, 0.35)
                .to('.progress-bar-container', { opacity: 0, duration: 0.15 }, 0.35)
                // PHASE 3
                .fromTo('.endurance-bg-2', 
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, duration: 0.15, ease: 'power2.out' }, 
                    0.45
                )
                // PHASE 4
                .to('.circle-rouge', { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(1.5)' }, 0.65)
                .to('.endurance-text-2', { opacity: 1, y: 0, duration: 0.15, ease: 'power2.out' }, 0.65)
                // PHASE 5
                .to(['.endurance-bg-2', '.circle-rouge', '.progress-bar-container', '.endurance-bg-1', '.endurance-text-1'], { opacity: 0, scale: 0.95, duration: 0.15, ease: 'power2.in' }, 0.85)
                .to('.endurance-text-2', { opacity: 0, y: -60, duration: 0.15, ease: 'power2.in' }, 0.85);
            
            return; // Skip universal logic for S3
        }

        // Apply universal sequence only to sections with data-story
        if (!section.hasAttribute('data-story')) return;

        const bg = section.querySelector('.story-bg');
        const textEl = section.querySelector('.story-text-el');
        const isFramed = bg && bg.classList.contains('bg-image') && !bg.classList.contains('fullscreen');
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '+=200%',
                scrub: 1,
                pin: true,
                pinSpacing: true
            }
        });

        if (bg) {
            if (isFramed) {
                gsap.set(bg, { opacity: 0, scale: 1.08, xPercent: -50, yPercent: -50, top: '50%', left: '50%' });
                tl.to(bg, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, 0);
                tl.to(bg, { opacity: 0, scale: 0.95, duration: 0.4, ease: 'power2.in' }, 0.6);
            } else {
                tl.fromTo(bg, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, 0);
                tl.to(bg, { opacity: 0, scale: 0.95, duration: 0.4, ease: 'power2.in' }, 0.6);
            }
        }

        if (textEl) {
            tl.fromTo(textEl, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.1);
            tl.to(textEl, { opacity: 0, y: -60, duration: 0.4, ease: 'power2.in' }, 0.6);
        }

        const progContainer = section.querySelector('.progress-bar-container');
        if (progContainer) {
            tl.fromTo(progContainer, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.2);
            tl.to(progContainer, { opacity: 0, duration: 0.4, ease: 'power2.in' }, 0.6);
        }
    });


    // ============================================================
    // SECTION-SPECIFIC EXTRA ANIMATIONS
    // These layer on top of the universal reveal above.
    // ============================================================

    // S1 – GPS Grid scale pulse
    ScrollTrigger.create({
        trigger: '#origine',
        start: 'top top',
        end: '+=100%',
        scrub: 1,
        onUpdate: (self) => {
            const p = self.progress;
            const pulse = p < 0.5 ? p * 2 : 1 - (p - 0.5) * 2;
            gsap.set('.bg-grid', { scale: 1 + pulse * 0.1 });
        }
    });

    // S2 – Split wipe (computer/nature)
    ScrollTrigger.create({
        trigger: '#dual-core',
        start: 'top top',
        end: '+=100%',
        scrub: 1,
        onUpdate: (self) => {
            const clip = `inset(0 ${self.progress * 50}% 0 0)`;
            gsap.set('.computer-half', { clipPath: clip });
        }
    });


    // S4 – Inverse parallax
    ScrollTrigger.create({
        trigger: '#route',
        start: 'top top',
        end: '+=200%',
        scrub: 1,
        onUpdate: (self) => {
            gsap.set('.bg-parallax', { yPercent: -20 * self.progress });
        }
    });

    // S5 – Typing effect (fires once when section is fully entered)
    ScrollTrigger.create({
        trigger: '#technique',
        start: 'top 60%',
        onEnter: () => {
            gsap.to('.typing-text', { duration: 2.5, text: "Baccalauréat en création numérique à l'UQAT.", ease: 'none' });
        }
    });

    // S6 – unblur background
    ScrollTrigger.create({
        trigger: '#spufad',
        start: 'top top',
        end: '+=100%',
        scrub: 1,
        onUpdate: (self) => {
            const blur = 30 * (1 - Math.min(self.progress * 2, 1));
            gsap.set('.bg-blur-spufad', { filter: `blur(${blur}px) brightness(0.6)` });
        }
    });

    // Section 7 : L'Innovation
    // The outer <section id="innovation"> is 500vh tall and uses position:sticky.
    // GSAP scrubs the animation over the full 500vh of scroll distance.
    const tl7 = gsap.timeline({
        scrollTrigger: {
            trigger: '#innovation',
            start: 'top top',
            end: 'bottom bottom', // Spans the full 500vh of the outer section
            scrub: 1
            // No pin here — CSS position:sticky handles that
        }
    });

    tl7
        // Phase 1: model drops (davinci-model.js). No empty pause.
        .to({}, { duration: 0.1 })
        
        // Phase 2: DaVinci! logo drops in from above at the top
        .fromTo('#davinci-logo',
            { opacity: 0, y: -40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }
        )
        
        // Phase 3: title fades in right behind the logo
        .fromTo('.davinci-title-container', 
            { opacity: 0, y: 40 }, 
            { opacity: 1, y: 0, duration: 0.8 }, 
            "-=0.4" // Start slightly before the logo finishes its bounce
        )
        
        // Phase 4: THE COOLDOWN — Pause where EVERYTHING stays visible (model, logo, title)
        .to({}, { duration: 0.2 })
        
        // Phase 5: logo + title + canvas fade out, video fades in
        .to(['#davinci-logo', '.davinci-title-container', '#canvas-container'], { opacity: 0, duration: 0.6 })
        .fromTo('.davinci-video',
            { opacity: 0, scale: 0.85, y: 60 },
            { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '<0.2'
        );


    // S8 – Mask reveal (circle clip-path)
    ScrollTrigger.create({
        trigger: '#regard',
        start: 'top top',
        end: '+=100%',
        scrub: 1,
        onUpdate: (self) => {
            // Reveal in first half, hold in second
            const pct = Math.min(self.progress * 2 * 100, 100);
            gsap.set('.bg-mask', { clipPath: `circle(${pct}% at 50% 50%)` });
        }
    });

    // S10 – Staggered word fade-in
    const difText = document.getElementById("staggerTxt");
    if (difText) {
        const words = difText.innerText.split(" ");
        difText.innerHTML = "";
        words.forEach(w => { difText.innerHTML += `<span class='stagger-word'>${w}</span> `; });
        gsap.set('.stagger-word', { opacity: 0 });
        ScrollTrigger.create({
            trigger: '#diffusion',
            start: 'top 60%',
            onEnter: () => { gsap.to('.stagger-word', { opacity: 1, stagger: 0.12, duration: 0.8 }); }
        });
    }
    // Neon pulse loop
    gsap.to('.bg-neon-flashes', { opacity: 0.7, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut',
        scrollTrigger: { trigger: '#diffusion', start: 'top center', toggleActions: 'play pause resume pause' }
    });

    // S12 – Sticky pin video
    gsap.fromTo('.bg-video-full', { opacity: 0, scale: 1.2 }, { opacity: 0.5, scale: 1, duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: '#role', start: 'top 80%', toggleActions: 'play none none reverse' }
    });
    ScrollTrigger.create({ trigger: '#role', start: 'top top', end: '+=100%', pin: '.pinning-content', pinSpacing: true });
});
