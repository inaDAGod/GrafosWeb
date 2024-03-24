
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
    listaOrdenada = selectionSort(lista);
    //PRUEBA
    selectionSortWithVisualization(lista);
  } else if (inputAleatorio.checked) {
    console.log("Input aleatorio activado");
    if (!listaAleatoria) { // Solo genera la lista si aún no está definida
      const numElementsVal = parseInt(numElements.value);
      const lowerLimitVal = parseInt(lowerLimit.value);
      const upperLimitVal = parseInt(upperLimit.value);
      listaAleatoria = generarListaAleatoria(numElementsVal, lowerLimitVal, upperLimitVal);
    }
    listaOrdenada = selectionSort(listaAleatoria);
    //PRUEBA
    selectionSortWithVisualization(listaAleatoria);
  }

  outputLabel.textContent = listaOrdenada.join(", ");
  const rendimiento = (listaOrdenada.length ** 2) / 2;
  performanceLabel.textContent = `Rendimiento: ${rendimiento}`;
}
//PRUEBA
async function selectionSortWithVisualization(arr) {
  const graphContainer = document.getElementById("bars");
  graphContainer.innerHTML = ""; // Limpiar el contenedor antes de comenzar

  // Crear y mostrar las barras iniciales
  const barWidth = 30; // Ancho de cada barra
  for (let i = 0; i < arr.length; i++) {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${arr[i]}px`;
    bar.style.width = `${barWidth}px`;
    bar.style.left = `${i * (barWidth + 5)}px`; // Separación entre barras
    graphContainer.appendChild(bar);
    await waitforme(100); // Esperar un tiempo para visualizar cada barra
  }

  // Algoritmo de ordenación por selección con visualización
  for (let i = 0; i < arr.length; i++) {
    let min_index = i;
    graphContainer.children[i].style.backgroundColor = 'blue'; // Cambiar color de la barra a azul

    for (let j = i + 1; j < arr.length; j++) {
      graphContainer.children[j].style.backgroundColor = 'red'; // Cambiar color de la barra a rojo
      await waitforme(100); // Esperar un tiempo para visualizar la comparación

      if (arr[j] < arr[min_index]) {
        // Cambiar color de la barra mínima anterior a normal
        graphContainer.children[min_index].style.backgroundColor = 'cyan';
        min_index = j;
        // Cambiar color de la nueva barra mínima a azul
        graphContainer.children[min_index].style.backgroundColor = 'blue';
      } else {
        // Cambiar color de la barra a normal
        graphContainer.children[j].style.backgroundColor = 'cyan';
      }
    }

    // Intercambiar las barras visualmente
    await waitforme(300); // Esperar un tiempo antes de intercambiar las barras
    swapBars(graphContainer.children[i], graphContainer.children[min_index]);
    await waitforme(100); // Esperar un tiempo después de intercambiar las barras
    // Cambiar color de la barra ordenada a verde
    graphContainer.children[i].style.backgroundColor = 'green';
  }
}

// Función para intercambiar dos barras
function swapBars(bar1, bar2) {
  const tempHeight = bar1.style.height;
  bar1.style.height = bar2.style.height;
  bar2.style.height = tempHeight;
}

// Espera asincrónica para la visualización
function waitforme(delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}