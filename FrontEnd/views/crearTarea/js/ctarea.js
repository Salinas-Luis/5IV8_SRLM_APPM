
document.addEventListener('DOMContentLoaded', function() {
    const btnEquipo = document.getElementById('btn-equipo');
    const btnIndividual = document.getElementById('btn-individual');
    const contenedorIntegrantes = document.getElementById('contenedor-integrantes');
    
    const MAX_INTEGRANTES = 3;
    btnEquipo.addEventListener('click', function() {
        contenedorIntegrantes.innerHTML = ''; 

        const pTitulo = document.createElement('p');
        pTitulo.classList.add('label');
        pTitulo.textContent = 'Integrantes (Boleta del IPN):';
        contenedorIntegrantes.appendChild(pTitulo);
        for (let i = 1; i <= MAX_INTEGRANTES; i++) {
            const divInput = document.createElement('div');
            

            const label = document.createElement('label');
            label.setAttribute('for', `integrante-${i}`);
            

            const input = document.createElement('input');
            input.setAttribute('type', 'text'); 
            input.setAttribute('id', `integrante-${i}`);
            input.setAttribute('class', 'inputlog');
            input.setAttribute('placeholder', `Integrante ${i}`);
            input.setAttribute('maxlength', '9');
            input.setAttribute('onkeypress','return validarb(event)')
            

            divInput.appendChild(label);
            divInput.appendChild(input);
            
            contenedorIntegrantes.appendChild(divInput);
        }
            contenedorIntegrantes.innerHTML += '<hr>';
    });

    btnIndividual.addEventListener('click', function() {
        contenedorIntegrantes.innerHTML = '';
    });
});

function validarIntegrantes() {
    const regexBoleta = /^\d{9}$/;
    const contenedor = document.getElementById('contenedor-integrantes');
    if (!contenedor || contenedor.innerHTML.trim() === '') {
        return true; 
    }
    let alMenosUnoLleno = false; 
    const inputsIntegrantes = contenedor.querySelectorAll('input[id^="integrante-"]');
    
    for (let i = 0; i < inputsIntegrantes.length; i++) {
        const input = inputsIntegrantes[i];
        const boleta = input.value.trim();
        const numeroIntegrante = i + 1;

        if (boleta !== "") {
            
            if (!regexBoleta.test(boleta)) {
                alert(`La Boleta del Integrante ${numeroIntegrante} es inválida. Debe contener  10 dígitos numéricos.`);
                input.focus();
                return false; 
            }
            alMenosUnoLleno = true;
        }
    }
    if (!alMenosUnoLleno) {
        alert("Si creas una tarea en equipo, debes ingresar la Boleta de al menos un Integrante.");
        const primerInput = document.getElementById('integrante-1');
        if (primerInput) {
             primerInput.focus();
        }
        return false;
    }
    return true;
}

function validarb(e) {
    var teclado = document.all ? e.keycode : e.which
    if(teclado === 8) return true;
    var regex = /[0-9]/
    var codigo = String.fromCharCode(teclado)
    return regex.test(codigo)
}

function validarFechaEntrega() {
    var inputFecha = document.getElementById("fechaentrega");
    var fechaIngresada = inputFecha.value; 

    if (fechaIngresada === "") {
        alert("Debes seleccionar una Fecha de entrega.");
        inputFecha.focus();
        return false;
    }
    var hoy = new Date();
    var mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1); 
    var mañanaCadena = mañana.toISOString().substring(0, 10);
    if (fechaIngresada < mañanaCadena) {
        alert("La Fecha de entrega debe ser un día posterior al día actual.");
        inputFecha.focus();
        return false;
    }

    return true;
}

function validarPrioridad() {
    var radios = document.getElementsByName("nivelprio");
    var seleccionado = false;
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            seleccionado = true;
            break; 
        }
    }
    if (!seleccionado) {
        alert("Debes seleccionar un Nivel de Prioridad (Alta, Media o Baja).");
        document.getElementById("nivelprio1").focus(); 
        return false;
    }
    return true;
}

function validarForm() {
    var tarea = document.getElementById("tareanombrereg").value;
    var Instrucciones = document.getElementById("Instrucciones").value;
    if (!validarFechaEntrega()) {
        return false;
    }
    if(tarea === ""){
        alert("Escriba un nombre para la tarea")
        return false;
    }
    if(Instrucciones === ""){
        alert("Rellene las instrucciones")
        return false;
    }
    if(Instrucciones.length>=200){
        alert("Las instrucciones deben tener menos de 200 caracteres")
        return false;
    }
    if (!validarPrioridad()) {
        return false;
    }
    if (!validarIntegrantes()) {
        return false;
    }
    
    return true;
}
function guardarTarea() {
    if (validarForm()) {
        const taskId = Date.now();
        const datosTarea = {
            id: taskId,
            nombre: document.getElementById("tareanombrereg").value,
            materia: document.getElementById("catalogomaterias").value,
            fecha: document.getElementById("fechaentrega").value,
            prioridad: document.querySelector('input[name="nivelprio"]:checked') 
                       ? document.querySelector('input[name="nivelprio"]:checked').labels[0].textContent 
                       : 'No asignada',
            instrucciones: document.getElementById("Instrucciones").value,
        };
        
        let tareasGuardadas = JSON.parse(localStorage.getItem('tareas')) || [];
        tareasGuardadas.push(datosTarea);
        localStorage.setItem('tareas', JSON.stringify(tareasGuardadas));
        window.location.href = "../PostLogin/postlog.html";
        
        return true; 
    }
    return false;
}

function resetearFormulario() {
    document.getElementById("tareanombrereg").value = '';
    document.getElementById("Instrucciones").value = '';
    document.getElementById("fechaentrega").value = '';
    document.getElementById('contenedor-integrantes').innerHTML = ''; 
    var radiosPrioridad = document.getElementsByName("nivelprio");
    for (var i = 0; i < radiosPrioridad.length; i++) {
        radiosPrioridad[i].checked = false;
    }
    
    alert("Formulario reseteado.");
}

function guardarYValidar() {
    if (validarForm()) {
        window.location.href = "../PostLogin/postlog.html";
        
        return true; 
    }
    return false;
}