// arbolesOrden.js

// Función para obtener el nodo raíz del árbol
function obtenerNodoRaiz() {
  const nodos = nodosDataSet.get({ returnType: "Object" });
  const aristas = aristasDataSet.get({ returnType: "Object" });

  // Convertir nodos y aristas a arrays si es necesario
  const nodosArray = Array.isArray(nodos) ? nodos : Object.values(nodos);
  const aristasArray = Array.isArray(aristas) ? aristas : Object.values(aristas);

  // Encontrar el nodo que no tiene aristas entrantes
  const nodoRaiz = nodosArray.find(nodo => !aristasArray.some(arista => arista.to === nodo.id));

  return nodoRaiz;
}

// Función para crear un objeto de nodo a partir de un objeto de vis.js
function crearNodoArbol(nodoVis) {
  const nodo = {
    id: nodoVis.id,
    label: nodoVis.label,
    hijos: []
  };

  return nodo;
}

// Función para construir el árbol a partir de los nodos y aristas
function construirArbol() {
  const nodos = nodosDataSet.get({ returnType: "Object" });
  const aristas = aristasDataSet.get({ returnType: "Object" });

  // Convertir nodos y aristas a arrays si es necesario
  const nodosArray = Array.isArray(nodos) ? nodos : Object.values(nodos);
  const aristasArray = Array.isArray(aristas) ? aristas : Object.values(aristas);

  const nodoRaiz = obtenerNodoRaiz();
  if (!nodoRaiz) {
    console.log("No se encontró un nodo raíz en el grafo.");
    return null;
  }
  const arbol = crearNodoArbol(nodoRaiz);

  const colaHijos = [arbol];

  while (colaHijos.length > 0) {
    const nodoActual = colaHijos.shift();
    const aristasHijo = aristasArray.filter(arista => arista.from === nodoActual.id);

    aristasHijo.forEach(arista => {
      const nodoHijo = nodosArray.find(nodo => nodo.id === arista.to);
      const nodoHijoArbol = crearNodoArbol(nodoHijo);
      nodoActual.hijos.push(nodoHijoArbol);
      colaHijos.push(nodoHijoArbol);
    });
  }

  return arbol;
}

// Función para recorrer el árbol en preorden
function preorden(nodo) {
  const resultado = [];

  function recorrerPreorden(nodoActual) {
    resultado.push(nodoActual.label);

    nodoActual.hijos.forEach(hijo => {
      recorrerPreorden(hijo);
    });
  }

  recorrerPreorden(nodo);
  return resultado;
}

// Función para recorrer el árbol en inorden
function inorden(nodo) {
  const resultado = [];

  function recorrerInorden(nodoActual) {
    if (nodoActual.hijos.length > 0) {
      recorrerInorden(nodoActual.hijos[0]);
    }

    resultado.push(nodoActual.label);

    if (nodoActual.hijos.length > 1) {
      for (let i = 1; i < nodoActual.hijos.length; i++) {
        recorrerInorden(nodoActual.hijos[i]);
      }
    }
  }

  recorrerInorden(nodo);
  return resultado;
}

// Función para recorrer el árbol en postorden
function postorden(nodo) {
  const resultado = [];

  function recorrerPostorden(nodoActual) {
    nodoActual.hijos.forEach(hijo => {
      recorrerPostorden(hijo);
    });

    resultado.push(nodoActual.label);
  }

  recorrerPostorden(nodo);
  return resultado;
}

// Función para manejar los eventos de los botones
// Función para manejar los eventos de los botones
function manejarBotonOrden(orden) {
  const arbol = construirArbol();
  if (!arbol) {
    return;
  }

  let resultado;
  switch (orden) {
    case 'preorden':
      resultado = preorden(arbol);
      break;
    case 'inorden':
      resultado = inorden(arbol);
      break;
    case 'postorden':
      resultado = postorden(arbol);
      break;
  }

  // Mostrar el resultado en pantalla
  const solucionContainer = document.getElementById('solucion');
  solucionContainer.innerHTML = ''; // Limpiar el contenido previo

  // Crear un elemento de título h3 con el nombre del orden
  const titulo = document.createElement('h3');
  titulo.textContent = `${orden.charAt(0).toUpperCase()}${orden.slice(1)}:`;

  // Crear un párrafo para mostrar el resultado
  const resultadoParrafo = document.createElement('p');
  resultadoParrafo.textContent = resultado.join(', ');

  // Agregar los elementos al contenedor de soluciones
  solucionContainer.appendChild(titulo);
  solucionContainer.appendChild(resultadoParrafo);

  // Imprimir el resultado en la consola
  console.log(`Resultado de ${orden}:`, resultado.join(', '));
}
function generarArbol() {
  const preordenInput = document.getElementById('preordenInput').value;
  const inordenInput = document.getElementById('inordenInput').value;
  const postordenInput = document.getElementById('postordenInput').value;

  const preorden = preordenInput ? preordenInput.split(',').map(Number) : null;
  const inorden = inordenInput ? inordenInput.split(',').map(Number) : null;
  const postorden = postordenInput ? postordenInput.split(',').map(Number) : null;

  const arbol = construirArbolDesdeRecorridos(preorden, inorden, postorden);

  if (arbol) {
    generarGrafoDesdeArbol(arbol);
  } else {
    alert('Los recorridos proporcionados no son válidos para construir un árbol.');
  }
}

function generarGrafoDesdeArbol(arbol) {
  const filas = [];
  const columnas = [];
  const matriz = [];

  let nodeId = 0; // Contador para IDs de nodos
  const edgeIds = {}; // Objeto para rastrear IDs de aristas

  function recorrerArbol(nodo, fila, columna) {
    if (!nodo) {
      return;
    }

    if (!filas[fila]) {
      filas[fila] = nodo.valor;
    }

    if (!columnas[columna]) {
      columnas[columna] = nodo.valor;
    }

    if (!matriz[fila]) {
      matriz[fila] = [];
    }

    matriz[fila][columna] = 1;

    if (nodo.hijos.length > 0) {
      recorrerArbol(nodo.hijos[0], fila + 1, columna);
      recorrerArbol(nodo.hijos[1], fila + 1, columna + 1);
    }
  }

  recorrerArbol(arbol, 0, 0);

  filas.forEach((filaNombre, filaIndex) => {
    nodosDataSet.add({
      id: nodeId, // Usamos el contador para asignar IDs únicos
      label: filaNombre.toString(),
      color: { background: 'lightgreen', border: 'green' }
    });
    nodeId++; // Incrementamos el contador de IDs de nodos
  });

  columnas.forEach((columnaNombre, columnaIndex) => {
    nodosDataSet.add({
      id: nodeId, // Usamos el contador para asignar IDs únicos
      label: columnaNombre.toString()
    });
    nodeId++; // Incrementamos el contador de IDs de nodos
  });

  aristasDataSet.clear();

  filas.forEach((filaNombre, filaIndex) => {
    columnas.forEach((columnaNombre, columnaIndex) => {
      const valor = matriz[filaIndex][columnaIndex];
      if (valor !== 0) {
        const fromId = filaIndex;
        const toId = filas.length + columnaIndex; // Calculamos el ID del nodo de la columna
        const edgeId = `edge_${fromId}_${toId}`;
        edgeIds[edgeId] = true; // Rastreamos IDs de aristas para evitar duplicados
        aristasDataSet.add({
          id: edgeId,
          from: fromId,
          to: toId,
          label: '', // Establecemos el label como una cadena vacía
          arrows: 'to'
        });
      }
    });
  });

  // Actualizamos la red con los nuevos datos
  grafo.setData({ nodes: nodosDataSet, edges: aristasDataSet });
}

function construirArbolDesdeRecorridos(preorden, inorden, postorden) {
  let indicePreorden = 0;
  let indicePostorden = 0;
  let indiceInicialInorden = 0;

  // Verificar si los recorridos son válidos (no nulos y longitudes consistentes)
  if ((!preorden || preorden.length === 0) && (!postorden || postorden.length === 0)) {
    return null; // No se proporcionaron recorridos válidos
  }
  if (inorden && (preorden && preorden.length !== inorden.length) || (postorden && postorden.length !== inorden.length)) {
    return null; // Las longitudes de los recorridos no son consistentes
  }

  function construirArbolRec(limiteInferior, limiteSuperior) {
    if (limiteInferior > limiteSuperior) {
      return null;
    }

    let valorRaiz;
    if (preorden) {
      valorRaiz = preorden[indicePreorden];
      indicePreorden++;
      if (indicePreorden > preorden.length) {
        return null; // Se alcanzó el final del recorrido preorden
      }
    } else if (postorden) {
      valorRaiz = postorden[postorden.length - 1 - indicePostorden];
      indicePostorden++;
      if (indicePostorden > postorden.length) {
        return null; // Se alcanzó el final del recorrido postorden
      }
    }

    const nodoRaiz = { valor: valorRaiz, hijos: [] };

    if (limiteInferior === limiteSuperior) {
      return nodoRaiz;
    }

    const indiceRaizInorden = inorden.indexOf(valorRaiz, indiceInicialInorden);
    if (indiceRaizInorden === -1) {
      return null; // El valor de la raíz no se encontró en el recorrido inorden
    }

    nodoRaiz.hijos.push(construirArbolRec(indiceInicialInorden, indiceRaizInorden - 1));
    indiceInicialInorden = indiceRaizInorden + 1;
    nodoRaiz.hijos.push(construirArbolRec(indiceInicialInorden, limiteSuperior));

    return nodoRaiz;
  }

  if (preorden && inorden) {
    return construirArbolRec(0, inorden.length - 1);
  } else if (postorden && inorden) {
    return construirArbolRec(0, inorden.length - 1);
  } else {
    return null;
  }
}