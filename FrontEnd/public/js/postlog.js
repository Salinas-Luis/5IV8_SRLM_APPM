
const API_URL = "http://localhost:3000/api";
document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario || usuario.rol !== 'alumno') {
        window.location.href = "/";
        return;
    }

    if (usuario.grupo_id) {
        cargarTareas(usuario.grupo_id);
    } else {
        document.getElementById("lista-tareas").innerHTML = "<p>Aún no estás asignado a un grupo.</p>";
    }
    cargarMaterias(usuario.id);
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

async function cargarMaterias(usuario_id) {
    const contenedor = document.getElementById("contenedor-materias");
    
    try {
        const resp = await fetch(`/api/materias/mis-materias?usuario_id=${usuario_id}`);
        const materias = await resp.json();

        if (!resp.ok) throw new Error(materias.error);

        contenedor.innerHTML = ""; 
        materias.forEach(m => {
            const div = document.createElement("div");
            div.className = "materia-card-alumno"; 
            div.innerHTML = `
                <div class="materia-info">
                    <span class="materia-titulo">${m.nombre_materia}</span>
                </div>
                <div class="notas-display">
                    <div class="nota-item"><span>P1:</span> ${m.p1}</div>
                    <div class="nota-item"><span>P2:</span> ${m.p2}</div>
                    <div class="nota-item"><span>P3:</span> ${m.p3}</div>
                </div>`;
            contenedor.appendChild(div);
        });
    } catch (err) {
        console.error(err);
    }
}

window.cerrarSesion = function() {
    localStorage.removeItem("usuario");
    window.location.href = "/"; 
};
