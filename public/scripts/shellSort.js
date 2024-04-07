// Función para ordenar la lista utilizando Shell Sort
function shellSort(arr) {
  const len = arr.length;
  for (let gap = Math.floor(len / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < len; i++) {
      let temp = arr[i];
      let j;
      for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
        arr[j] = arr[j - gap];
      }
      arr[j] = temp;
    }
  }
  return arr;
}

// Función de evento para el botón "Shell Sort"
function shellSortEventHandler(listaAleatoria) {
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
    const moves = shellSortGrafico(copy);
    generarGrafico(lista, 0);
    animate(moves, copy);
    listaOrdenada = shellSort(lista);
  } else if (inputAleatorio.checked) {
    generarGrafico(listaAleatoria, 0);
    const copy = [...listaAleatoria];
    const moves = shellSortGrafico(copy);
    animate(moves, copy);
    console.log("Input aleatorio activado");
    if (!listaAleatoria) { // Solo genera la lista si aún no está definida
      const numElementsVal = parseInt(numElements.value);
      const lowerLimitVal = parseInt(lowerLimit.value);
      const upperLimitVal = parseInt(upperLimit.value);
      listaAleatoria = generarListaAleatoria(numElementsVal, lowerLimitVal, upperLimitVal);
    }
    listaOrdenada = shellSort(listaAleatoria);
    listaAleatoria = listaOrdenada; // Update listaAleatoria with the sorted array
  }

  outputLabel.textContent = listaOrdenada.join(", ");
  const rendimiento = listaOrdenada.length ** (3/2); // Rendimiento ajustado
performanceLabel.textContent = `Rendimiento: ${rendimiento.toFixed(1)}`;

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
    generarGrafico(lista); // Render the final sorted array
    return;
  }

  const move = moves.shift();
  const [i, j] = move.indices;

  // Update the visualization before performing the action
  generarGrafico(lista, move);

  setTimeout(function () {
    if (move.type === "swap") {
      // Perform swap
      [lista[i], lista[j]] = [lista[j], lista[i]];
    } else if (move.type === "comp") {
      // No operation needed, but update the visualization
      generarGrafico(lista, move);
    }

    // Continue animation
    animate(moves, lista);
  }, 20);
}
function shellSortGrafico(array) {
  const moves = [];
  const n = array.length;
  const auxiliarArray = [...array]; // Crea una copia del arreglo original

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = auxiliarArray[i];
      let j;
      for (j = i; j >= gap && auxiliarArray[j - gap] > temp; j -= gap) {
        auxiliarArray[j] = auxiliarArray[j - gap];
        // Mueve esta línea después del intercambio
      }
      if (j !== i) {
        auxiliarArray[j] = temp;
        moves.push({ indices: [j, i], type: "swap" });
      }
      // Mueve esta línea aquí, después del intercambio
      moves.push({ indices: [j, j - gap], type: "comp" });
    }
  }

  return moves;
}
