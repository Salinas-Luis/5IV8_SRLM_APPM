
const API_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || (usuario.rol !== 'profesor' && usuario.rol !== 'alumno')) {
        window.location.href = "/";
        return;
    }
    if (usuario) {
        document.getElementById("edit-nombre").value = usuario.nombre || "";
        document.getElementById("edit-correo").value = usuario.correo || "";
    }
});

function resetearCampos() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario) {
        document.getElementById("edit-nombre").value = usuario.nombre;
        document.getElementById("edit-correo").value = usuario.correo;
        
        Swal.fire({
            title: "Campos restablecidos",
            icon: "info",
            timer: 1500,
            showConfirmButton: false
        });
    }
}
async function guardarCambios() {
    const usuarioActual = JSON.parse(localStorage.getItem("usuario"));
    const nuevoNombre = document.getElementById("edit-nombre").value.trim();
    const nuevoCorreo = document.getElementById("edit-correo").value.trim();

    if (!nuevoNombre || !nuevoCorreo) {
        return Swal.fire("Atención", "No puedes dejar campos vacíos", "warning");
    }

    const datosActualizados = {
        id: usuarioActual.id, 
        nombre: nuevoNombre,
        correo: nuevoCorreo
    };
    console.log(usuarioActual.id)

    try {
        Swal.showLoading(); 

        const response = await fetch(`${API_URL}/usuarios/actualizar`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(datosActualizados)
        });

        const resData = await response.json();

        if (response.ok) {
            usuarioActual.nombre_completo = nuevoNombre;
            usuarioActual.email = nuevoCorreo;
            localStorage.setItem("usuario", JSON.stringify(usuarioActual));

            Swal.fire({
                title: "¡Perfil Actualizado!",
                text: "Tus cambios se guardaron correctamente",
                icon: "success",
                confirmButtonColor: "#10b981" 
            });
        } else {
            Swal.fire("Error", resData.error || "No se pudo actualizar el perfil", "error");
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        Swal.fire("Error de Conexión", "No se pudo establecer contacto con el servidor", "error");
    }
}


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