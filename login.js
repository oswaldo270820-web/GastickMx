document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let usuario = document.getElementById("usuario").value.trim();
    let password = document.getElementById("password").value.trim();
    let mensaje = document.getElementById("mensaje");

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let encontrado = usuarios.find(u => 
        u.usuario === usuario && u.password === password
    );

    if (encontrado) {

        localStorage.setItem("usuarioActivo", usuario);

        mensaje.style.color = "green";
        mensaje.textContent = "Acceso concedido...";

        setTimeout(function() {
            window.location.href = "dashboard.html";
        }, 1000);

    } else {
        mensaje.style.color = "red";
        mensaje.textContent = "Usuario o contraseña incorrectos";
    }
});