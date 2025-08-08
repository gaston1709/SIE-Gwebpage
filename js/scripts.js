
document.addEventListener('DOMContentLoaded', () => {
    const serviciosCarrusel = document.querySelector('.servicios .carrusel');
    const serviciosContainer = document.querySelector('.servicios .servicios-container');
    const prevButton = document.querySelector('.servicios .carrusel-control.prev');
    const nextButton = document.querySelector('.servicios .carrusel-control.next');
    
    let currentPosition = 0;
    
    function updateServicesCarousel() {
        const containerWidth = serviciosCarrusel.offsetWidth;
        const serviceWidth = serviciosContainer.querySelector('.servicio').offsetWidth + 30; // Ancho del servicio + gap
        const visibleServices = Math.floor(containerWidth / serviceWidth);
        const totalServices = serviciosContainer.querySelectorAll('.servicio').length;
        const maxPosition = totalServices - visibleServices;
        
        // Limita la posición actual
        currentPosition = Math.min(currentPosition, maxPosition);
        
        // Calcula el desplazamiento
        const translateX = -currentPosition * serviceWidth;
        serviciosContainer.style.transform = `translateX(${translateX}px)`;
        
        // Actualiza estado de los botones
        prevButton.disabled = currentPosition === 0;
        nextButton.disabled = currentPosition >= maxPosition;
    }
    
    function moveServicesCarousel(direction) {
        const containerWidth = serviciosCarrusel.offsetWidth;
        const serviceWidth = serviciosContainer.querySelector('.servicio').offsetWidth + 30;
        const visibleServices = Math.floor(containerWidth / serviceWidth);
        const totalServices = serviciosContainer.querySelectorAll('.servicio').length;
        const maxPosition = totalServices - visibleServices;
        
        if (direction === 'next' && currentPosition < maxPosition) {
            currentPosition++;
        } else if (direction === 'prev' && currentPosition > 0) {
            currentPosition--;
        }
        
        updateServicesCarousel();
    }
    
    // Event Listeners
    prevButton.addEventListener('click', () => moveServicesCarousel('prev'));
    nextButton.addEventListener('click', () => moveServicesCarousel('next'));
    
    // Resize listener
    window.addEventListener('resize', updateServicesCarousel);
    
    // Configuración inicial
    updateServicesCarousel();
});

emailjs.init({
  publicKey: "Mo9fROd6j8U4Cv3VF",
});

document.addEventListener("DOMContentLoaded", function () {
    const contactoBoton = document.querySelector(".navbar a[href='#contacto']");
    const contactoBotonHero = document.getElementById("contact-btn"); // Botón en el hero
    const formularioSeccion = document.getElementById("contacto"); // Sección correcta
    const formulario = document.getElementById("formulario");
    const mensajeExito = document.getElementById("mensaje-exito");
    const reenviarBtn = document.getElementById("reenviar-btn");

    // Mostrar el formulario al hacer clic en los botones de contacto
    function mostrarFormulario(event) {
        event.preventDefault();
        formularioSeccion.scrollIntoView({ behavior: "smooth" });
    }

    if (contactoBotonHero) contactoBotonHero.addEventListener("click", mostrarFormulario);
    if (contactoBoton) contactoBoton.addEventListener("click", mostrarFormulario);

    // Envío del formulario con EmailJS
    formulario.addEventListener("submit", function (event) {
        event.preventDefault();

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
        })
        .catch(error => {
            console.error("ERROR...", error);
            alert("Hubo un error al enviar el correo.");
        });
    });

    // Permitir reenviar el formulario
    reenviarBtn.addEventListener("click", function () {
        mensajeExito.style.display = "none";
        formulario.style.display = "block";
        formulario.reset();
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const carrusel = document.getElementById('carrusel');
    const prevButton = document.querySelector('.control.prev');
    const nextButton = document.querySelector('.control.next');
    
    // Configuración inicial
    let currentPosition = 0;
    const logos = document.querySelectorAll('.logo-cliente');
    const logoWidth = logos[0].offsetWidth + 30; // Ancho del logo + gap
    
    function updateCarousel() {
        // Calcula cuántos logos son visibles
        const containerWidth = carrusel.parentElement.offsetWidth;
        const visibleLogos = Math.floor(containerWidth / logoWidth);
        const maxPosition = logos.length - visibleLogos;
        
        // Limita la posición actual
        currentPosition = Math.min(currentPosition, maxPosition);
        
        // Calcula el desplazamiento
        const translateX = -currentPosition * logoWidth;
        carrusel.style.transform = `translateX(${translateX}px)`;
        
        // Actualiza estado de los botones
        prevButton.disabled = currentPosition === 0;
        nextButton.disabled = currentPosition >= maxPosition;
    }
    
    function moveCarousel(direction) {
        const containerWidth = carrusel.parentElement.offsetWidth;
        const visibleLogos = Math.floor(containerWidth / logoWidth);
        const maxPosition = logos.length - visibleLogos;
        
        if (direction === 'next' && currentPosition < maxPosition) {
            currentPosition++;
        } else if (direction === 'prev' && currentPosition > 0) {
            currentPosition--;
        }
        
        updateCarousel();
    }
    
    // Event Listeners
    prevButton.addEventListener('click', () => moveCarousel('prev'));
    nextButton.addEventListener('click', () => moveCarousel('next'));
    
    // Resize listener
    window.addEventListener('resize', updateCarousel);
    
    // Configuración inicial
    updateCarousel();
});

