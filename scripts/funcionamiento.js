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
let modoCambiarColorNodo = false;
let nodoSeleccionadoId = null;

function toggleButton(buttonId) {
    var button = document.getElementById(buttonId);
    button.classList.toggle('active'); // Toggle the 'active' class
}

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



function dobleClicEnNodo(propiedades) {
    const { nodes } = propiedades;
    if (nodes.length > 0) {
        const nodeId = nodes[0];
        // Muestra las herramientas para editar el nodo
        mostrarHerramientas(nodeId);
    }
}


function nombreNodo(propiedades) {
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
    toggleButton('deleteEdgeButton');
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
    toggleButton('nodeButton');
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
    toggleButton('deleteNodeButton');
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
//Prueba color de nodo
function cambiarColorNodo(event) {
    const nodeId = event.nodes[0];
    if (nodeId !== undefined && nodeId === nodoSeleccionadoId) {
        const color = document.getElementById('colorSelectorNode').value;
        nodosDataSet.update({ id: nodeId, color: { background: color, border: color } });
    }
}

function cambiarColorNodoSeleccionado() {
    const colorSelectorNode = document.getElementById('colorSelectorNode');

    if (modoCambiarColorNodo) {
        // Desactivar el modo de cambiar color del nodo
        btnActivos--;
        modoCambiarColorNodo = false;
        grafo.off('click'); // Desactivar todos los eventos de clic en el grafo
        colorSelectorNode.style.display = 'none'; // Ocultar el selector de color
        nodoSeleccionadoId = null; // Reiniciar el nodo seleccionado
    } else {
        if (btnActivos > 0) {
            // Si hay otros botones activos, desactivarlos
            desactivarBotones();
        }
        // Activar el modo de cambiar color del nodo
        btnActivos++;
        modoCambiarColorNodo = true;
        grafo.on('click', function (event) {
            const nodeId = event.nodes[0];
            if (nodeId !== undefined) {
                // Si se hizo clic en un nodo, cambiar su color
                colorSelectorNode.style.display = 'inline-block'; // Mostrar el selector de color
                colorSelectorNode.onchange = function () {
                    const color = colorSelectorNode.value;
                    nodosDataSet.update({ id: nodeId, color: { background: color, border: color } });
                    colorSelectorNode.style.display = 'none'; // Ocultar el selector de color
                    nodoSeleccionadoId = null; // Reiniciar el nodo seleccionado después de la actualización
                };

                // Actualizar el nodo seleccionado
                nodoSeleccionadoId = nodeId;
            }
        });
    }
}

//fin prueba
document.addEventListener('DOMContentLoaded', () => {
  inicializarGrafo();
});

// Función para exportar la información a un archivo JSON
function exportarAJSON() {
    // Obtener la información de los nodos y aristas
    const nodos = nodosDataSet.get({ returnType: "Object" });
    const aristas = aristasDataSet.get({ returnType: "Object" });

    // Crear un objeto que contenga la información a guardar
    const informacion = {
        nodos: nodos,
        aristas: aristas
    };

    // Convertir la información en formato JSON
    const informacionJSON = JSON.stringify(informacion, null, 2);

    // Crear un objeto Blob con el contenido JSON
    const blob = new Blob([informacionJSON], { type: 'application/json' });

    // Crear una URL para el Blob
    const url = URL.createObjectURL(blob);

    // Crear un enlace para descargar el archivo JSON
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'informacion.json';

    // Agregar el enlace al cuerpo del documento y hacer clic en él para iniciar la descarga
    document.body.appendChild(enlace);
    enlace.click();

    // Liberar los recursos del objeto URL
    URL.revokeObjectURL(url);
}
