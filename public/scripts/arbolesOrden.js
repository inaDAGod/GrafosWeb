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