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

    const useScaleTransform = document.body.classList.contains('page-industrial');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        if (useScaleTransform) {
            bar.style.transform = `scaleX(${Math.min(Math.max(progress / 100, 0), 1)})`;
        } else {
            bar.style.width = `${progress}%`;
        }
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
    const fallbackLink = document.getElementById("wa-fallback-link");

    if (!formulario || !mensajeExito || !reenviarBtn) return;

    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const mensaje = document.getElementById("mensaje").value.trim();

        const formattedMessage = [
            "Hola S.I.E, solicito cotización de Manufactura Electrónica:",
            `- Nombre / Empresa: ${nombre}`,
            `- Correo Electrónico: ${email}`,
            `- Detalle de la consulta: ${mensaje}`
        ].join("\n");

        const waUrl = `https://wa.me/5493516723910?text=${encodeURIComponent(formattedMessage)}`;
        if (fallbackLink) {
            fallbackLink.href = waUrl;
        }

        window.open(waUrl, "_blank", "noopener,noreferrer");
        formulario.style.display = "none";
        mensajeExito.style.display = "block";
    });

    reenviarBtn.addEventListener("click", function () {
        mensajeExito.style.display = "none";
        formulario.style.display = "block";
    });
}

function initHeroShowcase() {
    const showcase = document.getElementById("hero-showcase");
    if (!showcase) return;

    const tabs = Array.from(showcase.querySelectorAll(".ci-showcase-tab"));
    const thumbs = Array.from(showcase.querySelectorAll(".ci-showcase-thumb"));
    const imgEl = document.getElementById("hero-showcase-img");
    const codeEl = document.getElementById("hero-family-code");
    const captionEl = document.getElementById("hero-showcase-caption");
    const specEl = document.getElementById("hero-showcase-spec");
    const ctaEl = document.getElementById("hero-showcase-cta");
    const archJumpLinks = document.querySelectorAll("[data-hero-jump]");

    if (!tabs.length || !imgEl) return;

    function selectFamily(familyKey) {
        const targetTab = tabs.find(t => t.getAttribute("data-family") === familyKey);
        if (!targetTab) return;

        tabs.forEach(t => {
            const active = t === targetTab;
            t.classList.toggle("is-active", active);
            t.setAttribute("aria-selected", active ? "true" : "false");
        });

        thumbs.forEach(th => {
            th.classList.toggle("is-active", th.getAttribute("data-family") === familyKey);
        });

        const imgSrc = targetTab.getAttribute("data-img");
        const imgAlt = targetTab.getAttribute("data-alt");
        const code = targetTab.getAttribute("data-code");
        const caption = targetTab.getAttribute("data-caption");
        const spec = targetTab.getAttribute("data-spec");
        const line = targetTab.getAttribute("data-line");
        const ctaText = targetTab.getAttribute("data-cta");

        if (imgSrc) imgEl.src = imgSrc;
        if (imgAlt) imgEl.alt = imgAlt;
        if (codeEl && code) codeEl.textContent = code;
        if (captionEl && caption) captionEl.textContent = caption;
        if (specEl && spec) specEl.textContent = spec;
        if (ctaEl) {
            if (line) ctaEl.setAttribute("data-select-line", line);
            if (ctaText) ctaEl.innerHTML = `${ctaText} <span aria-hidden="true">→</span>`;
        }
    }

    tabs.forEach((tab, idx) => {
        tab.addEventListener("click", () => {
            selectFamily(tab.getAttribute("data-family"));
        });

        tab.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const dir = e.key === "ArrowRight" ? 1 : -1;
                const next = (idx + dir + tabs.length) % tabs.length;
                tabs[next].focus();
                selectFamily(tabs[next].getAttribute("data-family"));
            }
        });
    });

    thumbs.forEach(thumb => {
        thumb.addEventListener("click", () => {
            selectFamily(thumb.getAttribute("data-family"));
        });
    });

    archJumpLinks.forEach(link => {
        link.addEventListener("mouseenter", () => {
            const fam = link.getAttribute("data-hero-jump");
            if (fam) selectFamily(fam);
        });
    });
}

function initCatalogVariantSwitchers() {
    const items = document.querySelectorAll(".ci-catalog-item");
    if (!items.length) return;

    items.forEach(item => {
        const img = item.querySelector(".ci-catalog-img");
        const tag = item.querySelector(".ci-port-tag");
        const btns = item.querySelectorAll(".ci-variant-btn");
        if (!img || !btns.length) return;

        btns.forEach(btn => {
            btn.addEventListener("click", () => {
                btns.forEach(b => {
                    const active = b === btn;
                    b.classList.toggle("is-active", active);
                    b.setAttribute("aria-pressed", active ? "true" : "false");
                });
                const nextImg = btn.getAttribute("data-img");
                const nextAlt = btn.getAttribute("data-alt");
                const nextCaption = btn.getAttribute("data-caption");
                if (nextImg) img.src = nextImg;
                if (nextAlt) img.alt = nextAlt;
                if (tag && nextCaption) tag.textContent = nextCaption;
            });
        });
    });
}

function initWholesaleForm() {
    const formulario = document.getElementById("formulario-mayorista");
    const mensajeExito = document.getElementById("ci-mensaje-exito");
    const reenviarBtn = document.getElementById("ci-reenviar-btn");
    const errorBox = document.getElementById("ci-form-error");
    const fallbackLink = document.getElementById("ci-wa-fallback-link");

    if (!formulario || !mensajeExito || !reenviarBtn) return;

    function clearFormError() {
        if (!errorBox) return;
        errorBox.textContent = "";
        errorBox.hidden = true;
    }

    function collectFormData() {
        const nombre = document.getElementById("ci-nombre").value.trim();
        const empresa = document.getElementById("ci-empresa").value.trim();
        const provincia = document.getElementById("ci-provincia").value;
        const email = document.getElementById("ci-email").value.trim();
        const telefono = document.getElementById("ci-telefono").value.trim();
        const linea = document.getElementById("ci-linea").value;
        const volumen = document.getElementById("ci-volumen").value;
        const modalidadEl = document.getElementById("ci-modalidad");
        const modalidad = modalidadEl ? modalidadEl.value : "";
        const detalle = document.getElementById("ci-mensaje").value.trim();
        const reqs = Array.from(formulario.querySelectorAll('input[name="req_planta"]:checked')).map(cb => cb.value);

        return { nombre, empresa, provincia, email, telefono, linea, volumen, modalidad, detalle, reqs };
    }

    formulario.addEventListener("submit", function (event) {
        event.preventDefault();
        clearFormError();

        const d = collectFormData();
        const lines = [
            "Hola S.I.E, solicito cotización mayorista de Computación Industrial:",
            `- Línea: ${d.linea}`,
            `- Volumen estimado: ${d.volumen}`
        ];
        if (d.modalidad) lines.push(`- Modalidad: ${d.modalidad}`);
        if (d.empresa) lines.push(`- Empresa / Distribuidora: ${d.empresa}`);
        if (d.nombre) lines.push(`- Contacto: ${d.nombre}`);
        if (d.provincia) lines.push(`- Provincia: ${d.provincia}`);
        if (d.telefono) lines.push(`- Teléfono / WhatsApp: ${d.telefono}`);
        if (d.email) lines.push(`- Correo: ${d.email}`);
        if (d.reqs.length) lines.push(`- Requerimientos de planta: ${d.reqs.join(", ")}`);
        if (d.detalle) lines.push(`- Detalle: ${d.detalle}`);

        const waUrl = `https://wa.me/5493516723910?text=${encodeURIComponent(lines.join("\n"))}`;
        if (fallbackLink) {
            fallbackLink.href = waUrl;
        }

        window.open(waUrl, "_blank", "noopener,noreferrer");
        formulario.hidden = true;
        mensajeExito.hidden = false;
    });

    reenviarBtn.addEventListener("click", function () {
        clearFormError();
        mensajeExito.hidden = true;
        formulario.hidden = false;
    });
}

function initCatalogLineLinks() {
    const lineSelect = document.getElementById("ci-linea");
    if (!lineSelect) return;

    document.addEventListener("click", (e) => {
        const trigger = e.target.closest("[data-select-line]");
        if (!trigger) return;
        const targetLine = trigger.getAttribute("data-select-line");
        if (targetLine) {
            lineSelect.value = targetLine;
        }
    });
}

function initScrollReveal() {
    // 1. Standalone section wrappers
    const generalTargets = document.querySelectorAll(
        '.section-title-wrap, .contact-lead-layout, .about-simple-grid, .map-box, .clarification-box, .tech-specs-wrap, .faq-accordion-wrap, .ci-reveal'
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        allTargets.forEach(el => el.classList.add('is-visible'));
        return;
    }

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
            const metaDescription = document.querySelector('meta[name="description"]');
            const shareData = {
                title: document.title || 'S.I.E | Servicios para la Industria Electrónica',
                text: metaDescription ? metaDescription.getAttribute('content') : 'S.I.E — Córdoba, Argentina.',
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
    initHeroShowcase();
    initCatalogVariantSwitchers();
    initAnimatedStats();
    initScrollReveal();
    initContactForm();
    initWholesaleForm();
    initCatalogLineLinks();
    initShareButton();
}

document.addEventListener('DOMContentLoaded', init);

