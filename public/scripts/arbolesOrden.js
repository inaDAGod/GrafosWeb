function findIndex(array, value) {
  for (let i = 0; i < array.length; i++) {
      if (array[i] === value) return i;
  }
  return -1;
}

function addNodeAndEdgesToGraph(nodeId, label, leftId, rightId) {
  nodosDataSet.add({id: nodeId, label: label});
  if (leftId !== null) {
      aristasDataSet.add({from: nodeId, to: leftId});
  }
  if (rightId !== null) {
      aristasDataSet.add({from: nodeId, to: rightId});
  }
}

function buildTreeFromPreIn(preorder, inorder, nodeIdCounter) {
  if (preorder.length === 0 || inorder.length === 0) return null;
  let rootValue = preorder.shift();
  let rootId = nodeIdCounter.value++;
  let index = findIndex(inorder, rootValue);

  if (index === -1) return null; // Verifica que el valor esté en inorder

  let inLeft = inorder.slice(0, index);
  let inRight = inorder.slice(index + 1);

  let leftChildId = buildTreeFromPreIn(preorder.slice(0, inLeft.length), inLeft, nodeIdCounter);
  let rightChildId = buildTreeFromPreIn(preorder.slice(inLeft.length), inRight, nodeIdCounter);

  addNodeAndEdgesToGraph(rootId, rootValue, leftChildId, rightChildId);
  return rootId;
}

function buildTreeFromInPost(inorder, postorder, nodeIdCounter) {
  if (inorder.length === 0 || postorder.length === 0) return null;
  let rootValue = postorder.pop();
  let rootId = nodeIdCounter.value++;
  let index = findIndex(inorder, rootValue);

  if (index === -1) return null; // Verifica que el valor esté en inorder

  let inLeft = inorder.slice(0, index);
  let inRight = inorder.slice(index + 1);

  let leftChildId = buildTreeFromInPost(inLeft, postorder.slice(0, inLeft.length), nodeIdCounter);
  let rightChildId = buildTreeFromInPost(inRight, postorder.slice(inLeft.length), nodeIdCounter);

  addNodeAndEdgesToGraph(rootId, rootValue, leftChildId, rightChildId);
  return rootId;
}
function buildTreeFromPrePost(preorder, postorder, nodeIdCounter) {
  if (preorder.length === 0 || postorder.length === 0) return null;
  if (preorder.length === 1) {
      let rootId = nodeIdCounter.value++;
      addNodeAndEdgesToGraph(rootId, preorder[0], null, null);
      return rootId;
  }

  let rootValue = preorder[0];
  let rootId = nodeIdCounter.value++;
  let leftRoot = preorder[1]; // El primer elemento después de la raíz en el preorden es la raíz del subárbol izquierdo
  let leftRootIndexInPost = postorder.indexOf(leftRoot);

  if (leftRootIndexInPost === -1) return null; // Verifica que el valor esté en postorden

  let leftSubtreePre = preorder.slice(1, leftRootIndexInPost + 2);
  let leftSubtreePost = postorder.slice(0, leftRootIndexInPost + 1);
  let rightSubtreePre = preorder.slice(leftRootIndexInPost + 2);
  let rightSubtreePost = postorder.slice(leftRootIndexInPost + 1, postorder.length - 1);

  let leftChildId = buildTreeFromPrePost(leftSubtreePre, leftSubtreePost, nodeIdCounter);
  let rightChildId = buildTreeFromPrePost(rightSubtreePre, rightSubtreePost, nodeIdCounter);

  addNodeAndEdgesToGraph(rootId, rootValue, leftChildId, rightChildId);
  return rootId;
}


function generarArbol() {
  nodosDataSet.clear();
  aristasDataSet.clear();

  // Configuración específica para el layout del árbol
  grafo.setOptions({
      layout: {
          hierarchical: {
              enabled: true,
              levelSeparation: 100,
              nodeSpacing: 100,
              treeSpacing: 200,
              direction: 'UD',
              sortMethod: 'directed'
          }
      },
      physics: {
          enabled: false
      }
  });

  let nodeIdCounter = { value: 1 };
  const preordenInput = document.getElementById("preordenInput").value.split(",").map(x => x.trim());
  const inordenInput = document.getElementById("inordenInput").value.split(",").map(x => x.trim());
  const postordenInput = document.getElementById("postordenInput").value.split(",").map(x => x.trim());

  let treeBuilt = false;
  let son3=true;

  if (preordenInput.length > 0 && inordenInput.length > 0 ) {
    buildTreeFromPreIn([...preordenInput], [...inordenInput], nodeIdCounter);
    treeBuilt = true;
    son3=false;
}
if (inordenInput.length > 0 && postordenInput.length > 0) {
  buildTreeFromInPost([...inordenInput], [...postordenInput], nodeIdCounter);
  treeBuilt = true;
}
  if (preordenInput.length > 0 && postordenInput.length > 0 && !treeBuilt) {
      // La reconstrucción usando preorden y postorden se puede manejar si se proporciona el supuesto de que el árbol es completo
      buildTreeFromPrePost([...preordenInput], [...postordenInput], nodeIdCounter);
      treeBuilt = true;
  }
  if (preordenInput.length > 0 && inordenInput.length > 0 && postordenInput.length > 0 && !treeBuilt) {
      // Si se proporcionan todos, utilizamos preorden e inorden por ser la combinación más común para reconstrucción exacta
      buildTreeFromPreIn([...preordenInput], [...inordenInput], nodeIdCounter);
      treeBuilt = true;
  }
}

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