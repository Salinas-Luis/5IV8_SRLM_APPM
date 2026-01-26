const API_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario || usuario.rol !== 'profesor') {
        window.location.href = "/";
        return;
    }

    const bienvenida = document.getElementById("bienvenida-usuario");
    const grupoSelect = document.getElementById("tarea-grupo");
    const materiaSelect = document.getElementById("tarea-materia");
    const btnPublicar = document.getElementById("btnPublicarTarea");

    if (bienvenida) bienvenida.textContent = `Hola, ${usuario.nombre}`;

    cargarGrupos(grupoSelect);

    if (grupoSelect) {
        grupoSelect.addEventListener("change", () => {
            const grupoId = grupoSelect.value;
            if (grupoId) {
                materiaSelect.disabled = false;
                cargarMateriasPorGrupo(grupoId, materiaSelect);
            } else {
                materiaSelect.disabled = true;
                materiaSelect.innerHTML = '<option value="">Selecciona primero un grupo</option>';
            }
        });
    }

    if (btnPublicar) {
        btnPublicar.onclick = publicarTarea; 
    }
    cargarMisTareas(usuario.id)
});


async function cargarGrupos(selectElement) {
    if (!selectElement) return;
    try {
        const resp = await fetch(`${API_URL}/grupos`);
        const grupos = await resp.json();
        
        if (resp.ok) {
            selectElement.innerHTML = '<option value="" disabled selected>Seleccionar Grupo</option>';
            grupos.forEach(g => {
                const opt = document.createElement("option");
                opt.value = g.id_grupo; 
                opt.textContent = g.nombre;
                selectElement.appendChild(opt);
            });
        }
    } catch (err) {
        console.error("Error al cargar grupos:", err);
    }
}

async function cargarMateriasPorGrupo(grupoId, selectElement) {
    if (!selectElement) return;

    try {
        selectElement.disabled = true;
        selectElement.innerHTML = '<option value="" disabled selected>Cargando materias...</option>';

        const resp = await fetch(`${API_URL}/materias/por-grupo?id_grupo=${grupoId}`);
        
        if (!resp.ok) throw new Error(`Error en el servidor: ${resp.status}`);

        const materias = await resp.json();

        selectElement.innerHTML = '<option value="" disabled selected>Seleccionar Materia</option>';
        
        if (materias.length === 0) {
            selectElement.innerHTML = '<option value="">No hay materias para este grupo</option>';
        } else {
            materias.forEach(m => {
                const opt = document.createElement("option");
                opt.value = m.id;
                opt.textContent = m.nombre_materia;
                selectElement.appendChild(opt);
            });
            selectElement.disabled = false;
        }
    } catch (err) {
        console.error("Error al filtrar materias:", err);
        selectElement.innerHTML = '<option value="">Error al cargar materias</option>';
    }
}

async function publicarTarea() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    
    const titulo = document.getElementById("tarea-titulo").value.trim();
    const descripcion = document.getElementById("tarea-desc").value.trim();
    const materia_id = document.getElementById("tarea-materia").value; 
    const grupo_id = document.getElementById("tarea-grupo").value;
    const fecha_entrega = document.getElementById("tarea-fecha").value;

    if (!titulo || !materia_id || !grupo_id || !fecha_entrega) {
        return Swal.fire("Campos incompletos", "Selecciona grupo, materia y fecha", "warning");
    }

    const datos = {
        titulo,
        descripcion,
        materia_id: parseInt(materia_id),
        grupo_id: parseInt(grupo_id),
        fecha_entrega,
        profesor_id: usuario.id,
        rol: usuario.rol
    };

    try {
        Swal.showLoading();
        const response = await fetch(`${API_URL}/tareas/crear`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const resData = await response.json();

        if (response.ok) {
            Swal.fire("¡Éxito!", "Tarea publicada correctamente", "success");
            document.getElementById("tarea-titulo").value = "";
            document.getElementById("tarea-desc").value = "";
        } else {
            Swal.fire("Error", resData.error || "No se pudo crear la tarea", "error");
        }
    } catch (error) {
        Swal.fire("Error", "No hay conexión con el servidor", "error");
    }
}

window.cerrarSesion = function() {
    localStorage.removeItem("usuario");
    window.location.href = "/"; 
};

async function cargarMisTareas() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const contenedor = document.getElementById("contenedor-tareas-profesor");

    const resp = await fetch(`/api/materias/tareas-profesor?autor_id=${usuario.id}`);
    const tareas = await resp.json();

    contenedor.innerHTML = tareas.map(t => `
        <div class="card mb-3 shadow-sm border-0" style="border-radius: 15px;">
            <div class="card-body">
                <h5 class="card-title">${t.titulo}</h5>
                <p class="card-text text-muted">${t.descripcion}</p>
                <div class="d-flex justify-content-between">
                    <small>Entrega: ${t.fecha_entrega}</small>
                    <div>
                        <button class="btn btn-sm btn-outline-warning me-2" onclick="prepararEdicion(${t.id}, '${t.titulo}', '${t.descripcion}', '${t.fecha_entrega}')">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="borrarTarea(${t.id})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

async function borrarTarea(id) {
    if (!confirm("¿Seguro que quieres borrar esta tarea?")) return;

    const resp = await fetch(`/api/materias/tarea/${id}`, { method: 'DELETE' });
    if (resp.ok) {
        Swal.fire('¡Borrado!', 'La tarea ha sido eliminada.', 'success');
        cargarMisTareas();
    }
}
function prepararEdicion(id, titulo, descripcion, fecha) {
    document.getElementById('edit-tarea-id').value = id;
    document.getElementById('edit-titulo').value = titulo;
    document.getElementById('edit-descripcion').value = descripcion;
    document.getElementById('edit-fecha').value = fecha;

    const modal = new bootstrap.Modal(document.getElementById('modalEditarTarea'));
    modal.show();
}

async function guardarCambiosTarea() {
    const id = document.getElementById('edit-tarea-id').value;
    const datos = {
        titulo: document.getElementById('edit-titulo').value,
        descripcion: document.getElementById('edit-descripcion').value,
        fecha_entrega: document.getElementById('edit-fecha').value
    };

    try {
        const resp = await fetch(`/api/materias/tarea/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        if (resp.ok) {
            Swal.fire('¡Actualizado!', 'La tarea se modificó correctamente.', 'success');
            const modalElement = document.getElementById('modalEditarTarea');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
            
            cargarMisTareas(); 
        }
    } catch (error) {
        console.error("Error al editar:", error);
    }
}