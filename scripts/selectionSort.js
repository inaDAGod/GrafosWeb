
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

// Función de evento para el botón "Selection Sort"
function selectionSortEventHandler(listaAleatoria) {
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
    const moves = selectionSortGrafico(copy);
    generarGrafico(lista, 0);
    animate(moves, copy);
    listaOrdenada = selectionSort(lista);
  } else if (inputAleatorio.checked) {
    generarGrafico(listaAleatoria, 0);
    const copy = [...listaAleatoria];
    const moves = selectionSortGrafico(copy);
    animate(moves, copy);
    console.log("Input aleatorio activado");
    if (!listaAleatoria) {
      const numElementsVal = parseInt(numElements.value);
      const lowerLimitVal = parseInt(lowerLimit.value);
      const upperLimitVal = parseInt(upperLimit.value);
      listaAleatoria = generarListaAleatoria(numElementsVal, lowerLimitVal, upperLimitVal);
    }
    listaOrdenada = selectionSort(listaAleatoria);
    listaAleatoria = listaOrdenada; // Update listaAleatoria with the sorted array
  }

  outputLabel.textContent = listaOrdenada.join(", ");
  const rendimiento = (listaOrdenada.length ** 2) / 2;
  performanceLabel.textContent = `Rendimiento: ${rendimiento}`;
}



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

function selectionSortGrafico(array) {
  const moves = [];
  const n = array.length;
  const auxiliarArray = [...array]; // Create a copy of the original array

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      moves.push({ indices: [i, j], type: "comp" });
      if (auxiliarArray[j] < auxiliarArray[minIdx]) {
        moves.push({ indices: [minIdx, j], type: "comp" });
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      moves.push({ indices: [i, minIdx], type: "swap" });
      [auxiliarArray[i], auxiliarArray[minIdx]] = [auxiliarArray[minIdx], auxiliarArray[i]]; // Swap the actual values
    }
  }
  return moves;
}