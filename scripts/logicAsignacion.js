let grafo;
let nodosDataSet;
let aristasDataSet;
let seleccionado;
let modoEliminarArista = false;
let modoEliminarNodo = false;
let modoAgregarNodoOferta = false; 
let modoAgregarNodoDemanda= false; 
let modoAgregarArista = false;
let btnActivos = 0;
let dobleClicEnNodoManejado = false;
let idsOferta = 0;
let idsDemanda = 0; 
let nodoSeleccionadoId = null;

let buttonStates = {
    nodeOfertaButton: false,
    nodeDemandaButton: false,
    edgeButton: false,
    deleteEdgeButton: false,
    matrixButton: false,
    saveButton: false,
    deleteNodeButton: false
};

function toggleButton(buttonId) {
    var button = document.getElementById(buttonId);
    button.classList.toggle('active');
}
function setActiveButton(buttonId) {
    for (const key in buttonStates) {
        if (key !== buttonId && buttonStates[key]) {
            toggleButton(key);
            buttonStates[key] = false;
        }
    }
    buttonStates[buttonId] = !buttonStates[buttonId];
}

function toggleActiveState(buttonId) {
    buttonStates[buttonId] = !buttonStates[buttonId];
}
function inicializarGrafo() {
    const lienzo = document.getElementById('lienzo');
    nodosDataSet = new vis.DataSet();
    aristasDataSet = new vis.DataSet();
    const data = { nodes: nodosDataSet, edges: aristasDataSet };
    const opciones = {
        nodes: {
            shape: 'dot',
            size: 20,
            borderWidth: 2,
            font: {
                size: 14
            }
        },
        edges: {
            width: 2,
            smooth: {
                type: 'continuous'
            }
        }
    };
    grafo = new vis.Network(lienzo, data, opciones);
    desactivarBotones();
    desactivarBotones2();
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
    grafo.off('click', agregarNodoOferta);
    modoAgregarNodoOferta = false; 
    grafo.off('click', agregarNodoDemanda);  
    modoAgregarNodoDemanda = false;
    btnActivos = 0;
    for (const key in buttonStates) {
        if (buttonStates[key]) {
            toggleButton(key);
            buttonStates[key] = false;
        }
    }
}

function desactivarBotones2() {
    for (const key in buttonStates) {
        if (buttonStates[key]) {
            toggleButton(key);
            buttonStates[key] = false;
        }
    }
}


function clicEnNodo(propiedades) {
    console.log('clic en nodo');
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
    console.log('clic en nodo 2');
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
    console.log('Doble clic en nodo');
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
    console.log('Doble clic en arista');
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
function agregarNodoOfertaSeleccionado() {
    const buttonId = 'nodeOfertaButton';
    toggleButton(buttonId);
    setActiveButton(buttonId);
    toggleActiveState(buttonId);
    if (modoAgregarNodoOferta) {
        btnActivos--;
        modoAgregarNodoOferta = false;
        grafo.off('click', agregarNodoOferta);
    } else {
        if (btnActivos > 0) {
            desactivarBotones();
        }
        btnActivos++;
        modoAgregarNodoOferta = true;
        grafo.on('click', agregarNodoOferta);
    }
}

function agregarNodoDemandaSeleccionado() {
    const buttonId = 'nodeDemandaButton';
    toggleButton(buttonId);
    setActiveButton(buttonId);
    toggleActiveState(buttonId);
    if (modoAgregarNodoDemanda) {
        btnActivos--;
        modoAgregarNodoDemanda = false;
        grafo.off('click', agregarNodoDemanda);
    } else {
        if (btnActivos > 0) {
            desactivarBotones();
        }
        btnActivos++;
        modoAgregarNodoDemanda = true;
        grafo.on('click', agregarNodoDemanda);
    }
}


function agregarNodoOferta(event) {
    nodosDataSet.add({ id: 'oferta_' + idsOferta, label: 'Nodo Oferta ' + (idsOferta + 1), x: event.pointer.canvas.x, y: event.pointer.canvas.y, group: 'oferta', color: '#FFD700' }); // Amarillo
    idsOferta++;
}

function agregarNodoDemanda(event) {
    nodosDataSet.add({ id: 'demanda_' + idsDemanda, label: 'Nodo Demanda ' + (idsDemanda + 1), x: event.pointer.canvas.x, y: event.pointer.canvas.y, group: 'demanda', color: '#ADD8E6' }); // Celeste
    idsDemanda++;
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

function eliminarNodo(event) {
    const nodeId = event.nodes[0]; 
    const aristasAEliminar = aristasDataSet.get({ filter: item => item.from === nodeId || item.to === nodeId });
    nodosDataSet.remove({ id: nodeId });
    aristasAEliminar.forEach(arista => {
        aristasDataSet.remove({ id: arista.id });
    });
}
function eliminarArista(event) {
    const edgeId = event.edges[0]; 
    aristasDataSet.remove({ id: edgeId }); 
}

function limpiar(){  
    inicializarGrafo();
    
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarGrafo();
    // Agregar event listeners para los eventos de doble clic en nodos y aristas
    grafo.on('doubleClick', dobleClicEnNodo);
    grafo.on('doubleClick', dobleClicEnArista);
});

  