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
  toggleButton('edge2Button');
  setActiveButton('edge2Button');
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

function openColorPicker() {
  desactivarBotones();
  desactivarBotones2();
  var colorSelector = document.getElementById('colorSelector');
  colorSelector.click(); // Simular clic en el input de color
  const color = document.getElementById('colorSelector').value;
  const lienzo = document.getElementById('lienzo');
  lienzo.style.backgroundColor = color;
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
  desactivarBotones2();
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
  desactivarBotones();
  desactivarBotones2();
  const contenedorMatriz = document.getElementById('matriz');
  if(nodos.length > 0){
  let html = '<h2>Matriz de Adyacencia</h2>';
  let entradas=[];
  let entradas2=[];
  html += '<table>';
  html += '<tr><th style = " background: #473179;"></th>';
  let columna = 0;
  nodos.forEach((nodo, index) => {
    html += `<th style = " background: #9E7DD4;">${nodo.label}</th>`;
    entradas[columna] = 0;
    entradas2[columna] = 0;
    columna++;
  });
  html += '<th style = " background: #FBAD41;">Grado de salida</th><th style = " background: #FD918F;">Suma de salida</th>';
  html += '</tr>';
 
  matriz.forEach((fila, index) => {
    html += `<tr><th style = " background: #9E7DD4;">${nodos[index].label}</th>`;
    let salidas = 0;
    let salida = 0;
    columna = 0;
    fila.forEach(valor => {
      html += `<td style = " background: #BCB9D8;">${valor}</td>`;
      if(valor != 0){
        salidas++;
        salida+=valor;
        entradas[columna]++;
        entradas2[columna]+=valor;
      }
      columna++;
    });
    
    html += `<th style = " background: #fdd092;">${salidas}</th>`;
    html += `<th style = " background: #f8b3b2;">${salida}</th>`;
  });
  
  html += '</tr><th style = " background: #FBAD41;">Grado de Entrada</th>';
  columna = 0;
  entradas.forEach(element => {
    html += `<th style = " background: #fdd092;">${element}</th>`;
    if(element > 0){
      columna += element;
    }
  });
  html += `<th style = " background: #f8be6d;">${columna}</th>`;
  html += '<th style = " background: #f8b3b2;"></th>';
  html += '<tr>'
  html += '</tr><th style = " background: #FD918F;">Suma de Entrada</th>';
  columna = 0;
  entradas2.forEach(element => {
    html += `<th style = " background: #f8b3b2;">${element}</th>`;
    if(element > 0){
      columna += element;
    }
  });
  html += '<th style = " background: #f8b3b2;"></th>';
  html += `<th style = " background: #fd9a98;">${columna}</th>`;
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


//-------------------------------------------------------


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

function openHelpPage() {
  desactivarBotones();
  desactivarBotones2();
  var helpPageURL = 'help.html';
  window.open(helpPageURL, 'helpPage', 'width=800,height=500,top=100,left=100,resizable=yes,scrollbars=yes');
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
  desactivarBotones();
  desactivarBotones2();
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
  enlace.download = 'informacion.json';
  enlace.href = url;
  enlace.click();
  URL.revokeObjectURL(url);
}


function openColorPicker() {
    var colorSelector = document.getElementById('colorSelector');
    colorSelector.click(); 
}


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
            color: nodo.color
        });
        if(nodo.id > nodosMayor){
          nodosMayor = nodo.id;
        }
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
    ids = nodosMayor + 1;
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

  