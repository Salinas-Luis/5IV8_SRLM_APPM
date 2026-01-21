function validaru(e){
var teclado = document.all ? e.keyCode : e.which;
    if (teclado === 8) return true;
    var codigo = String.fromCharCode(teclado);
    var inputElement = e.target; 
    
    var valorActual = inputElement.value;
    var valorFuturo = valorActual + codigo; 

    var regexCaracter = /^[a-zA-Z0-9_\.]$/;
    if (!regexCaracter.test(codigo)) {
        return false; 
    }
    var conteoPuntos = (valorFuturo.match(/\./g) || []).length;
    if (conteoPuntos > 1) {
        Swal.fire({
            title: "La cantidad de puntos no puede ser mayor a 1",
            icon: "warning"
        }) 
        return false; 
    }
    if (valorFuturo.length > 16) {
        Swal.fire({
            title: "Ingrese de 8 a 16 caracteres en usuario.",
            icon: "warning"
        }) 
        return false; 
    }
    if (codigo === ' ') {
        return false;
    }
    return true;
}

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
                title: "El carácter especial '" + codigo + "' solo puede usarse una vez..",
                icon: "warning"
            }) 
            return false; 
        }
    }
    if (valorFuturo.length > 12) {
        Swal.fire({
            title: "Ingrese de 8 a 12 caracteres en contraseña.",
            icon: "warning"
        }) 
        return false; 
    }
    
    return true;
}

document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#loginpass');

    if (togglePassword && password) {
        togglePassword.addEventListener('click', function (e) {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
});

function validars(){
    var user = document.getElementById("logincu").value;
    var password = document.getElementById("loginpass").value;
    if(user === ""){
        Swal.fire({
            title: "El campo usuario no puede estar vacio.",
            icon: "warning"
        }) 
        return false;
    }
    if(user.length<8){
        Swal.fire({
            title: "Ingrese de 8 a 16 caracteres en el usuario.",
            icon: "warning"
        }) 
        return false;
    }
    if(password === ""){
        Swal.fire({
            title: "El campo contraseña no puede estar vacio.",
            icon: "warning"
        }) 
        return false;
    }
    if(password.length<8){
        Swal.fire({
            title: "Ingrese de 8 a 12 caracteres en la contraseña.",
            icon: "warning"
        })
        return false;
    }
    Swal.fire({
        title: "Inicio de sesión exitoso!",
        icon: "success",
        timer: 2000,
        timerProgressBar: true
    }).then(() => {
        window.location.href = "../PostLogin/postlog.html";
    })
    return false;
}

