
const API_URL = "http://localhost:3000/api";
function regresarAlPerfil() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        window.location.href = "/"; 
        return;
    }

    if (usuario.rol === 'profesor') {
        window.location.href = "/perfil_profesor"; 
    } else if (usuario.rol === 'alumno') {
        window.location.href = "/perfil_alumno";
    }

}