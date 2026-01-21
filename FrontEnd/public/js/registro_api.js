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
    const togglePassword = document.querySelector('#togglePassword');
    const passwordInput = document.querySelector('#passreg');
    
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

async function enviarRegistro() {
    const datos = {
        nombre_completo: document.getElementById("nombrereg").value.trim(),
        username: document.getElementById("userreg").value.trim(),
        email: document.getElementById("correoreg").value.trim(),
        password: document.getElementById("passreg").value,
        rol: document.getElementById("rolreg").value,
        carrera_id: parseInt(document.getElementById("carrerareg").value),
        grupo_id: parseInt(document.getElementById("gruporeg").value),
        semestre: parseInt(document.getElementById("semestrereg").value) 
    };

    if (Object.values(datos).some(v => v === "" || v === null || (typeof v === 'number' && isNaN(v)))) {
        Swal.fire({ title: "Atención", text: "Todos los campos, incluyendo el semestre, son obligatorios", icon: "warning" });
        return;
    }

    try {
        const response = await fetch(`${API_URL}/usuarios/registrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const resData = await response.json();
        if (response.ok) {
            Swal.fire({ title: "¡Éxito!", text: "Registro completado", icon: "success" })
                .then(() => window.location.href = "/login");
        } else {
            Swal.fire({ title: "Error", text: resData.error || "Error al registrar", icon: "error" });
        }
    } catch (error) {
        Swal.fire({ title: "Error de conexión", icon: "error" });
    }
}