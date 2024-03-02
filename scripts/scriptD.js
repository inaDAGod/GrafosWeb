let grafo;
let nodosDataSet;
let aristasDataSet;
let seleccionado;
let modoEliminarArista = false;
let modoEliminarNodo = false;
let modoAgregarNodo = false; 
let modoAgregarArista = false;
// Función para inicializar el grafo
function inicializarGrafo() {
  const lienzo = document.getElementById('lienzo');
  nodosDataSet = new vis.DataSet();
  aristasDataSet = new vis.DataSet();
  const data = { nodes: nodosDataSet, edges: aristasDataSet };
  const opciones = {};
  grafo = new vis.Network(lienzo, data, opciones);

  // Eventos del grafo
  
  grafo.on('doubleClick', dobleClicEnArista);

}


function clicEnNodo(propiedades) {
  const { nodes } = propiedades;
  if (nodes.length > 0) {
    if (seleccionado === undefined) {
      seleccionado = nodes[0];
    } else {
      if (seleccionado !== nodes[0]) {
        aristasDataSet.add({ from: seleccionado, to: nodes[0], arrows: 'to' });
        seleccionado = undefined;
      } else {
        aristasDataSet.add({ from: seleccionado, to: seleccionado, arrows: 'to' });
        seleccionado = undefined;
      }
    }
  }
}


// Función para manejar el doble clic en una arista
function dobleClicEnArista(propiedades) {
  const { edges } = propiedades;
  if (edges.length > 0) {
    // Se pide al usuario que ingrese un valor para la arista
    const valor = prompt('Ingrese el valor para la conexión:', '');
    if (valor !== null) {
      // Se actualiza la arista con el valor ingresado
      aristasDataSet.update({ id: edges[0], label: valor });
    }
  }
}

// Función para activar o desactivar el modo de eliminar arista
function eliminarAristaSeleccionada() {
    if (modoEliminarArista) {
        // Si el modo de eliminar arista está activado, desactívalo
        modoEliminarArista = false;
        grafo.off('click', eliminarArista);
    } else {
        // Si el modo de eliminar arista no está activado, actívalo
        modoEliminarArista = true;
        grafo.on('click', eliminarArista);
    }
}

// Función para eliminar una arista al hacer clic en ella
function eliminarArista(event) {
    const edgeId = event.edges[0]; // Obtener el ID de la arista clicada
    aristasDataSet.remove({ id: edgeId }); // Eliminar la arista del dataset
}


function agregarAristaSeleccionada(){
    if(modoAgregarArista){
        modoAgregarArista = false;
        grafo.off('click', clicEnNodo);
    }
    else{
        modoAgregarArista = true;
        grafo.on('click', clicEnNodo);
    }
    
}

function agregarNodoSeleccionado(){
    if(modoAgregarNodo){
        modoAgregarNodo = false;
        grafo.off('click',agregarNodo);   
    }
    else{
        modoAgregarNodo = true;
        grafo.on('click',agregarNodo);  
    }
}

function agregarNodo(event){
    nodosDataSet.add({ id: nodosDataSet.length + 1, label: 'Nodo ' + (nodosDataSet.length + 1), x: event.pointer.canvas.x, y: event.pointer.canvas.y });
}

  

// Función para cambiar el nombre de un nodo seleccionado
function cambiarNombre() {
  if (seleccionado !== undefined) {
    const nuevoNombre = prompt('Ingrese el nuevo nombre para el nodo:', seleccionado.label);
    if (nuevoNombre !== null) {
      nodosDataSet.update({ id: seleccionado, label: nuevoNombre });
    }
    seleccionado = undefined; // Esta línea establece que no hay ningún nodo seleccionado después de cambiar el nombre
  } else {
    alert('Por favor, seleccione un nodo primero.');
  }
}

function eliminarNodoSeleccionado() {
    if (modoEliminarNodo) {
        // Si el modo de eliminar nodo está activado, desactívalo
        modoEliminarNodo = false;
        grafo.off('click', eliminarNodo);
    } else {
        // Si el modo de eliminar nodo no está activado, actívalo
        modoEliminarNodo = true;
        grafo.on('click', eliminarNodo);
    }
}

// Función para eliminar un nodo al hacer clic en él
function eliminarNodo(event) {
    const nodeId = event.nodes[0]; // Obtener el ID del nodo clicado
    nodosDataSet.remove({ id: nodeId }); // Eliminar el nodo del dataset
}

// Función para eliminar una arista por su ID



// Función para generar la matriz de adyacencia
function generarMatriz() {
  const nodos = nodosDataSet.get({ fields: ['id', 'label'] });
  const matriz = [];
  nodos.forEach(nodo => {
    const fila = [];
    nodos.forEach(otroNodo => {
      const conexion = aristasDataSet.get({
        filter: edge =>
          (edge.from === nodo.id && edge.to === otroNodo.id)
      });
      if (conexion.length > 0) {
        // Asignar valor numérico a la conexión
        fila.push(parseInt(conexion[0].label || 1));
      } else {
        fila.push(0); // Sin conexión
      }
    });
    matriz.push(fila);
  });
  mostrarMatriz(nodos, matriz);
}

// Función para mostrar la matriz de adyacencia en el DOM
function mostrarMatriz(nodos, matriz) {
  const contenedorMatriz = document.getElementById('matriz');
  let html = '<h2>Matriz de Adyacencia</h2>';
  html += '<table>';
  // Encabezados de columna
  html += '<tr><th></th>';
  nodos.forEach((nodo, index) => {
    html += `<th>${nodo.label}</th>`;
  });
  html += '</tr>';
  // Contenido de la matriz
  matriz.forEach((fila, index) => {
    html += `<tr><th>${nodos[index].label}</th>`;
    fila.forEach(valor => {
      html += `<td>${valor}</td>`;
    });
    html += '</tr>';
  });
  html += '</table>';
  contenedorMatriz.innerHTML = html;
}

function limpiar(){
    inicializarGrafo();
}
// Inicializar el grafo cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  inicializarGrafo();
});
