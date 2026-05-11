let usuarioActivo = localStorage.getItem("usuarioActivo");
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

let usuario = usuarios.find(u => u.usuario === usuarioActivo);

if (!usuario) {
    window.location.href = "login.html";
}

let ingresos = usuario.ingresos;
let gastos = usuario.gastos;
let metas = usuario.metas;

function mostrarSeccion(seccion) {
    document.querySelectorAll("main section").forEach(sec => {
        sec.style.display = "none";
    });

    const elemento = document.getElementById(seccion);
    if (elemento) elemento.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {

    cargarFiltros();
    actualizarTodo();

    const formIngreso = document.getElementById("formIngreso");
    if (formIngreso) {
        formIngreso.addEventListener("submit", function (e) {
            e.preventDefault();

            let fecha = document.getElementById("fechaIngreso").value;
            let monto = parseFloat(document.getElementById("montoIngreso").value);
            let concepto = document.getElementById("conceptoIngreso").value;

            if (!fecha || !concepto || isNaN(monto)) return;

            ingresos.push({ fecha, concepto, monto, tipo: "Ingreso" });

            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            actualizarTodo();
            this.reset();
        });
    }

    const formGasto = document.getElementById("formGasto");
    if (formGasto) {
        formGasto.addEventListener("submit", function (e) {
            e.preventDefault();

            let fecha = document.getElementById("fechaGasto").value;
            let monto = parseFloat(document.getElementById("montoGasto").value);
            let concepto = document.getElementById("conceptoGasto").value;

            if (!fecha || !concepto || isNaN(monto)) return;

            gastos.push({ fecha, concepto, monto, tipo: "Gasto" });

            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            actualizarTodo();
            this.reset();
        });
    }

    const formMeta = document.getElementById("formMeta");
    if (formMeta) {
        formMeta.addEventListener("submit", function (e) {
            e.preventDefault();

            let nombre = document.getElementById("nombreMeta").value;
            let monto = parseFloat(document.getElementById("montoMeta").value);

            if (!nombre || isNaN(monto)) return;

            metas.push({ nombre, monto });

            localStorage.setItem("usuarios", JSON.stringify(usuarios));

            actualizarTodo();
            this.reset();
        });
    }

    const filtroMes = document.getElementById("filtroMes");
    const filtroAnio = document.getElementById("filtroAnio");

    if (filtroMes && filtroAnio) {
        filtroMes.addEventListener("change", cargarMovimientos);
        filtroAnio.addEventListener("change", cargarMovimientos);
    }
});

function actualizarResumen() {
    let totalIng = ingresos.reduce((a,b) => a + b.monto, 0);
    let totalGas = gastos.reduce((a,b) => a + b.monto, 0);

    document.getElementById("totalIngresos").textContent = "$" + totalIng.toFixed(2);
    document.getElementById("totalGastos").textContent = "$" + totalGas.toFixed(2);
    document.getElementById("saldo").textContent = "$" + (totalIng - totalGas).toFixed(2);
}

function cargarMovimientos() {
    const tabla = document.getElementById("tablaMovimientos");
    if (!tabla) return;

    tabla.innerHTML = "";

    let todos = [...ingresos, ...gastos];
    todos.sort((a,b) => new Date(b.fecha) - new Date(a.fecha));

    todos.forEach(mov => {
        tabla.innerHTML += `
            <tr>
                <td>${mov.fecha}</td>
                <td>${mov.concepto}</td>
                <td>$${mov.monto.toFixed(2)}</td>
                <td>${mov.tipo}</td>
            </tr>
        `;
    });
}

function cargarFiltros() {
    let selectMes = document.getElementById("filtroMes");
    let selectAnio = document.getElementById("filtroAnio");

    if (!selectMes || !selectAnio) return;

    selectMes.innerHTML = "";
    selectAnio.innerHTML = "";

    for(let i=1; i<=12; i++){
        selectMes.innerHTML += `<option value="${i}">${i}</option>`;
    }

    let anioActual = new Date().getFullYear();
    for(let i=anioActual-5; i<=anioActual+1; i++){
        selectAnio.innerHTML += `<option value="${i}">${i}</option>`;
    }

    selectMes.value = new Date().getMonth()+1;
    selectAnio.value = anioActual;
}

function mostrarMetas() {

    let contMetas = document.getElementById("listaMetas");
    let contInicio = document.getElementById("listaMetasInicio");

    if (!contMetas) return;

    contMetas.innerHTML = "";
    if (contInicio) contInicio.innerHTML = "";

    metas.forEach((meta, index) => {

        let tarjeta = `
            <div class="meta-card">
                <strong>${meta.nombre}</strong><br>
                Objetivo: $${meta.monto.toFixed(2)}
                <br>
                <button class="btn-eliminar" onclick="eliminarMeta(${index})">
                    Eliminar
                </button>
            </div>
        `;

        contMetas.innerHTML += tarjeta;
        if (contInicio) contInicio.innerHTML += tarjeta;
    });
}

function eliminarMeta(index) {
    metas.splice(index, 1);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    actualizarTodo();
}

function actualizarTodo() {
    actualizarResumen();
    cargarMovimientos();
    mostrarMetas();
}