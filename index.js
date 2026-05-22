document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       MODAL
    ========================== */

    const modal = document.getElementById("modal-info");

    const btnConocerMas =
        document.querySelector(".btn-secundario");

    const btnCerrarModal =
        document.querySelector(".cerrar");

    btnConocerMas.addEventListener("click", function (e) {

        e.preventDefault();

        modal.classList.add("mostrar");

    });

    btnCerrarModal.addEventListener("click", function (e) {

        e.preventDefault();

        modal.classList.remove("mostrar");

    });

    modal.addEventListener("click", function (e) {

        if (e.target === modal) {

            modal.classList.remove("mostrar");

        }

    });

    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape") {

            modal.classList.remove("mostrar");

        }

    });

    /* =========================
       BOTONES LOGIN
    ========================== */

    const botonesComenzar =
        document.querySelectorAll(".btn-principal");

    botonesComenzar.forEach(function (boton) {

        boton.addEventListener("click", function (e) {

            e.preventDefault();

            window.location.href = "login.html";

        });

    });

    const linkIniciarSesion =
        document.querySelector(".link-login");

    linkIniciarSesion.addEventListener("click", function (e) {

        e.preventDefault();

        window.location.href = "login.html";

    });

    /* =========================
       SOPORTE
    ========================== */

    const abrirSoporte =
        document.getElementById("abrir-soporte");

    const cerrarSoporte =
        document.getElementById("cerrar-soporte");

    const recuadroSoporte =
        document.getElementById("recuadro-soporte");

    cerrarSoporte.addEventListener("click", function () {

        recuadroSoporte.classList.add("oculto");

    });

    abrirSoporte.addEventListener("click", function () {

        recuadroSoporte.classList.remove("oculto");

    });

    let ultimoScroll = 0;
const barraNav = document.querySelector('.nav');
const umbralSubida = 15; 

window.addEventListener('scroll', () => {
    const scrollActual = window.pageYOffset || document.documentElement.scrollTop;


    if (scrollActual > ultimoScroll && scrollActual > 100) {
        barraNav.classList.add('nav-oculto');
    } 
    
    else if (ultimoScroll - scrollActual > umbralSubida) {
        barraNav.classList.remove('nav-oculto');
    }
    
    ultimoScroll = scrollActual <= 0 ? 0 : scrollActual; 
});


});