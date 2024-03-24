
let nodoSeleccionadoId = null;

let buttonStates = {
    nodeButton: false,
    nodeOfertaButton:false,
    nodeDemandaButton:false,
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
        
        btnActivos--;
        modoCambiarColorNodo = false;
        grafo.off('click'); 
        colorSelectorNode.style.display = 'none'; 
        nodoSeleccionadoId = null; 
    } else {
        if (btnActivos > 0) {
            desactivarBotones();
        }
        btnActivos++;
        modoCambiarColorNodo = true;
        grafo.on('click', function (event) {
            const nodeId = event.nodes[0];
            if (nodeId !== undefined) {
                colorSelectorNode.style.display = 'inline-block'; 
                colorSelectorNode.onchange = function () {
                    const color = colorSelectorNode.value;
                    nodosDataSet.update({ id: nodeId, color: { background: color, border: color } });
                    colorSelectorNode.style.display = 'none'; 
                    nodoSeleccionadoId = null; 
                };

               
                nodoSeleccionadoId = nodeId;
            }
        });
    }
}



function exportarAJSON() {
    desactivarBotones2();
    const nodos = nodosDataSet.get({ returnType: "Object" });
    const aristas = aristasDataSet.get({ returnType: "Object" });
    const aristasConFlechas = aristas.map(arista => {
        return {
            id: arista.id,
            from: arista.from,
            to: arista.to,
            label: arista.label,
            arrows: arista.arrows  
        };
    });

    const informacion = {
        nodos: nodos,
        aristas: aristasConFlechas  
    };

    const informacionJSON = JSON.stringify(informacion, null, 2);
    const blob = new Blob([informacionJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'informacion.json';
    document.body.appendChild(enlace);
    enlace.click();
    URL.revokeObjectURL(url);
}
function openColorPicker() {
    var colorSelector = document.getElementById('colorSelector');
    colorSelector.click(); // Simular clic en el input de color
}


function guardarGrafo() {
    desactivarBotones();
    desactivarBotones2();
    const estadoGrafo = {
      nodos: nodosDataSet.get({ fields: ['id', 'label', 'x', 'y', 'color'] }),
      aristas: aristasDataSet.get({ fields: ['id', 'from', 'to', 'label', 'arrows'] }) 
    };
    const estadoJSON = JSON.stringify(estadoGrafo);
    
    const blob = new Blob([estadoJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const enlaceDescargar = document.getElementById('descargar');
    enlaceDescargar.href = url;
}
  
  
  function cargarGrafo(event) {
    desactivarBotones();
  desactivarBotones2();
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
    desactivarBotones();
    desactivarBotones2();
    limpiar();
    const estadoGrafo = JSON.parse(estadoJSON);
    let nodosIngresados = 0;
    estadoGrafo.nodos.forEach(nodo => {
        nodosDataSet.add({
            id: nodo.id,
            label: nodo.label,
            x: nodo.x,
            y: nodo.y,
            color: nodo.color
        });
        nodosIngresados++;
    });

    estadoGrafo.aristas.forEach(arista => {
        aristasDataSet.add({
            id: arista.id,
            from: arista.from,
            to: arista.to,
            label: arista.label,
            arrows: arista.arrows
        });
    });
    
}

  
  function importarArchivo() {
    desactivarBotones();
    desactivarBotones2();
    const inputCargar = document.getElementById('cargarArchivo');
    inputCargar.value = ''; 
    inputCargar.click();
  }
  
  const inputCargar = document.getElementById('cargarArchivo');
  inputCargar.addEventListener('change', cargarGrafo);
  

  const btnDescargar = document.getElementById('descargar');
  btnDescargar.addEventListener('click', guardarGrafo);

  