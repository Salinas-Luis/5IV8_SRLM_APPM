const API_URL = "http://localhost:3000/api";

function validaru(e) {
    const teclado = e.keyCode || e.which;
    if (teclado === 8) return true;
    const codigo = String.fromCharCode(teclado);
    const regex = /^[a-zA-Z0-9_\.]$/;
    if (!regex.test(codigo)) return false;
    if (e.target.value.length >= 16) return false;
    return true;
}

function validarc(e) {
    const teclado = e.keyCode || e.which;
    if (teclado === 8 || teclado === 0) return true;
    if (e.target.value.length >= 12) return false;
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    cargarGruposRegistro(); 

    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#passreg');
    const semestreSelect = document.getElementById("semestrereg");
    
    if (semestreSelect) {
        semestreSelect.addEventListener('change', gestionarCarrera);
    }

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    const btnReg = document.getElementById("btnRegistrar");
    if(btnReg) btnReg.addEventListener("click", enviarRegistro);
});

async function cargarGruposRegistro() {
    const grupoSelect = document.getElementById("gruporeg"); 
    if (!grupoSelect) return;

    try {
        const resp = await fetch(`${API_URL}/grupos`); 
        const grupos = await resp.json();

        if (resp.ok) {
            grupoSelect.innerHTML = '<option value="">Selecciona tu grupo</option>';
            grupos.forEach(grupo => {
                const option = document.createElement("option");
                option.value = grupo.id_grupo; 
                option.textContent = grupo.nombre; 
                grupoSelect.appendChild(option);
            });
        } else {
            console.error("Error al obtener grupos:", grupos.error);
        }
    } catch (err) {
        console.error("Error de conexión al cargar grupos:", err);
    }
}

async function enviarRegistro() {
    const elNombre = document.getElementById("nombrereg");
    const elUser = document.getElementById("userreg");
    const elCorreo = document.getElementById("correoreg");
    const elPass = document.getElementById("passreg");
    const elRol = document.getElementById("rolreg");
    const elCarrera = document.getElementById("carrerareg");
    const elGrupo = document.getElementById("gruporeg");
    const elSemestre = document.getElementById("semestrereg");

    const datos = {
        nombre_completo: elNombre.value.trim(),
        username: elUser.value.trim(),
        email: elCorreo.value.trim(),
        password: elPass.value,
        rol: elRol.value,
        carrera_id: parseInt(elCarrera.value),
        grupo_id: parseInt(elGrupo.value),
        semestre: parseInt(elSemestre.value)
    };

    const camposVacios = Object.values(datos).some(v => v === "" || v === null);
    const numerosInvalidos = [datos.carrera_id, datos.grupo_id, datos.semestre].some(n => isNaN(n));

    if (camposVacios || numerosInvalidos) {
        return Swal.fire("Atención", "Todos los campos son obligatorios", "warning");
    }

    const regexNombre = /^[a-zA-ZÀ-ÿ\s]{3,40}$/;
    if (!regexNombre.test(datos.nombre_completo)) {
        return Swal.fire("Nombre inválido", "Ingresa un nombre real (mín. 3 caracteres)", "warning");
    }

    const regexUser = /^[a-zA-Z0-9_]{8,16}$/;
    if (!regexUser.test(datos.username)) {
        return Swal.fire("Usuario inválido", "El usuario debe tener entre 8 y 16 caracteres", "warning");
    }

    if (datos.semestre >= 3 && datos.carrera_id === 1) {
        return Swal.fire("Atención", "A partir de 3er semestre selecciona una carrera técnica", "warning");
    }

    console.log("=== ENVIANDO DATOS VALIDADOS ===");
    console.table(datos);

    try {
        const response = await fetch(`${API_URL}/usuarios/registrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const resData = await response.json();

        if (response.ok) {
            Swal.fire("¡Éxito!", "Registro completado", "success")
                .then(() => window.location.href = "/login");
        } else {
            Swal.fire("Error de registro", resData.error || "Datos incompatibles", "error");
        }
    } catch (error) {
        Swal.fire("Error", "No hay conexión con el servidor", "error");
    }
}

function gestionarCarrera() {
    const semestre = parseInt(document.getElementById("semestrereg").value);
    const selectorCarrera = document.getElementById("carrerareg");

    if (semestre >= 3) {
        selectorCarrera.disabled = false;
        if (selectorCarrera.value === "1") {
            selectorCarrera.value = ""; 
        }
    } else {
        selectorCarrera.value = "1";
        selectorCarrera.disabled = true;
    }
}

