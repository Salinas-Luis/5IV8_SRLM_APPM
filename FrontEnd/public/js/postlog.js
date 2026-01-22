
const API_URL = "http://localhost:3000/api";
document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.rol !== 'alumno') {
        window.location.href = "login.html";
        return;
    }

    if (usuario.grupo_id) {
        cargarTareas(usuario.grupo_id);
    } else {
        document.getElementById("lista-tareas").innerHTML = "<p>Aún no estás asignado a un grupo.</p>";
    }
});

function interpretarDatosBatiz(nombreGrupo, semestre) {
    if (!nombreGrupo) return { carrera: "No asignada", turno: "N/A" };
    
    const turno = nombreGrupo.includes('IM') ? 'Matutino' : 'Vespertino';
    const ultimoDigito = parseInt(nombreGrupo.slice(-1));
    
    let carrera = "";
    if (semestre <= 2) {
        carrera = "Tronco Común";
    } else {
        if (ultimoDigito >= 1 && ultimoDigito <= 3) carrera = "Sistemas Digitales";
        else if (ultimoDigito >= 4 && ultimoDigito <= 6) carrera = "Mecatrónica";
        else if (ultimoDigito >= 7 && ultimoDigito <= 9) carrera = "Programación";
        else carrera = "Especialidad";
    }
    return { carrera, turno };
}

document.addEventListener("DOMContentLoaded", async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        window.location.href = "/";
        return;
    }

    const datos = interpretarDatosBatiz(usuario.nombre, usuario.semestre);

    document.getElementById("bienvenida-usuario").textContent = `Hola, ${usuario.nombre}`;
    
    document.getElementById("info-academica").textContent = `Semestre: ${usuario.semestre}° `;

});



async function cargarTareas(grupoId) {
    const listaTareas = document.getElementById("lista-tareas");
    
    if (!listaTareas) return;

    try {
        listaTareas.innerHTML = '<p class="loading">Cargando tareas...</p>';

        const response = await fetch(`${API_URL}/tareas/grupo/${grupoId}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error interno del servidor (500)");
        }

        const tareas = await response.json();

        if (tareas.length === 0) {
            listaTareas.innerHTML = `
                <div class="no-tareas">
                    <p>No hay tareas pendientes para el grupo ${grupoId}.</p>
                </div>`;
            return;
        }

listaTareas.innerHTML = tareas.map(tarea => {
    const botonHTML = tarea.ya_entregada 
        ? `<button disabled style="background: #27ae60; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: default; margin-top: 10px;">✅ Completada</button>`
        : `<button onclick="prepararEntrega(${tarea.id})" 
                style="background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                Entregar Tarea
           </button>`;

    return `
        <div class="tarea-card" style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px;">
            <h3 style="color: #2c3e50; margin-top: 0;">${tarea.titulo}</h3>
            <p><strong>Descripción:</strong> ${tarea.descripcion || 'Sin descripción disponible.'}</p>
            <div class="detalles" style="font-size: 0.9em; color: #7f8c8d;">
                <p><strong>Materia:</strong> ${tarea.materia?.nombre_materia || 'Asignatura general'}</p>
                <p><strong>Profesor:</strong> ${tarea.profesor?.nombre_completo || 'Docente asignado'}</p>
                <p><strong>Fecha de entrega:</strong> ${new Date(tarea.fecha_entrega).toLocaleDateString()}</p>
            </div>
            ${botonHTML} 
        </div>
        `;
    }).join('');

    } catch (error) {
        console.error("Error al cargar tareas:", error);
        listaTareas.innerHTML = `
            <div class="error-container" style="color: red; padding: 20px; text-align: center;">
                <p>No se pudieron cargar las tareas.</p>
                <small>${error.message}</small>
            </div>`;
    }
}

window.prepararEntrega = function(tareaId) {
    console.log("Iniciando entrega visual para la tarea:", tareaId);

    Swal.fire({
        title: 'Preparar entrega',
        text: `¿Deseas marcar como entregada la tarea #${tareaId}?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, entregar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const boton = document.querySelector(`button[onclick="prepararEntrega(${tareaId})"]`);

            if (boton) {
                boton.innerHTML = "Completada";
                boton.style.background = "#27ae60"; 
                boton.style.cursor = "default";
                boton.disabled = true; 
                boton.removeAttribute("onclick")
            }

            Swal.fire(
                '¡Completado!',
                'La tarea se ha marcado como entregada visualmente.',
                'success'
            );
        }
    });
};

window.cerrarSesion = function() {
    localStorage.removeItem("usuario");
    window.location.href = "/"; 
};