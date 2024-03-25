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
    matrixAsignacionButton: false,
    saveButton: false,
    deleteNodeButton: false
};

let maximizationMode = true;
function inicializarGrafo() {
    const lienzo = document.getElementById('lienzo');
    nodosDataSet = new vis.DataSet();
    aristasDataSet = new vis.DataSet();
    const data = { nodes: nodosDataSet, edges: aristasDataSet };
    const opciones = {};
    grafo = new vis.Network(lienzo, data, opciones);
    desactivarBotones();
    desactivarBotones2();
    ids = 0;
    grafo.on('doubleClick', dobleClicEnNodo);
    grafo.on('doubleClick', dobleClicEnArista);
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
}
function desactivarBotones2() {
    for (const key in buttonStates) {
        if (buttonStates[key]) {
            toggleButton(key);
            buttonStates[key] = false;
        }
    }
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
    console.log("Se está generando la matriz de asignación");
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

    if (maximizationMode) { //optimizacion por maximizacion
        // Paso 1: Restar el máximo de cada columna
        let html = `<h2>MAXIMIZACIÓN</h2>`;
        const matrizResultantePaso1 = restarMaximoPorColumna(matrizCostos);
        mostrarMatrizAsignacionPaso(nodosOrigen, nodosDestino, matrizResultantePaso1, 1);
        // Paso 2: Restar el máximo de cada fila utilizando la matriz resultante del paso 1
        const matrizResultantePaso2 = restarMaximoPorFila(matrizResultantePaso1); // Pasar la matriz resultante como argumento
        mostrarMatrizAsignacionPaso(nodosOrigen, nodosDestino, matrizResultantePaso2, 2);
    } else { //optimizacion por minimizacion
        let html = `<h2>MINIMIZACIÓN</h2>`;
        const matrizResultantePaso1 = restarMinimoPorColumna(matrizCostos);
        mostrarMatrizAsignacionPaso(nodosOrigen, nodosDestino, matrizResultantePaso1, 1);
        const matrizResultantePaso2 = restarMinimoPorFila(matrizResultantePaso1);
        mostrarMatrizAsignacionPaso(nodosOrigen, nodosDestino, matrizResultantePaso2, 2);
    }
}

function mostrarMatrizAsignacionPaso(nodosOrigen, nodosDestino, matriz, paso) {
    desactivarBotones();
    desactivarBotones2();
    const contenedorMatriz = document.getElementById('matriz');
    if (nodosOrigen.length > 0 && nodosDestino.length > 0) {
        let html = `<h2>Matriz de Asignación (Paso ${paso})</h2>`;
        html += '<table>';
        html += '<tr><th></th>';
        for (let j = 0; j < nodosDestino.length; j++) {
            html += `<th>${nodosDestino[j].label}</th>`;
        }
        html += '</tr>';
        for (let i = 0; i < matriz.length; i++) {
            html += `<tr><th>${nodosOrigen[i].label}</th>`;
            for (let j = 0; j < matriz[i].length; j++) {
                html += `<td>${matriz[i][j] || 0}</td>`;
            }
            html += '</tr>';
        }
        html += '</table>';
        contenedorMatriz.innerHTML += html; // Cambia esto a '+=' para concatenar las matrices en lugar de reemplazarlas
    }
}

function restarMaximoPorColumna(matriz) {
    console.log("Paso 1");
    const n = matriz.length;
    const maximosColumna = Array(n); // Inicializar vector
    for (let i = 0; i < n; i++) {
        maximosColumna[i] = -Infinity; // Inicializar cada elemento con -Infinity
    }

    // Encontrar el máximo de cada columna y almacenarlo en su posición correspondiente
    console.log("Maximos");
    for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
            console.log(Math.max(maximosColumna[j], matriz[i][j]));
            maximosColumna[j] = Math.max(maximosColumna[j], matriz[i][j]);
        }
    }
    // Crear la matriz resultante
    const matrizResultante = [];
    console.log("Restas");
    for (let i = 0; i < n; i++) {
        const filaResultante = [];
        for (let j = 0; j < n; j++) {
            console.log("nuevo");
            console.log(matriz[i][j]);
            console.log("-");
            console.log(maximosColumna[j]);
            filaResultante.push(matriz[i][j] - maximosColumna[j]); // Restar el máximo de la columna j a cada elemento de la fila i
        }
        matrizResultante.push(filaResultante);
    }

    return matrizResultante;
}
function restarMaximoPorFila(matriz) {
    console.log("Paso 2");
    const n = matriz.length;
    const maximosFila = Array(n); // Inicializar vector
    for (let i = 0; i < n; i++) {
        maximosFila[i] = -Infinity; // Inicializar cada elemento con -Infinity
    }

    // Encontrar el máximo de cada fila y almacenarlo en su posición correspondiente
    console.log("Maximos fila");
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            console.log(Math.max(maximosFila[i], matriz[i][j]));
            maximosFila[i] = Math.max(maximosFila[i], matriz[i][j]);
        }
    }
    // Crear la matriz resultante
    const matrizResultante = [];
    console.log("Restas");
    for (let i = 0; i < n; i++) {
        const filaResultante = [];
        for (let j = 0; j < n; j++) {
            console.log("nuevo");
            console.log(matriz[i][j]);
            console.log("-");
            console.log(maximosFila[i]);
            filaResultante.push(matriz[i][j] - maximosFila[i]); // Restar el máximo de la columna j a cada elemento de la fila i
        }
        matrizResultante.push(filaResultante);
    }
    return matrizResultante;
}

function restarMinimoPorColumna(matriz) {
    console.log("Paso 1");
    const n = matriz.length;
    const minimosColumna = Array(n); // Inicializar vector
    for (let i = 0; i < n; i++) {
        minimosColumna[i] = Infinity; // Inicializar cada elemento con Infinity para que cualquier número sea menor
    }

    // Encontrar el mínimo de cada columna y almacenarlo en su posición correspondiente
    console.log("Mínimos");
    for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
            console.log(Math.min(minimosColumna[j], matriz[i][j]));
            minimosColumna[j] = Math.min(minimosColumna[j], matriz[i][j]);
        }
    }
    // Crear la matriz resultante
    const matrizResultante = [];
    console.log("Restas");
    for (let i = 0; i < n; i++) {
        const filaResultante = [];
        for (let j = 0; j < n; j++) {
            console.log("nuevo");
            console.log(matriz[i][j]);
            console.log("-");
            console.log(minimosColumna[j]);
            filaResultante.push(matriz[i][j] - minimosColumna[j]); // Restar el mínimo de la columna j a cada elemento de la fila i
        }
        matrizResultante.push(filaResultante);
    }

    return matrizResultante;
}

function restarMinimoPorFila(matriz) {
    console.log("Paso 2");
    const n = matriz.length;
    const minimosFila = Array(n); // Inicializar vector
    for (let i = 0; i < n; i++) {
        minimosFila[i] = Infinity; // Inicializar cada elemento con Infinity para que cualquier número sea menor
    }

    // Encontrar el mínimo de cada fila y almacenarlo en su posición correspondiente
    console.log("Mínimos fila");
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            console.log(Math.min(minimosFila[i], matriz[i][j]));
            minimosFila[i] = Math.min(minimosFila[i], matriz[i][j]);
        }
    }
    // Crear la matriz resultante
    const matrizResultante = [];
    console.log("Restas");
    for (let i = 0; i < n; i++) {
        const filaResultante = [];
        for (let j = 0; j < n; j++) {
            console.log("nuevo");
            console.log(matriz[i][j]);
            console.log("-");
            console.log(minimosFila[i]);
            filaResultante.push(matriz[i][j] - minimosFila[i]); // Restar el mínimo de la fila i a cada elemento de la fila i
        }
        matrizResultante.push(filaResultante);
    }
    return matrizResultante;
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
    toggleButton('nodeOrigenButton');
    setActiveButton('nodeOrigenButton');
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
    toggleButton('nodeDestinoButton');
    setActiveButton('nodeDestinoButton');
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
    nodosDataSet.add({ id: 'origen_' + idsOrigen, label: 'Origen ' + (idsOrigen + 1), x: event.pointer.canvas.x, y: event.pointer.canvas.y, group: 'origen', color: '#FFD700' }); // Amarillo
    idsOrigen++;
}

function agregarNodoDestino(event) {
    nodosDataSet.add({ id: 'destino_' + idsDestino, label: 'Destino ' + (idsDestino + 1), x: event.pointer.canvas.x, y: event.pointer.canvas.y, group: 'destino', color: '#ADD8E6' }); // Celeste
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
    const nodosOrigen = nodos.filter(nodo => nodo.group === 'origen');
    const nodosDestino = nodos.filter(nodo => nodo.group === 'destino');
    
    if (nodosOrigen.length === 0 || nodosDestino.length === 0) {
        alert('Debes agregar al menos un nodo de tipo origen y un nodo de tipo destino.');
        return;
    }

    if (nodosOrigen.length !== nodosDestino.length) {
        alert('La cantidad de nodos de origen debe ser igual a la cantidad de nodos de destino para generar una matriz de adyacencia cuadrada.');
        return;
    }

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


// COLOR PICKER Y HELP PAGE
function openColorPicker() {
    var colorSelector = document.getElementById('colorSelector');
    colorSelector.click(); 
}
function openColorPicker() {
    desactivarBotones();
    desactivarBotones2();
    var colorSelector = document.getElementById('colorSelector');
    colorSelector.click(); // Simular clic en el input de color
    const color = document.getElementById('colorSelector').value;
    const lienzo = document.getElementById('lienzo');
    lienzo.style.backgroundColor = color;
}
function cambiarColorLienzo() {
    const color = document.getElementById('colorSelector').value;
    const lienzo = document.getElementById('lienzo');
    lienzo.style.backgroundColor = color;
}
function openHelpPage() {
    // Especifica la URL de la página de ayuda
    var helpPageURL = 'help.html';
    // Abre una nueva ventana emergente
    window.open(helpPageURL, 'helpPage', 'width=800,height=500,top=100,left=100,resizable=yes,scrollbars=yes');
}


//IMPORTACION Y EXPORTACION
function guardarGrafo() {
    let nombreArchivo = prompt("Por favor, ingrese el nombre del archivo:", "grafoNodolandia.json");
  
    if (nombreArchivo != null) {
        let estadoGrafo = {
            nodos: nodosDataSet.get({ fields: ['id', 'label', 'x', 'y', 'color'] }),
            aristas: aristasDataSet.get({ fields: ['id', 'from', 'to', 'label', 'arrows'] })
        };
        let estadoJSON = JSON.stringify(estadoGrafo);
        let blob = new Blob([estadoJSON], { type: 'application/json' });
        let url = URL.createObjectURL(blob);
  
        let enlace = document.createElement('a');
        enlace.download = nombreArchivo;
        enlace.href = url;
        enlace.click();
        URL.revokeObjectURL(url);
    }
}
function cargarGrafo(event) {
    const archivo = event.target.files[0];
    if (!archivo) return;
  
    const lector = new FileReader();
    lector.onload = function() {
      const estadoJSON = lector.result;
      cargarGrafoDesdeJSON(estadoJSON);
    };
    lector.readAsText(archivo);
}
  
function cargarGrafoDesdeJSON(estadoJSON) {
    limpiar();
    const estadoGrafo = JSON.parse(estadoJSON);
    let nodosMayor = 0;
    estadoGrafo.nodos.forEach(nodo => {
        nodosDataSet.add({
            id: nodo.id,
            label: nodo.label,
            x: nodo.x,
            y: nodo.y,
            group: nodo.id.includes('origen') ? 'origen' : 'destino', // Determinar el grupo del nodo según el prefijo del ID
            color: nodo.color
        });
        const idNumerico = parseInt(nodo.id.split('_')[1]); // Obtener el número del ID para encontrar el mayor
        if(idNumerico > nodosMayor) {
            nodosMayor = idNumerico;
        }
    });

    estadoGrafo.aristas.forEach(arista => {
        aristasDataSet.add({
            id: arista.id,
            from: arista.from,
            to: arista.to,
            label: arista.label || '', // Establecer una cadena vacía si no hay etiqueta definida
            arrows: arista.arrows
        });
    });
    idsOrigen = nodosMayor + 1; // Incrementar el contador de IDs para nodos de origen
    idsDestino = nodosMayor + 1; // Incrementar el contador de IDs para nodos de destino
}
function importarArchivo() {
    const inputCargar = document.getElementById('cargarArchivo');
    inputCargar.value = ''; 
    inputCargar.click();
}
  
const inputCargar = document.getElementById('cargarArchivo');
inputCargar.addEventListener('change', cargarGrafo);
const btnDescargar = document.getElementById('descargar');
btnDescargar.addEventListener('click', guardarGrafo);