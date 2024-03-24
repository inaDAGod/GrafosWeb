let grafo;
let nodosDataSet;
let aristasDataSet;
let seleccionado;
let modoEliminarArista = false;
let modoEliminarNodo = false;
let modoAgregarNodoOrigen = false; 
let modoAgregarNodoDestino = false; 
let modoAgregarArista = false;
let btnActivos = 0;
let dobleClicEnNodoManejado = false;
let idsOrigen = 0;
let idsDestino = 0; 
let nodoSeleccionadoId = null;

let buttonStates = {
    nodeOrigenButton: false,
    nodeDestinoButton: false,
    edgeButton: false,
    deleteEdgeButton: false,
    matrixButton: false,
    saveButton: false,
    deleteNodeButton: false
};

let maximizationMode = true;
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

// ---PARA LA MATRIZ DE ASIGNACION---
function changeOptimizationMode() {
    const optimizationSelect = document.getElementById("optimizationMode");
    const selectedValue = optimizationSelect.value;
    
    if (selectedValue === "maximization") {
        maximizationMode = true;
        console.log("Optimización por maximización activada");
    } else if (selectedValue === "minimization") {
        maximizationMode = false;
        console.log("Optimización por minimización activada");
    }
}

function generarMatrizAsignacion() {
    desactivarBotones();
    desactivarBotones2();
    const nodosOrigen = nodosDataSet.get({ filter: item => item.group === 'origen' });
    const nodosDestino = nodosDataSet.get({ filter: item => item.group === 'destino' });

    const matrizCostos = [];
    const matrizAsignacion = [];

    // Llenar la matriz de costos
    nodosOrigen.forEach((origen, i) => {
        matrizCostos[i] = [];
        nodosDestino.forEach((destino, j) => {
            const arista = aristasDataSet.get({ filter: item => item.from === origen.id && item.to === destino.id });
            matrizCostos[i][j] = arista.length > 0 ? parseInt(arista[0].label) : 0;
        });
    });

    // Determinar la matriz de asignación según el modo de optimización seleccionado
    const asignacion = maximizationMode ? algoritmoHungaroMaximizacion(matrizCostos) : algoritmoHungaroMinimizacion(matrizCostos);
    actualizarMatrizAsignacion(matrizAsignacion, asignacion);

    mostrarMatrizAsignacion(nodosOrigen, nodosDestino, matrizAsignacion);
}

function actualizarMatrizAsignacion(matrizAsignacion, asignacion) {
    for (let i = 0; i < asignacion.length; i++) {
        matrizAsignacion[i] = [];
        matrizAsignacion[i][asignacion[i]] = 1;
    }
}

function mostrarMatrizAsignacion(nodosOrigen, nodosDestino, matriz) {
    desactivarBotones();
    desactivarBotones2();
    const contenedorMatriz = document.getElementById('matriz');
    if (nodosOrigen.length > 0 && nodosDestino.length > 0) {
        let html = '<h2>Matriz de Asignación</h2>';
        html += '<table>';
        html += '<tr><th></th>';
        nodosDestino.forEach(nodo => {
            html += `<th>${nodo.label}</th>`;
        });
        html += '</tr>';
        matriz.forEach((fila, index) => {
            html += `<tr><th>${nodosOrigen[index].label}</th>`;
            fila.forEach(valor => {
                html += `<td>${valor || 0}</td>`;
            });
            html += '</tr>';
        });
        html += '</table>';
        contenedorMatriz.innerHTML = html;
    }
}



// Función para aplicar el algoritmo de asignación húngaro
function algoritmoHungaroMaximizacion(costMatrix) {
    // Implementación del algoritmo de asignación húngaro para maximización
    
    const n = costMatrix.length;
    const assign = Array(n).fill(-1);
    const maxMatched = Array(n).fill(0);

    // Paso 1: Restar el mínimo de cada fila
    for (let i = 0; i < n; i++) {
        let minRow = Math.min(...costMatrix[i]);
        for (let j = 0; j < n; j++) {
            costMatrix[i][j] -= minRow;
        }
    }

    // Paso 2: Restar el mínimo de cada columna
    for (let j = 0; j < n; j++) {
        let minCol = Infinity;
        for (let i = 0; i < n; i++) {
            minCol = Math.min(minCol, costMatrix[i][j]);
        }
        for (let i = 0; i < n; i++) {
            costMatrix[i][j] -= minCol;
        }
    }

    // Paso 3: Asignar tantos 0's como sea posible
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (costMatrix[i][j] === 0 && assign[j] === -1 && maxMatched[i] === 0) {
                assign[j] = i;
                maxMatched[i] = 1;
                break;
            }
        }
    }

    return assign;
}
function algoritmoHungaroMinimizacion(costMatrix) {
    // Implementación del algoritmo de asignación húngaro para minimización

    const n = costMatrix.length;
    const assign = Array(n).fill(-1);
    const minMatched = Array(n).fill(0);

    // Paso 1: Restar el máximo de cada fila
    for (let i = 0; i < n; i++) {
        let maxRow = Math.max(...costMatrix[i]);
        for (let j = 0; j < n; j++) {
            costMatrix[i][j] = maxRow - costMatrix[i][j];
        }
    }

    // Paso 2: Restar el máximo de cada columna
    for (let j = 0; j < n; j++) {
        let maxCol = -Infinity;
        for (let i = 0; i < n; i++) {
            maxCol = Math.max(maxCol, costMatrix[i][j]);
        }
        for (let i = 0; i < n; i++) {
            costMatrix[i][j] = maxCol - costMatrix[i][j];
        }
    }

    // Paso 3: Asignar tantos 0's como sea posible
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (costMatrix[i][j] === 0 && assign[j] === -1 && minMatched[i] === 0) {
                assign[j] = i;
                minMatched[i] = 1;
                break;
            }
        }
    }

    return assign;
}


//---FUNCIONES DE AGREGAR NODOS Y ARISTAS---
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
function agregarNodoOrigenSeleccionado() {
    const buttonId = 'nodeOrigenButton';
    toggleButton(buttonId);
    setActiveButton(buttonId);
    toggleActiveState(buttonId);
    if (modoAgregarNodoOrigen) {
        btnActivos--;
        modoAgregarNodoOrigen = false;
        grafo.off('click', agregarNodoOrigen);
    } else {
        if (btnActivos > 0) {
            desactivarBotones();
        }
        btnActivos++;
        modoAgregarNodoOrigen = true;
        grafo.on('click', agregarNodoOrigen);
    }
}

function agregarNodoDestinoSeleccionado() {
    const buttonId = 'nodeDestinoButton';
    toggleButton(buttonId);
    setActiveButton(buttonId);
    toggleActiveState(buttonId);
    if (modoAgregarNodoDestino) {
        btnActivos--;
        modoAgregarNodoDestino = false;
        grafo.off('click', agregarNodoDestino);
    } else {
        if (btnActivos > 0) {
            desactivarBotones();
        }
        btnActivos++;
        modoAgregarNodoDestino = true;
        grafo.on('click', agregarNodoDestino);
    }
}

function agregarNodoOrigen(event) {
    nodosDataSet.add({ id: 'origen_' + idsOrigen, label: 'Nodo Origen ' + (idsOrigen + 1), x: event.pointer.canvas.x, y: event.pointer.canvas.y, group: 'origen', color: '#FFD700' }); // Amarillo
    idsOrigen++;
}

function agregarNodoDestino(event) {
    nodosDataSet.add({ id: 'destino_' + idsDestino, label: 'Nodo Destino ' + (idsDestino + 1), x: event.pointer.canvas.x, y: event.pointer.canvas.y, group: 'destino', color: '#ADD8E6' }); // Celeste
    idsDestino++;
}
// ---FUNCIONES DE ELIMINAR NODOS Y ARISTAS---
function eliminarNodoSeleccionado() {
    toggleButton('deleteNodeButton');
    setActiveButton('deleteNodeButton');
    if (modoEliminarNodo) {
        btnActivos--;
        modoEliminarNodo = false;
        grafo.off('click', eliminarNodo);
    } else {
        if (btnActivos > 0) {
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
        if (btnActivos > 0) {
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
// ---PARA LA MATRIZ DE ADYACENCIA---
function generarMatrizCostos() {
    desactivarBotones();
    desactivarBotones2();
    const nodos = nodosDataSet.get({ fields: ['id', 'label', 'group'] });
    const matriz = [];
    const matrizObj = {};

    nodos.forEach(nodo => {
        matrizObj[nodo.id] = {};
    });
 
    const aristasArr = aristasDataSet.get();
    aristasArr.forEach((arista) => {
        const value = parseInt(arista.label || 1);
        const nodoFromGroup = nodosDataSet.get(arista.from).group;
        const nodoToGroup = nodosDataSet.get(arista.to).group;
        if (nodoFromGroup === 'origen' && nodoToGroup === 'destino') {
            matrizObj[arista.from][arista.to] = value;
        }
    });
   
    const nodosOrigen = nodos.filter(nodo => nodo.group === 'origen');
    const nodosDestino = nodos.filter(nodo => nodo.group === 'destino');
    nodosOrigen.forEach(nodoOrigen => {
        const fila = [];
        nodosDestino.forEach(nodoDestino => {
            fila.push(matrizObj[nodoOrigen.id][nodoDestino.id] || 0);
        });
        matriz.push(fila);
    });
    mostrarMatrizCostos(nodosOrigen, nodosDestino, matriz);
}

function mostrarMatrizCostos(nodosOrigen, nodosDestino, matriz) {
    desactivarBotones();
    desactivarBotones2();
    const contenedorMatriz = document.getElementById('matriz');
    if (nodosOrigen.length > 0 && nodosDestino.length > 0) {
        let html = '<h2>Matriz de Adyacencia</h2>';
        html += '<table>';
        html += '<tr><th></th>';
        nodosDestino.forEach(nodo => {
            html += `<th>${nodo.label}</th>`;
        });
        html += '</tr>';
        matriz.forEach((fila, index) => {
            html += `<tr><th>${nodosOrigen[index].label}</th>`;
            fila.forEach(valor => {
                html += `<td>${valor}</td>`;
            });
            html += '</tr>';
        });
        html += '</table>';
        contenedorMatriz.innerHTML = html;
    }
}

function limpiar() {
    inicializarGrafo();
}


// ---PARA LOS EVENTOS DE CLICKS EN NODOS Y ARISTAS---
document.addEventListener('DOMContentLoaded', () => {
    inicializarGrafo();
    grafo.on('doubleClick', dobleClicEnNodo);
    grafo.on('doubleClick', dobleClicEnArista);
});

function clicEnNodo(propiedades) {
    console.log('clic en nodo');
    const { nodes } = propiedades;
    if (nodes.length > 0) {
        if (seleccionado === undefined) {
            seleccionado = nodes[0];
        } else {
            const grupoSeleccionado = nodosDataSet.get(seleccionado).group;
            const grupoActual = nodosDataSet.get(nodes[0]).group;
            if (grupoSeleccionado !== grupoActual && 
                ((grupoSeleccionado === 'origen' && grupoActual === 'destino'))) {
                aristasDataSet.add({ from: seleccionado, to: nodes[0], arrows: 'to' });
            }
            seleccionado = undefined;
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

//PARA LOS BOTONES ACTIVOS 
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

function desactivarBotones(){
    grafo.off('click',eliminarArista);
    modoEliminarArista = false;
    grafo.off('click', eliminarNodo);
    modoEliminarNodo = false;
    grafo.off('click', clicEnNodo);
    modoAgregarArista = false;
    grafo.off('click', clicEnNodo2);
    modoAgregarArista2 = false;
    grafo.off('click', agregarNodoOrigen);
    modoAgregarNodoOrigen = false; 
    grafo.off('click', agregarNodoDestino);  
    modoAgregarNodoDestino = false;
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