let grafo;
let nodosDataSet;
let aristasDataSet;
let seleccionado;
let modoEliminarArista = false;
let modoEliminarNodo = false;
let modoAgregarNodo = false; 
let modoAgregarArista = false;
let modoAgregarArista2 = false;
let btnActivos = 0;
let dobleClicEnNodoManejado = false;
let ids = 0;
let modoCambiarColorNodo = false;


function inicializarGrafo() {
  const lienzo = document.getElementById('lienzo');
  nodosDataSet = new vis.DataSet();
  aristasDataSet = new vis.DataSet();
  const data = { nodes: nodosDataSet, edges: aristasDataSet };
  const opciones = {};
  grafo = new vis.Network(lienzo, data, opciones);
  desactivarBotones();
  ids = 0;
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
    grafo.off('click', clicEnNodo2);
    modoAgregarArista2 = false;
    grafo.off('click',agregarNodo);  
    modoAgregarNodo = false; 
    grafo.off('click', cambiarColorNodo);
    modoCambiarColorNodo = false;
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

function clicEnNodo2(propiedades) {
  const { nodes } = propiedades;
  if (nodes.length > 0) {
    if (seleccionado === undefined) {
      seleccionado = nodes[0];
    } else {
      if (seleccionado !== nodes[0]) {
        aristasDataSet.add({ from: seleccionado, to: nodes[0], arrows: 'to' });
        aristasDataSet.add({ from: nodes[0], to: seleccionado, arrows: 'to' });
        seleccionado = undefined;
      } else {
        aristasDataSet.add({ from: seleccionado, to: seleccionado, arrows: 'to' });
        seleccionado = undefined;
      }
    }
  }
}





function dobleClicEnNodo(propiedades) {
  desactivarBotones();
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
  desactivarBotones();
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
  toggleButton('deleteEdgeButton');
    setActiveButton('deleteEdgeButton');
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
    toggleButton('edgeButton');
    setActiveButton('edgeButton');
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

function agregarAristaSeleccionada2(){
  if(modoAgregarArista2){
      btnActivos--;
      modoAgregarArista2 = false;
      grafo.off('click', clicEnNodo2);
  }
  else{
      if(btnActivos > 0){
          desactivarBotones();
      }
      btnActivos++;
      modoAgregarArista2 = true;
      grafo.on('click', clicEnNodo2);
  }
  
}


function agregarNodoSeleccionado(){
    toggleButton('nodeButton');
    setActiveButton('nodeButton');
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
    nodosDataSet.add({ id: ids, label: 'Nodo ' + (ids + 1 ), x: event.pointer.canvas.x, y: event.pointer.canvas.y });
    ids++;
}

  



function eliminarNodoSeleccionado() {
    toggleButton('deleteNodeButton');
    setActiveButton('deleteNodeButton');
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
    const aristasAEliminar = aristasDataSet.get({ filter: item => item.from === nodeId || item.to === nodeId });
    nodosDataSet.remove({ id: nodeId });
    aristasAEliminar.forEach(arista => {
        aristasDataSet.remove({ id: arista.id });
    });

    
}






function generarMatriz() {
  desactivarBotones();
  const nodos = nodosDataSet.get({ fields: ['id', 'label'] });
  const matriz = [];
  const matrizObj = {};
  nodos.forEach(nodo => {
    matrizObj[nodo.id] = {};
  });
  const aristasArr = aristasDataSet.get();
  aristasArr.forEach((arista) => {
    const value = parseInt(arista.label || 1);
    matrizObj[arista.from][arista.to] = value;
  });
  nodos.forEach(nodo => {
    const fila = [];
    nodos.forEach(otroNodo => {
      fila.push(matrizObj[nodo.id][otroNodo.id] || 0); 
    });
    matriz.push(fila);
  });
  mostrarMatriz(nodos, matriz);
}

function mostrarMatriz(nodos, matriz) {
  
  const contenedorMatriz = document.getElementById('matriz');
  if(nodos.length > 0){
  let html = '<h2>Matriz de Adyacencia</h2>';
  let entradas=[];
  html += '<table>';
  html += '<tr><th></th>';
  let columna = 0;
  nodos.forEach((nodo, index) => {
    html += `<th>${nodo.label}</th>`;
    entradas[columna] = 0;
    columna++;
  });
  html += '<th>Grado de salida</th>';
  html += '</tr>';
 
  matriz.forEach((fila, index) => {
    html += `<tr><th>${nodos[index].label}</th>`;
    let salidas = 0;
    columna = 0;
    fila.forEach(valor => {
      html += `<td>${valor}</td>`;
      if(valor != 0){
        salidas++;
        entradas[columna]++;
      }
      columna++;
    });
    
    html += `<td>${salidas}</td>`;
  });
  html += '</tr><th>Grado de Entrada</th>';
  columna = 0;
  entradas.forEach(element => {
    html += `<td>${element}</td>`;
    if(element > 0){
      columna += element;
    }
  });
  html += `<th>${columna}</th>`;
  html += '<tr>'
  html += '</table>';
  contenedorMatriz.innerHTML = html;
  }
}

function limpiar(){ 
    inicializarGrafo();
}



document.addEventListener('DOMContentLoaded', () => {
  inicializarGrafo();
});