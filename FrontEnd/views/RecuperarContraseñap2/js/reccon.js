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
            title: "Ingrese de 8 a 12 caracteres en la contraseña.",
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
            title: "El campo contraseña no puede estar vacío.",
            icon: "warning",
        }) 
        return false;
    }
    if(password.length<8){
        Swal.fire({
            title: "Ingrese de 8 a 12 caracteres en la contraseña.",
            icon: "warning",
        }) 
        return false;
    }
    Swal.fire({
        title: "Cambio de contraseña Exitoso!",
        icon: "success",
        timer: 2000,
        timerProgressBar: true
    }) .then(() => {
        window.location.href = "../index.html";
    })
    return false;

}
document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#userreg');

    if (togglePassword && password) {
        togglePassword.addEventListener('click', function (e) {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
});