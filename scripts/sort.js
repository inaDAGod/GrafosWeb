// sort.js

document.addEventListener("DOMContentLoaded", function() {
  const crearListaAleatoriaBtn = document.getElementById("crearListaAleatoriaBtn");
  const listaAleatoriaLabel = document.getElementById("listaAleatoriaLabel");

  crearListaAleatoriaBtn.addEventListener("click", function() {
      const numElements = document.getElementById("numElements").value;
      const lowerLimit = document.getElementById("lowerLimit").value;
      const upperLimit = document.getElementById("upperLimit").value;

      const listaAleatoria = generarListaAleatoria(numElements, lowerLimit, upperLimit);
      listaAleatoriaLabel.textContent = listaAleatoria.join(", ");
  });

  function generarListaAleatoria(numElements, lowerLimit, upperLimit) {
      const lista = [];
      for (let i = 0; i < numElements; i++) {
          const randomNumber = Math.floor(Math.random() * (upperLimit - lowerLimit + 1)) + parseInt(lowerLimit);
          lista.push(randomNumber);
      }
      return lista;
  }
});
