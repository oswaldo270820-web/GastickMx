document.getElementById("registroForm").addEventListener("submit", function(e){
    e.preventDefault();

    let usuario = document.getElementById("nuevoUsuario").value.trim();
    let password = document.getElementById("nuevaPassword").value.trim();
    let mensaje = document.getElementById("mensajeRegistro");

    if(usuario === "" || password === ""){
        mensaje.className = "mensaje error";
        mensaje.textContent = "Completa todos los campos";
        return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let existe = usuarios.find(u => u.usuario === usuario);

    if(existe){
        mensaje.className = "mensaje error";
        mensaje.textContent = "El usuario ya existe";
        return;
    }

    usuarios.push({
        usuario: usuario,
        password: password,
        ingresos: [],
        gastos: [],
        metas: []
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mensaje.className = "mensaje exito";
    mensaje.textContent = "Cuenta creada correctamente";

    setTimeout(function(){
        window.location.href = "login.html";
    }, 1200);
});