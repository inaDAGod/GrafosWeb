// Función para ordenar la lista utilizando Insertion Sort
function insertionSort(arr) {
  const len = arr.length;
  for (let i = 1; i < len; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}

// Función de evento para el botón "Insertion Sort"
function insertionSortEventHandler(listaAleatoria) {
  let listaOrdenada;
  const inputNormal = document.getElementById("inputNormal");
  const inputLabel = document.getElementById("inputLabel");
  const inputAleatorio = document.getElementById("inputAleatorio");
  const numElements = document.getElementById("numElements");
  const lowerLimit = document.getElementById("lowerLimit");
  const upperLimit = document.getElementById("upperLimit");
  const outputLabel = document.getElementById("outputLabel");
  const performanceLabel = document.getElementById("performanceLabel");

  if (inputNormal.checked) {
    console.log("Input normal activado");
    const input = inputLabel.value.trim();
    const elementos = input.split(",");
    if (elementos.length <= 1) {
      alert("Los elementos deben estar separados por comas.");
      return;
    }
    const lista = elementos.map(elemento => parseInt(elemento.trim()));
    const copy = [...lista];
    const moves = insertionSortGrafico(copy);
    generarGrafico(lista, 0);
    animate(moves, copy);
    listaOrdenada = insertionSort(lista);
  } else if (inputAleatorio.checked) {
    generarGrafico(listaAleatoria, 0);
    const copy = [...listaAleatoria];
    const moves = insertionSortGrafico(copy);
    animate(moves, copy);
    console.log("Input aleatorio activado");
    if (!listaAleatoria) {
      const numElementsVal = parseInt(numElements.value);
      const lowerLimitVal = parseInt(lowerLimit.value);
      const upperLimitVal = parseInt(upperLimit.value);
      listaAleatoria = generarListaAleatoria(numElementsVal, lowerLimitVal, upperLimitVal);
    }
    listaOrdenada = insertionSort(listaAleatoria);
    listaAleatoria = listaOrdenada; // Update listaAleatoria with the sorted array
  }

  outputLabel.textContent = listaOrdenada.join(", ");
  const rendimiento = (listaOrdenada.length ** 2) / 2;
  performanceLabel.textContent = `Rendimiento: ${rendimiento}`;
}

//prueba
//Prueba de graficar
function generarGrafico(lista, move) {
  const maxValue = Math.max(...lista); // Obtener el valor máximo en la lista
  const container = document.getElementById("containerGrafico");
  container.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevas barras

  for (let i = 0; i < lista.length; i++) {
    const bar = document.createElement("div");
    // Establecer la altura de la barra en relación con el valor de la lista
    const barHeight = (lista[i] / maxValue) * 100 + "%";
    bar.style.height = barHeight;
    bar.classList.add("bar");
    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type === "swap" ? "red" : "blue";
    }
    container.appendChild(bar);
  }
}

function animate(moves, lista) {
  if (moves.length === 0) {
    // You can remove this comment when everything is working
    // generarGrafico(lista);
    return;
  }

  const move = moves.shift();
  const [i, j] = move.indices;

  // Update the visualization before performing the swap
  generarGrafico(lista, move);

  if (move.type === "swap") {
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }

  setTimeout(function () {
    animate(moves, lista);
  }, 200);
}

function insertionSortGrafico(array) {
  const moves = [];
  const n = array.length;
  const auxiliarArray = [...array]; // Create a copy of the original array

  for (let i = 1; i < n; i++) {
    let currentVal = auxiliarArray[i];
    let j = i - 1;

    while (j >= 0 && auxiliarArray[j] > currentVal) {
      moves.push({ indices: [j, j + 1], type: "comp" });
      auxiliarArray[j + 1] = auxiliarArray[j]; // Move the larger value to the right
      j--;
    }

    auxiliarArray[j + 1] = currentVal; // Insert the current value at the correct position
    moves.push({ indices: [j + 1, i], type: "swap" }); // Add a swap move for visualization
  }

  return moves;
}