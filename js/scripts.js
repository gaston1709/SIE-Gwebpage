function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('main-nav');
    if (!toggle || !menu) return;

    function closeMenu() {
        menu.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.toggle('is-open');
        toggle.classList.toggle('is-active', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) {
            closeMenu();
        }
    });
}

function initReadingProgressBar() {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        bar.style.width = `${progress}%`;
    }, { passive: true });
}

function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-bg-media img');
    if (slides.length < 2) return;

    let currentIndex = 0;
    setInterval(() => {
        slides[currentIndex].classList.remove('is-active');
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add('is-active');
    }, 5000);
}

function initAnimatedStats() {
    const statElements = document.querySelectorAll('.stat-num[data-target]');
    if (!statElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                const duration = 3000;
                const startTime = performance.now();

                function updateCount(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeOutQuart for smooth industrial feel
                    const ease = 1 - Math.pow(1 - progress, 4);
                    const current = Math.floor(ease * target);

                    el.textContent = `${prefix}${current}${suffix}`;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        el.textContent = `${prefix}${target}${suffix}`;
                        el.classList.add('stat-settled');
                    }
                }

                requestAnimationFrame(updateCount);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.35 });

    statElements.forEach(el => observer.observe(el));
}

function initContactForm() {
    const formulario = document.getElementById("formulario");
    const mensajeExito = document.getElementById("mensaje-exito");
    const reenviarBtn = document.getElementById("reenviar-btn");

    if (!formulario || !mensajeExito || !reenviarBtn) return;

    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        const submitBtn = formulario.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerText : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = 'Enviando...';
        }

        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const mensaje = document.getElementById("mensaje").value;

        emailjs.send("service_s0cjykb", "template_merzek2", {
            name: nombre,
            email: email,
            message: mensaje
        })
        .then(response => {
            console.log("ÉXITO!", response.status, response.text);
            formulario.style.display = "none";
            mensajeExito.style.display = "block";
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }
        })
        .catch(error => {
            console.error("ERROR...", error);
            alert("Hubo un error al enviar el correo. Por favor comunicate directamente por WhatsApp al +54 9 351 672-3910.");
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = originalText;
            }
        });
    });

    reenviarBtn.addEventListener("click", function () {
        mensajeExito.style.display = "none";
        formulario.style.display = "block";
        formulario.reset();
    });
}

function initScrollReveal() {
    // 1. Standalone section wrappers
    const generalTargets = document.querySelectorAll(
        '.section-title-wrap, .contact-lead-layout, .about-simple-grid, .map-box, .clarification-box, .tech-specs-wrap, .faq-accordion-wrap'
    );
    generalTargets.forEach(el => el.classList.add('scroll-reveal'));

    // 2. Staggered Service Cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, idx) => {
        card.classList.add('scroll-reveal');
        card.style.setProperty('--reveal-delay', `${idx * 110}ms`);
    });

    // 3. Staggered Client Logos
    const logoItems = document.querySelectorAll('.logo-item');
    logoItems.forEach((logo, idx) => {
        logo.classList.add('scroll-reveal');
        logo.style.setProperty('--reveal-delay', `${idx * 65}ms`);
    });

    const allTargets = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    allTargets.forEach(el => observer.observe(el));
}

function initShareButton() {
    const shareBtns = document.querySelectorAll('.btn-share-trigger');
    if (!shareBtns.length) return;

    function showShareToast(message) {
        let toast = document.getElementById('share-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'share-toast';
            toast.className = 'share-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('is-visible');
        setTimeout(() => {
            toast.classList.remove('is-visible');
        }, 2800);
    }

    function copyUrlToClipboard() {
        const url = window.location.origin + window.location.pathname;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(() => {
                showShareToast('¡Enlace copiado al portapapeles!');
            }).catch(() => {
                showShareToast('Enlace: ' + url);
            });
        } else {
            showShareToast('Enlace: ' + url);
        }
    }

    shareBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const shareData = {
                title: 'S.I.E | Montaje y Manufactura Electrónica en Argentina',
                text: 'Soluciones de ensamble de placas SMT/THT, sourcing de componentes y testing en Córdoba, Argentina.',
                url: window.location.origin + window.location.pathname
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        copyUrlToClipboard();
                    }
                }
            } else {
                copyUrlToClipboard();
            }
        });
    });
}

function init() {
    initMobileMenu();
    initReadingProgressBar();
    initHeroCarousel();
    initAnimatedStats();
    initScrollReveal();
    initContactForm();
    initShareButton();
}

document.addEventListener('DOMContentLoaded', init);

