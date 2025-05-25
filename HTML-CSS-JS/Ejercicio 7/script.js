// 1. Definir una variable numérica, asignarle un valor y sumarle 5
function sumarCinco() {
    let numero = 10;
    let resultado = numero + 5;
    alert("Resultado de la suma: " + resultado);
}

// 2. Definir dos variables de cadenas, asignarles valores y concatenarlas
function concatenarCadenas() {
    let nombre = "Justina";
    let apellido = "Smith";
    let nombreCompleto = nombre + " " + apellido;
    alert("Nombre completo: " + nombreCompleto);
}

// 3. Evaluar si dos números son iguales, diferentes, mayor o menor
function compararNumeros() {
    let a = 7;
    let b = 10;
    let mensaje;

    if (a === b) {
        mensaje = "a y b son iguales";
    } else if (a > b) {
        mensaje = "a es mayor que b";
    } else {
        mensaje = "a es menor que b";
    }

    alert(mensaje);
}

// 4. Clasificar número en grupo con switch
function clasificarGrupo() {
    let valor = 8;
    let grupo;

    switch (true) {
    case (valor >= 1 && valor <= 3):
        grupo = "Grupo 1";
        break;
    case (valor >= 4 && valor <= 6):
        grupo = "Grupo 2";
        break;
    case (valor >= 7 && valor <= 10):
        grupo = "Grupo 3";
        break;
    default:
        grupo = "Valor fuera de rango";
    }

    alert("El valor pertenece a: " + grupo);
}
