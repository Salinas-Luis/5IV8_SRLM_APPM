document.addEventListener("DOMContentLoaded", async () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        window.location.href = "../login.html";
        return;
    }

    document.getElementById("bienvenida-usuario").textContent = `Hola, ${usuario.nombre}`;
    document.getElementById("info-academica").textContent = 
        `Carrera: ${usuario.carrera_id} | Semestre: ${usuario.semestre}° | Grupo: ${usuario.grupo_id}`;

    await cargarMaterias(usuario.carrera_id, usuario.semestre, usuario.id);

});

async function cargarMaterias(carrera_id, semestre, usuario_id) {
    const contenedor = document.getElementById("contenedor-materias");
    
    try {
        const resp = await fetch(`/api/materias/mis-materias?carrera_id=${carrera_id}&semestre=${semestre}`);
        const materias = await resp.json();

        if (!resp.ok) throw new Error(materias.error);

        contenedor.innerHTML = ""; 

        materias.forEach(materia => {
            const div = document.createElement("div");
            div.className = "materia-card"; 
            div.innerHTML = `
                <div class="materia-info">
                    <strong>${materia.nombre_mate}</strong>
                    <div class="inputs-parciales">
                        <input type="number" placeholder="P1" id="p1-${materia.id}" min="0" max="10" step="0.1">
                        <input type="number" placeholder="P2" id="p2-${materia.id}" min="0" max="10" step="0.1">
                        <input type="number" placeholder="P3" id="p3-${materia.id}" min="0" max="10" step="0.1">
                        <button onclick="enviarNota(${materia.id}, ${usuario_id})">
                            <i class="fas fa-save"></i>
                        </button>
                    </div>
                </div>
            `;
            contenedor.appendChild(div);
        });

    } catch (err) {
        contenedor.innerHTML = `<p style="color:red;">Error al cargar materias: ${err.message}</p>`;
    }
}

window.enviarNota = async (materiaId, usuarioId) => {
    const nota = document.getElementById(`p1-${materiaId}`).value;
    
    if(!nota) return Swal.fire("Nota vacía", "Ingresa una calificación", "warning");

    try {
        const res = await fetch('/api/calificaciones/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuario_id: usuarioId,
                materia_id: materiaId,
                calificacion: parseFloat(nota),
                parcial: 1
            })
        });

        if(res.ok) Swal.fire("¡Guardado!", "Calificación registrada", "success");
    } catch (err) {
        Swal.fire("Error", "No se pudo conectar al servidor", "error");
    }
};