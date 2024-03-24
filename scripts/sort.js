document.addEventListener("DOMContentLoaded", function() {
  const inputNormal = document.getElementById("inputNormal");
  const inputAleatorio = document.getElementById("inputAleatorio");
  const inputLabel = document.getElementById("inputLabel");
  const numElements = document.getElementById("numElements");
  const lowerLimit = document.getElementById("lowerLimit");
  const upperLimit = document.getElementById("upperLimit");
  const crearListaAleatoriaBtn = document.getElementById("crearListaAleatoriaBtn");
  const cleanBtn = document.getElementById("cleanBtn"); // Agregamos referencia al botón Clean
  const outputLabel = document.getElementById("outputLabel"); // Referencia al elemento de salida
  const performanceLabel = document.getElementById("performanceLabel"); // Referencia al elemento de rendimiento

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

  // También desactivamos los campos al inicio según el estado inicial del checkbox
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

  crearListaAleatoriaBtn.addEventListener("click", function() {
    const numElementsVal = numElements.value;
    const lowerLimitVal = lowerLimit.value;
    const upperLimitVal = upperLimit.value;

    const listaAleatoria = generarListaAleatoria(numElementsVal, lowerLimitVal, upperLimitVal);
    listaAleatoriaLabel.textContent = listaAleatoria.join(", ");
  });

  // Función para limpiar los campos y borrar la salida y el rendimiento
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

  // Función para ordenar la lista utilizando Selection Sort
  function selectionSort(arr) {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      let min = i;
      for (let j = i + 1; j < len; j++) {
        if (arr[j] < arr[min]) {
          min = j;
        }
      }
      if (min !== i) {
        let temp = arr[i];
        arr[i] = arr[min];
        arr[min] = temp;
      }
    }
    return arr;
  }

  // Evento para aplicar el algoritmo de Selection Sort y mostrar el resultado
  selectionSortBtn.addEventListener("click", function() {
    if (inputNormal.checked) {
      const input = inputLabel.value.trim();
      const elementos = input.split(",");
      if (elementos.length <= 1) {
        alert("Los elementos deben estar separados por comas.");
        return;
      }
      const lista = elementos.map(elemento => parseInt(elemento.trim()));
      const listaOrdenada = selectionSort(lista);
      outputLabel.textContent = listaOrdenada.join(", ");
      const rendimiento = (listaOrdenada.length ** 2) / 2;
      performanceLabel.textContent = `Rendimiento: ${rendimiento}`;
    } else if (inputAleatorio.checked) {
      const numElementsVal = numElements.value;
      const lowerLimitVal = lowerLimit.value;
      const upperLimitVal = upperLimit.value;
      const listaAleatoria = generarListaAleatoria(numElementsVal, lowerLimitVal, upperLimitVal);
      const listaOrdenada = selectionSort(listaAleatoria);
      outputLabel.textContent = listaOrdenada.join(", ");
      const rendimiento = (listaOrdenada.length ** 2) / 2;
      performanceLabel.textContent = `Rendimiento: ${rendimiento}`;
    }
  });
});
