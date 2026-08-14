function initMobileMenu() {
    const toggle = document.getElementById('mobile-toggle');
    const menu = document.getElementById('main-nav');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        menu.classList.toggle('is-open');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('is-open');
        });
    });
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

function init() {
    initMobileMenu();
    initHeroCarousel();
    initAnimatedStats();
    initContactForm();
}

document.addEventListener('DOMContentLoaded', init);
