let grafo;
let nodosDataSet;
let aristasDataSet;
let seleccionado;
let modoEliminarArista = false;
let modoEliminarNodo = false;
let modoAgregarNodo = false; 
let modoAgregarArista = false;
let btnActivos = 0;
let dobleClicEnNodoManejado = false;
// Función para inicializar el grafo
function inicializarGrafo() {
  const lienzo = document.getElementById('lienzo');
  nodosDataSet = new vis.DataSet();
  aristasDataSet = new vis.DataSet();
  const data = { nodes: nodosDataSet, edges: aristasDataSet };
  const opciones = {};
  grafo = new vis.Network(lienzo, data, opciones);

  
  grafo.on('doubleClick', dobleClicEnNodo);
  grafo.on('doubleClick', dobleClicEnArista);



}

function desactivarBotones(){
    grafo.off('click',eliminarArista);
    modoEliminarArista = false;
    grafo.off('click', eliminarNodo);
    modoEliminarNodo = false;
    grafo.off('click', clicEnNodo);
    modoAgregarArista = false;
    grafo.off('click',agregarNodo);  
    modoAgregarNodo = false; 
    btnActivos = 0;
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



function dobleClicEnNodo(propiedades) {
    const { nodes } = propiedades;
    if (nodes.length > 0) {
        const nodeId = nodes[0];
        const nuevoNombre = prompt('Ingrese el nuevo nombre para el nodo:', nodosDataSet.get(nodeId).label);
        if (nuevoNombre !== null) {
            nodosDataSet.update({ id: nodeId, label: nuevoNombre });
        }
        dobleClicEnNodoManejado = true;
    }
}


function dobleClicEnArista(propiedades) {
    if (dobleClicEnNodoManejado) {
        dobleClicEnNodoManejado = false;
        return;
    }

    const { edges } = propiedades;
    if (edges.length > 0) {
        const edgeId = edges[0];
        const nuevoNombre = prompt('Ingrese el nuevo nombre para la arista:', aristasDataSet.get(edgeId).label);
        if (nuevoNombre !== null) {
            aristasDataSet.update({ id: edgeId, label: nuevoNombre });
        }
    }
}



function eliminarAristaSeleccionada() {
    if (modoEliminarArista) {
        btnActivos--;
        modoEliminarArista = false;
        grafo.off('click', eliminarArista);
    } else {
        if(btnActivos > 0){
            desactivarBotones();
        }
        btnActivos++;
        modoEliminarArista = true;
        grafo.on('click', eliminarArista);
    }
}


function eliminarArista(event) {
    const edgeId = event.edges[0]; 
    aristasDataSet.remove({ id: edgeId }); 
}


function agregarAristaSeleccionada(){
    if(modoAgregarArista){
        btnActivos--;
        modoAgregarArista = false;
        grafo.off('click', clicEnNodo);
    }
    else{
        if(btnActivos > 0){
            desactivarBotones();
        }
        btnActivos++;
        modoAgregarArista = true;
        grafo.on('click', clicEnNodo);
    }
    
}

function agregarNodoSeleccionado(){
    if(modoAgregarNodo){
        btnActivos--;
        modoAgregarNodo = false;
        grafo.off('click',agregarNodo);   
    }
    else{
        if(btnActivos > 0){
            desactivarBotones();
        }
        btnActivos++;
        modoAgregarNodo = true;
        grafo.on('click',agregarNodo);  
    }
}

function agregarNodo(event){
    nodosDataSet.add({ id: nodosDataSet.length + 1, label: 'Nodo ' + (nodosDataSet.length + 1), x: event.pointer.canvas.x, y: event.pointer.canvas.y });
}

  



function eliminarNodoSeleccionado() {
    if (modoEliminarNodo) {
        btnActivos--;
        modoEliminarNodo = false;
        grafo.off('click', eliminarNodo);
    } else {
        if(btnActivos > 0){
            desactivarBotones();
        }
        btnActivos++;
        modoEliminarNodo = true;
        grafo.on('click', eliminarNodo);
    }
}


function eliminarNodo(event) {
    const nodeId = event.nodes[0]; 
    nodosDataSet.remove({ id: nodeId }); 
}






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
        fila.push(parseInt(conexion[0].label || 1));
      } else {
        fila.push(0); 
      }
    });
    matriz.push(fila);
  });
  mostrarMatriz(nodos, matriz);
}

function mostrarMatriz(nodos, matriz) {
  const contenedorMatriz = document.getElementById('matriz');
  let html = '<h2>Matriz de Adyacencia</h2>';
  html += '<table>';
  html += '<tr><th></th>';
  nodos.forEach((nodo, index) => {
    html += `<th>${nodo.label}</th>`;
  });
  html += '</tr>';
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

//Pruebas
function cambiarColorLienzo() {
  const color = document.getElementById('colorSelector').value;
  const lienzo = document.getElementById('lienzo');
  lienzo.style.backgroundColor = color;
}

//fin prueba
document.addEventListener('DOMContentLoaded', () => {
  inicializarGrafo();
});