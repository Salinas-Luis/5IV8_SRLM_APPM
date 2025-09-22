
var letras = ['T', 'R', 'W', 'A', 'G', 'M', 'Y', 'F', 'P', 'D', 'X', 'B', 'N', 'J', 'Z', 'S', 'Q', 'V', 'H', 'L', 'C', 'K', 'E']; 

function validarDNI() {

    const numeroDNI = document.getElementById('numeroDNI').value;
    const letraUsuario = document.getElementById('letraDNI').value.toUpperCase();
    const resultado = document.getElementById('resultado');
 
    if (numeroDNI < 0 || numeroDNI > 99999999) {
        resultado.textContent = 'El número de DNI proporcionado no es válido.';
        return;
    }

    const resto = numeroDNI % 23;
    const letraCorrecta = letras[resto];

    if (letraCorrecta === letraUsuario) {
        resultado.textContent = ' El número y la letra de DNI son correctos.';
    } else {
        resultado.textContent = ` La letra indicada no es correcta. La letra correcta es '${letraCorrecta}'.`;
 }
}