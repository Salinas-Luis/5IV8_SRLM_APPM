
function validarc(e){
    var teclado = document.all ? e.keyCode : e.which;
    if (teclado === 8 || teclado === 0) return true; 

    var codigo = String.fromCharCode(teclado);
    var inputElement = e.target; 
    var valorActual = inputElement.value;
    var valorFuturo = valorActual + codigo;
    var regexCaracter = /[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/; 

    if (!regexCaracter.test(codigo)) {
        return false; 
    }
    if (codigo === ' ') {
        return false;
    }

    var caracteresEspeciales = "!@#$%^&*()_+-=[]{};':\"\\|,.<>/?"; 
 
    if (caracteresEspeciales.includes(codigo)) {
        if (valorActual.includes(codigo)) {
            Swal.fire({
                title: "El carácter especial '" + codigo + "' solo puede usarse una vez.",
                icon: "warning",
            }) 
            return false; 
        }
    }
    if (valorFuturo.length > 12) {
        Swal.fire({
            title: "La cantidad de caracteres no puede superar 12.",
            icon: "warning",
        }) 
        return false; 
    }
    
    return true;
}
function validars(){
    var password = document.getElementById("userreg").value;
    if(password === ""){
        Swal.fire({
            title: "El campo Palabra de verificación no puede estar vacío.",
            icon: "warning",
        }) 
        return false;
    }
    if(password.length<8){
        Swal.fire({
            title: "Ingrese de 8 a 12 caracteres.",
            icon: "warning",
        }) 
        return false;
    }
    Swal.fire({
        title: "Palabra correcta!",
        icon: "success",
        timer: 2000,
        timerProgressBar: true
    }) .then(() => {
        window.location.href = "../RecuperarContraseñap2/reccon.html";
    })
    return false;
}