
let nodoSeleccionadoId = null;

let buttonStates = {
    nodeButton: false,
    edgeButton: false,
    edge2Button: false,
    deleteEdgeButton: false,
    matrixButton: false,
    importButton: false,
    exportButton: false,
    saveButton: false,
    cargarArchivo: false,
    descargar: false,
    cleanAllButton: false,
    deleteNodeButton: false
};
function toggleButton(buttonId) {
    var button = document.getElementById(buttonId);
    button.classList.toggle('active'); // Toggle the 'active' class
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
function desactivarBotones2() {
    for (const key in buttonStates) {
        if (buttonStates[key]) {
            toggleButton(key);
            buttonStates[key] = false;
        }
    }
}



/*
function dobleClicEnNodo(propiedades) {
    const { nodes } = propiedades;
    if (nodes.length > 0) {
        const nodeId = nodes[0];
        mostrarHerramientas(nodeId);
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

*/






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


//Prueba en importar y exportar archivos json
// Función para guardar el estado del grafo como archivo JSON y permitir su descarga
function guardarGrafo() {
    const estadoGrafo = {
      nodos: nodosDataSet.get({ fields: ['id', 'label', 'x', 'y', 'color'] }),
      aristas: aristasDataSet.get({ fields: ['id', 'from', 'to', 'label'] })
    };
    const estadoJSON = JSON.stringify(estadoGrafo);
    
    // Crear un objeto Blob con el JSON
    const blob = new Blob([estadoJSON], { type: 'application/json' });
    
    // Crear una URL del Blob y asignarla al enlace de descarga
    const url = URL.createObjectURL(blob);
    const enlaceDescargar = document.getElementById('descargar');
    enlaceDescargar.href = url;
  }
  
  // Función para cargar el estado del grafo desde un archivo JSON
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
  
  // Función para cargar el estado del grafo desde un objeto JSON
  function cargarGrafoDesdeJSON(estadoJSON) {
    limpiar(); // Limpiar el grafo antes de cargar el nuevo estado
    const estadoGrafo = JSON.parse(estadoJSON);
    // Agregar nodos al DataSet
    estadoGrafo.nodos.forEach(nodo => {
      nodosDataSet.add({
        id: nodo.id,
        label: nodo.label,
        x: nodo.x,
        y: nodo.y,
        color: nodo.color
      });
    });
    // Agregar aristas al DataSet
    estadoGrafo.aristas.forEach(arista => {
      aristasDataSet.add({
        id: arista.id,
        from: arista.from,
        to: arista.to,
        label: arista.label
      });
    });
  }
  
  // Evento para escuchar cuando se selecciona un archivo para cargar
  function importarArchivo() {
    const inputCargar = document.getElementById('cargarArchivo');
    inputCargar.click();
}

// Evento para escuchar cuando se selecciona un archivo para cargar
const inputCargar = document.getElementById('cargarArchivo');
inputCargar.addEventListener('change', cargarGrafo);

  
  // Prueba de guardado (al hacer clic en el botón Descargar)
  const btnDescargar = document.getElementById('descargar');
  btnDescargar.addEventListener('click', guardarGrafo);

  