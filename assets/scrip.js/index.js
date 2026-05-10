

document.addEventListener("DOMContentLoaded", function () {

    const modal = document.getElementById("modal-info");
    const btnConocerMas = document.querySelector(".btn-secundario");
    const btnCerrarModal = document.querySelector(".cerrar");
    const botonesComenzar = document.querySelectorAll(".btn-principal");
    const linkIniciarSesion = document.querySelector(".nav a:last-child");

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

    botonesComenzar.forEach(function (boton) {
        boton.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.href = "login.html";
        });
    });

    linkIniciarSesion.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "login.html";
    });

document.addEventListener("DOMContentLoaded", function () {

    const cerrarSoporte = document.getElementById("cerrar-soporte");
    const recuadroSoporte = document.querySelector(".recuadro-soporte");

    if (cerrarSoporte) {
        cerrarSoporte.addEventListener("click", function () {
            recuadroSoporte.style.display = "none";
        });
    }

});
});