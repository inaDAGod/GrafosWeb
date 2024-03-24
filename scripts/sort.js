document.addEventListener("DOMContentLoaded", function() {
  const inputNormal = document.getElementById("inputNormal");
  const inputAleatorio = document.getElementById("inputAleatorio");
  const inputLabel = document.getElementById("inputLabel");
  const numElements = document.getElementById("numElements");
  const lowerLimit = document.getElementById("lowerLimit");
  const upperLimit = document.getElementById("upperLimit");
  const crearListaAleatoriaBtn = document.getElementById("crearListaAleatoriaBtn");
  const cleanBtn = document.getElementById("cleanBtn"); 
  const outputLabel = document.getElementById("outputLabel"); 
  const performanceLabel = document.getElementById("performanceLabel"); 
  const selectionSortBtn = document.getElementById("selectionSortBtn"); 

  inputNormal.addEventListener("change", function() {
    if (inputNormal.checked) {
      inputAleatorio.checked = false;
      inputLabel.disabled = false;
      numElements.disabled = true;
      lowerLimit.disabled = true;
      upperLimit.disabled = true;
      crearListaAleatoriaBtn.disabled = true;
    }
  });

  inputAleatorio.addEventListener("change", function() {
    if (inputAleatorio.checked) {
      inputNormal.checked = false;
      inputLabel.disabled = true;
      numElements.disabled = false;
      lowerLimit.disabled = false;
      upperLimit.disabled = false;
      crearListaAleatoriaBtn.disabled = false;
    }
  });

  if (inputNormal.checked) {
    inputLabel.disabled = false;
    numElements.disabled = true;
    lowerLimit.disabled = true;
    upperLimit.disabled = true;
    crearListaAleatoriaBtn.disabled = true;
  } else if (inputAleatorio.checked) {
    inputLabel.disabled = true;
    numElements.disabled = false;
    lowerLimit.disabled = false;
    upperLimit.disabled = false;
    crearListaAleatoriaBtn.disabled = false;
  }

  const listaAleatoriaLabel = document.getElementById("listaAleatoriaLabel");

  let listaAleatoria; // Variable para almacenar la lista aleatoria generada

  crearListaAleatoriaBtn.addEventListener("click", function() {
    const numElementsVal = parseInt(numElements.value);
    const lowerLimitVal = parseInt(lowerLimit.value);
    const upperLimitVal = parseInt(upperLimit.value);
    listaAleatoria = generarListaAleatoria(numElementsVal, lowerLimitVal, upperLimitVal);
    listaAleatoriaLabel.textContent = listaAleatoria.join(", ");
  });

  cleanBtn.addEventListener("click", function() {
    inputNormal.checked = true;
    inputAleatorio.checked = false;
    inputLabel.value = "";
    inputLabel.disabled = false;
    numElements.value = "10";
    numElements.disabled = true;
    lowerLimit.value = "0";
    lowerLimit.disabled = true;
    upperLimit.value = "100";
    upperLimit.disabled = true;
    crearListaAleatoriaBtn.disabled = true;
    listaAleatoriaLabel.textContent = "";
    outputLabel.textContent = "";
    performanceLabel.textContent = "";
  });

  function generarListaAleatoria(numElements, lowerLimit, upperLimit) {
    const lista = [];
    for (let i = 0; i < numElements; i++) {
      const randomNumber = Math.floor(Math.random() * (upperLimit - lowerLimit + 1)) + parseInt(lowerLimit);
      lista.push(randomNumber);
    }
    return lista;
  }

  // Importamos la lógica del Selection Sort desde el archivo selectionSort.js
  selectionSortBtn.addEventListener("click", function() {
    selectionSortEventHandler(listaAleatoria);
  });
});
