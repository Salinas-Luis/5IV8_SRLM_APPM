
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
            div.className = "materia-card-alumno"; 
            
            const tipoLabel = materia.carrera_id === 1 ? "Tronco Común" : "Especialidad";

            div.innerHTML = `
                <div>
                    <span class="materia-titulo">${materia.nombre_materia}</span>
                    <span class="materia-tipo">${tipoLabel}</span>
                </div>
                <div class="notas-display">
                    <div class="nota-item">
                        <span class="nota-label">Parcial 1</span>
                        <span class="nota-valor">${materia.p1 || '0.0'}</span>
                    </div>
                    <div class="nota-item" style="border-left: 1px solid #ddd; border-right: 1px solid #ddd;">
                        <span class="nota-label">Parcial 2</span>
                        <span class="nota-valor">${materia.p2 || '0.0'}</span>
                    </div>
                    <div class="nota-item">
                        <span class="nota-label">Parcial 3</span>
                        <span class="nota-valor">${materia.p3 || '0.0'}</span>
                    </div>
                </div>
            `;
            contenedor.appendChild(div);
        });

    } catch (err) {
        contenedor.innerHTML = `<p class="text-danger">Error: ${err.message}</p>`;
    }
}


window.cerrarSesion = function() {
    localStorage.removeItem("usuario");
    window.location.href = "/"; 
};