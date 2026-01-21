document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.rol !== 'profesor') {
        window.location.href = "login.html";
        return;
    }

    cargarGruposDocente();

    const btnPublicar = document.getElementById("btnPublicarTarea");
    if(btnPublicar) btnPublicar.addEventListener("click", crearTarea);
});

async function crearTarea() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    
    const titulo = document.getElementById("tarea-titulo").value;
    const descripcion = document.getElementById("tarea-desc").value;
    const grupo_id = document.getElementById("tarea-grupo").value;
    const fecha = document.getElementById("tarea-fecha").value;

    if (!titulo || !grupo_id || !fecha) {
        return Swal.fire("Campos incompletos", "Por favor llena el título, el grupo y la fecha", "warning");
    }

    const datosTarea = {
        titulo: titulo,
        descripcion: descripcion,
        grupo_id: parseInt(grupo_id),
        autor_id: usuario.nombre_id,   
        fecha_entrega: fecha
    };

    try {
        const response = await fetch('http://localhost:3000/api/tareas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosTarea)
        });

        if (response.ok) {
            Swal.fire("¡Tarea Creada!", `La tarea se asignó al grupo correctamente`, "success");
            document.getElementById("tarea-titulo").value = "";
            document.getElementById("tarea-desc").value = "";
        } else {
            const error = await response.json();
            Swal.fire("Error", error.error || "No se pudo crear la tarea", "error");
        }
    } catch (err) {
        console.error("Error al publicar tarea:", err);
    }
}