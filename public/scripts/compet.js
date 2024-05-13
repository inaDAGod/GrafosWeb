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
    grafo.on('contextmenu', editarCoordenadasNodo);
    grafo.on('hoverNode', mostrarCoordenadasNodoHover);
    grafo.on('blurNode', () => {
        const divCoordenadas = document.querySelector(".coordenadas-nodo");
        if (divCoordenadas) {
            divCoordenadas.remove();
        }
    });
}

function mostrarCoordenadasNodoHover(event) {
    const nodeId = event.node;
    const nodo = nodosDataSet.get(nodeId);
    const coordenadas = "(" + nodo.x + ", " + nodo.y + ")";

    // Crear un nuevo elemento div para mostrar las coordenadas
    const coordenadasDiv = document.createElement('div');
    coordenadasDiv.textContent = coordenadas;
    coordenadasDiv.className = "coordenadas-nodo";

    // Obtener la posición del nodo en el lienzo
    const { x, y } = grafo.canvasToDOM({ x: nodo.x, y: nodo.y });

    // Establecer la posición del recuadro de coordenadas sobre el nodo
    coordenadasDiv.style.position = 'absolute';
    coordenadasDiv.style.left = (x + 20) + 'px'; // Offset de 10 píxeles desde la izquierda
    coordenadasDiv.style.top = (y - 50) + 'px'; // Offset de 30 píxeles desde arriba

    // Agregar el recuadro de coordenadas al cuerpo del documento
    document.body.appendChild(coordenadasDiv);
}

function mostrarCoordenadasNodos() {
    const nodos = nodosDataSet.get(); // Obtener todos los nodos del DataSet
    if (nodos.length === 0) {
        alert("No hay nodos en el lienzo.");
        return;
    }

    let coordenadas = "Coordenadas de los nodos:\n";
    nodos.forEach(nodo => {
        coordenadas += "Nodo " + nodo.label + ": (" + nodo.x + ", " + nodo.y + ")\n";
    });

    alert(coordenadas);
}
function editarCoordenadasNodo(propiedades) {
    const { nodes } = propiedades;
    if (nodes.length > 0) {
        const nodeId = nodes[0];
        const nuevoX = prompt('Ingrese la nueva coordenada X para el nodo:', nodosDataSet.get(nodeId).x);
        const nuevoY = prompt('Ingrese la nueva coordenada Y para el nodo:', nodosDataSet.get(nodeId).y);
        if (nuevoX !== null && nuevoY !== null) {
            nodosDataSet.update({ id: nodeId, x: parseFloat(nuevoX), y: parseFloat(nuevoY) });
        }
    }
}

function calcularPuntoMedioTotal() {
    const nodos = nodosDataSet.get(); // Obtener todos los nodos del DataSet
    if (nodos.length < 3) {
        alert("Se necesitan al menos tres nodos para calcular el punto medio total.");
        return;
    }

    let puntos = nodos.map(nodo => ({ x: nodo.x, y: nodo.y }));

    while (true) {
        let nuevosPuntos = [];
        for (let i = 0; i < puntos.length; i++) {
            for (let j = i + 1; j < puntos.length; j++) {
                let puntoMedio = calcularPuntoMedio(puntos[i], puntos[j]);
                nuevosPuntos.push(puntoMedio);
            }
        }
        if (nuevosPuntos.every(punto => punto.x === nuevosPuntos[0].x && punto.y === nuevosPuntos[0].y)) {
            alert("El punto medio total es: (" + nuevosPuntos[0].x + ", " + nuevosPuntos[0].y + ")");
            break;
        } else {
            puntos = nuevosPuntos;
        }
    }
}

// Función para calcular el punto medio entre dos puntos
function calcularPuntoMedio(punto1, punto2) {
    let x = (punto1.x + punto2.x) / 2;
    let y = (punto1.y + punto2.y) / 2;
    return { x: x, y: y };
}


