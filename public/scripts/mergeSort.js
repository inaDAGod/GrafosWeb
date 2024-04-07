// Función para ordenar la lista utilizando Merge Sort
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

function mergeSortEventHandler(listaAleatoria) {
  let listaOriginal;
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
    listaOriginal = [...lista]; // Guardar una copia del arreglo original
    const copy = [...lista];
    const moves = mergeSortGrafico(copy);
    generarGrafico(lista, 0);
    animate(moves, listaOriginal); // Pasar la copia del arreglo original
    listaOrdenada = mergeSort(lista);
  } else if (inputAleatorio.checked) {
    generarGrafico(listaAleatoria, 0);
    listaOriginal = [...listaAleatoria]; // Guardar una copia del arreglo original
    const copy = [...listaAleatoria];
    const moves = mergeSortGrafico(copy);
    animate(moves, listaOriginal); // Pasar la copia del arreglo original
    console.log("Input aleatorio activado");
    if (!listaAleatoria) { // Solo genera la lista si aún no está definida
      const numElementsVal = parseInt(numElements.value);
      const lowerLimitVal = parseInt(lowerLimit.value);
      const upperLimitVal = parseInt(upperLimit.value);
      listaAleatoria = generarListaAleatoria(numElementsVal, lowerLimitVal, upperLimitVal);
    }
    listaOrdenada = mergeSort(listaAleatoria);
    listaAleatoria = listaOrdenada;
  }

  outputLabel.textContent = listaOrdenada.join(", ");
  const rendimiento = listaOrdenada.length * Math.log2(listaOrdenada.length); // Rendimiento ajustado
  performanceLabel.textContent = `Rendimiento: ${rendimiento.toFixed(1)}`;
}


//prueba
//Prueba de graficar
function generarGrafico(lista, move) {
  const maxValue = Math.max(...lista); // Obtener el valor máximo en la lista
  const container = document.getElementById("containerGrafico");

  // Obtener las barras existentes
  const barsContainer = container.getElementsByClassName("bar");
  const bars = Array.from(barsContainer);

  // Actualizar las barras existentes
  bars.forEach((bar, index) => {
    const barHeight = (lista[index] / maxValue) * 100 + "%";
    bar.style.height = barHeight;
    if (move && move.indices.includes(index)) {
      bar.style.backgroundColor = move.type === "swap" ? "red" : "blue";
    } else {
      bar.style.backgroundColor = ""; // Restablecer el color de la barra
    }
  });

  // Agregar barras faltantes si la longitud de la lista ha cambiado
  if (bars.length !== lista.length) {
    for (let i = bars.length; i < lista.length; i++) {
      const bar = document.createElement("div");
      const barHeight = (lista[i] / maxValue) * 100 + "%";
      bar.style.height = barHeight;
      bar.classList.add("bar");
      container.appendChild(bar);
    }
  }
}

function animate(moves, originalArray) {
  let currentArray = [...originalArray];
  generarGrafico(originalArray); // Mostrar el estado inicial del arreglo antes de la animación

  const animateStep = () => {
    if (moves.length === 0) {
      return; // Finalizar la animación cuando no haya más movimientos
    }

    const move = moves.shift(); // Obtener el próximo movimiento
    const [i, j] = move.indices;

    // Aplicar el movimiento al arreglo actual
    if (move.type === "swap") {
      [currentArray[i], currentArray[j]] = [currentArray[j], currentArray[i]];
    }

    // Renderizar el estado actual del arreglo durante la animación
    generarGrafico(currentArray, move);

    // Esperar un breve período antes de aplicar el próximo movimiento
    setTimeout(animateStep, 200);
  };

  // Comenzar la animación
  animateStep();
}


function mergeSortGrafico(arr) {
  const moves = [];
  mergeSortHelper(arr, 0, arr.length - 1, moves);
  return moves;
}

function mergeSortHelper(arr, left, right, moves) {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);
  mergeSortHelper(arr, left, mid, moves);
  mergeSortHelper(arr, mid + 1, right, moves);
  mergeGrafico(arr, left, mid, right, moves);
}

function mergeGrafico(arr, left, mid, right, moves) {
  let i = left, j = mid + 1;
  const merged = [];
  let k = left; // Índice para el arreglo original

  while (i <= mid && j <= right) {
    if (arr[i] <= arr[j]) {
      merged.push(arr[i]);
      moves.push({ indices: [k, i], type: "comp" });
      arr[k++] = arr[i++]; // Copiar elemento y avanzar índices
    } else {
      merged.push(arr[j]);
      moves.push({ indices: [k, j], type: "comp" });
      arr[k++] = arr[j++]; // Copiar elemento y avanzar índices
    }
  }

  while (i <= mid) {
    merged.push(arr[i]);
    moves.push({ indices: [k, i], type: "comp" });
    arr[k++] = arr[i++]; // Copiar elemento y avanzar índices
  }

  while (j <= right) {
    merged.push(arr[j]);
    moves.push({ indices: [k, j], type: "comp" });
    arr[k++] = arr[j++]; // Copiar elemento y avanzar índices
  }
}