const API_URL = "http://localhost:3000/api";

document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        window.location.href = "/";
        return;
    }

    const bienvenida = document.getElementById("bienvenida-usuario");
    if (bienvenida) bienvenida.textContent = `Hola, ${usuario.nombre}`;

    const grupoSelect = document.getElementById("tarea-grupo");
    const materiaSelect = document.getElementById("tarea-materia");
    const btnPublicar = document.getElementById("btnPublicarTarea");

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
        const resp = await fetch(`${API_URL}/materias?id_grupo=${grupoId}`);
        const materias = await resp.json();
        if (resp.ok) {
            selectElement.innerHTML = '<option value="" disabled selected>Seleccionar Materia</option>';
            materias.forEach(m => {
                const opt = document.createElement("option");
                opt.value = m.id;
                opt.textContent = m.nombre_materia;
                selectElement.appendChild(opt);
            });
        }
    } catch (err) {
        console.error("Error al filtrar materias:", err);
    }
}

async function publicarTarea() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    
    const titulo = document.getElementById("tarea-titulo").value.trim();
    const descripcion = document.getElementById("tarea-desc").value.trim();
    const materia_id = parseInt(document.getElementById("tarea-materia").value);
    const grupo_id = parseInt(document.getElementById("tarea-grupo").value);
    const fecha_entrega = document.getElementById("tarea-fecha").value;

    if (titulo.length < 5) {
        return Swal.fire("Atención", "El título debe tener al menos 5 caracteres", "warning");
    }

    if (isNaN(materia_id) || isNaN(grupo_id) || !fecha_entrega) {
        return Swal.fire("Campos incompletos", "Selecciona grupo, materia y fecha de entrega", "warning");
    }

    const datos = {
        titulo,
        descripcion,
        materia_id,
        grupo_id,
        fecha_entrega,
        profesor_id: usuario.nombre_id, 
        rol: usuario.rol.toLowerCase()
    };

    try {
        Swal.showLoading();
        const response = await fetch(`${API_URL}/tareas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const resData = await response.json();

        if (response.ok) {
            Swal.fire("¡Éxito!", "Tarea publicada correctamente", "success");
            document.getElementById("tarea-titulo").value = "";
            document.getElementById("tarea-desc").value = "";
            document.getElementById("tarea-fecha").value = "";
            document.getElementById("tarea-materia").disabled = true;
            document.getElementById("tarea-materia").innerHTML = '<option value="">Selecciona primero un grupo</option>';
            document.getElementById("tarea-grupo").value = "";
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