// sort.js

document.addEventListener("DOMContentLoaded", function() {
  const crearListaAleatoriaBtn = document.getElementById("crearListaAleatoriaBtn");
  const listaAleatoriaLabel = document.getElementById("listaAleatoriaLabel");

 

function crearListaAleatoria() {
    var numElements = parseInt(document.getElementById('numElements').value);
    var lowerLimit = parseInt(document.getElementById('lowerLimit').value);
    var upperLimit = parseInt(document.getElementById('upperLimit').value);
    var listaAleatoria = [];

    for (var i = 0; i < numElements; i++) {
        var randomNum = Math.floor(Math.random() * (upperLimit - lowerLimit + 1)) + lowerLimit;
        listaAleatoria.push(randomNum);
    }

    document.getElementById('listaAleatoriaLabel').innerText = listaAleatoria.join(', ');
}
});
