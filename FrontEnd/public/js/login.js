const API_URL = "http://localhost:3000/api";

function validarc(e) {
    var teclado = document.all ? e.keyCode : e.which;
    if (teclado === 8 || teclado === 0) return true; 

    var codigo = String.fromCharCode(teclado);
    var inputElement = e.target; 
    var valorActual = inputElement.value;
    var valorFuturo = valorActual + codigo;
    var regexCaracter = /[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/; 

    if (!regexCaracter.test(codigo)) return false; 
    if (codigo === ' ') return false;

    var caracteresEspeciales = "!@#$%^&*()_+-=[]{};':\"\\|,.<>/?"; 
    
    if (caracteresEspeciales.includes(codigo)) {
        if (valorActual.includes(codigo)) {
            Swal.fire({ title: "El carácter especial '" + codigo + "' solo se permite una vez.", icon: "warning" });
            return false; 
        }
    }
    if (valorFuturo.length > 16) {
        Swal.fire({ title: "La contraseña no puede exceder los 16 caracteres.", icon: "warning" });
        return false; 
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.querySelector('#togglePassword');
    const passwordField = document.querySelector('#loginpass');

    if (togglePassword && passwordField) {
        togglePassword.addEventListener('click', function () {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    const btnEntrar = document.getElementById("btnEntrar");
    if (btnEntrar) {
        btnEntrar.addEventListener("click", validars);
    }
});

async function validars() {
    const email = document.getElementById("logincu").value.trim();
    const password = document.getElementById("loginpass").value;

    if (email === "" || password === "") {
        return Swal.fire({
            title: "Atención",
            text: "Todos los campos son obligatorios",
            icon: "warning"
        });
    }

    try {
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const resData = await response.json();

        if (response.ok) {
            localStorage.setItem('usuario', JSON.stringify(resData.user));

            Swal.fire({
                title: "¡Bienvenido!",
                text: `Hola, ${resData.user.nombre}`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                const rol = resData.user.rol; 
                if (rol === 'profesor') {
                    window.location.href = "/perfil_profesor"; 
                } else if (rol === 'alumno') {
                    window.location.href = "/perfil_alumno"; 
                } 
            });
        } else {
            Swal.fire({
                title: "Error de acceso",
                text: resData.error || "Correo o contraseña incorrectos",
                icon: "error"
            });
        }
    } catch (error) {
        Swal.fire({
            title: "Error de conexión",
            text: "No se pudo conectar con el servidor",
            icon: "error"
        });
    }
}