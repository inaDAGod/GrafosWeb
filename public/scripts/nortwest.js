let numFilas = 0;
let numColumnas = 0;
let f=0;
let c=0;
function inicializar() {
    numFilas = parseInt(document.getElementById('filas').value);
    f = numFilas;
    numColumnas = parseInt(document.getElementById('columnas').value);
    c=numColumnas;
}

document.getElementById('matrizForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente
    inicializar();

    // Obtener el div donde se colocarán los inputs de la matriz
    const matrizInputsDiv = document.getElementById('matrizInputs');
    
    // Generar los inputs de la matriz
    let matrizInputsHTML = '<table>'; // Usar una tabla para organizar los inputs y los encabezados

    // Encabezados de columnas
    matrizInputsHTML += '<tr>'; // Espacio para el encabezado de filas
    for (let j = 0; j < numColumnas; j++) {
        if(j==0){
            matrizInputsHTML += '<td></td>'
        }
        matrizInputsHTML += `<td contenteditable="true">Col ${j + 1}</td>`; // Encabezado de columna editable
    }
    matrizInputsHTML += `<td contenteditable="false">Disponibilidad</td>`; 
    matrizInputsHTML += '<td></td></tr>';

    for (let i = 0; i < numFilas; i++) {
        matrizInputsHTML += '<tr>';
        // Encabezado de fila
        matrizInputsHTML += `<td contenteditable="true">Fila ${i + 1}</td>`;
        for (let j = 0; j < numColumnas+1; j++) {
            let inputId = `valor-${i}-${j}`;
            if(j==numColumnas){
                inputId = `demanda-${i}`;
            }
            matrizInputsHTML += `<td><input type="number" id="${inputId}" name="${inputId}" min="0" value="0"></td>`;
        }
        // Botón para eliminar la fila
        matrizInputsHTML += `<td><button class="eliminarFila"  onclick="eliminarFila(this)">Eliminar Fila</button></td>`;
        matrizInputsHTML += '</tr>';
    }
    matrizInputsHTML += `<td contenteditable="true">Demanda</td>`;
    for (let j = 0; j < numColumnas; j++) {
            const inputId = `demanda-${j}`;
            matrizInputsHTML += `<td><input type="number" id="${inputId}" name="${inputId}" min="0" value="0"></td>`;
        }

    // Agregar una fila adicional al final con botones para agregar y eliminar columnas
    matrizInputsHTML += '<tr>';
    for (let j = 0; j <= numColumnas; j++) {
        if(j==0){
            matrizInputsHTML += '<td></td>'
        }
        else{
            matrizInputsHTML += `<td><button class="eliminarColumna" onclick="eliminarColumna(this)">Eliminar Columna</button></td>`;
        }
    }
    matrizInputsHTML += '</tr>';

    matrizInputsHTML += '</table>';
    // Agregar botones para agregar fila y columna
    matrizInputsHTML += '<button id="addFila">Agregar fila</button> <button id="addColumna">Agregar columna</button>';

    // Agregar los inputs de la matriz al div
    matrizInputsDiv.innerHTML = matrizInputsHTML;


    // Agregar event listeners para los botones de agregar fila y columna
    document.getElementById('addFila').addEventListener('click', function() {
        const tabla = document.querySelector('#matrizInputs table');
        agregarFila( tabla.rows.length -2, tabla.rows[0].cells.length-2 );
    });

    document.getElementById('addColumna').addEventListener('click', function() {
        const tabla = document.querySelector('#matrizInputs table');
        agregarColumna(tabla.rows[0].cells.length-2,  tabla.rows.length-2);
    });

});

function agregarFila(fila, columnas) {
    f++;
    const tabla = document.querySelector('#matrizInputs table');
    const nuevaFila = tabla.insertRow(fila); // Insertar antes de la última fila de botones
    nuevaFila.innerHTML += `<td contenteditable="true">Fila ${f}</td>`;
    for (let j = 0; j < columnas; j++) {
        const inputId = `valor-${fila - 1}-${j}`;
        nuevaFila.innerHTML += `<td><input type="number" id="${inputId}" name="${inputId}" min="0" value="0"></td>`;
    }
    nuevaFila.innerHTML += `<td><button class="eliminarFila" onclick="eliminarFila(this)">Eliminar Fila</button></td>`;
}

function eliminarFila(button) {
    const fila = button.closest('tr'); // Obtener la fila más cercana (tr) que contiene el botón
    fila.remove(); // Eliminar la fila de la tabla
}

function agregarColumna(columna, filas) {
    c++;
    const tabla = document.querySelector('#matrizInputs table');

    // Insertar celda de encabezado en la primera fila
    const encabezadoColumna = document.createElement('td');
    encabezadoColumna.contentEditable = true;
    encabezadoColumna.textContent = `Col ${c}`;
    tabla.rows[0].insertBefore(encabezadoColumna, tabla.rows[0].cells[columna]);

    // Insertar celdas de input en cada fila
    for (let i = 1; i <= filas; i++) {
        const nuevaCelda = document.createElement('td');
        const inputId = `valor-${i - 1}-${columna-1}`;
        nuevaCelda.innerHTML = `<input type="number" id="${inputId}" name="${inputId}" min="0" value="0">`;
        tabla.rows[i].insertBefore(nuevaCelda, tabla.rows[i].cells[columna]);
    }

    // Insertar botón de eliminar columna en la última fila
    const nuevaCeldaBoton = document.createElement('td');
    nuevaCeldaBoton.innerHTML = `<button class="eliminarColumna" onclick="eliminarColumna(this)">Eliminar Columna</button>`;
    tabla.rows[filas + 1].insertBefore(nuevaCeldaBoton, tabla.rows[filas + 1].cells[columna]);
}

function eliminarColumna(button) {
    const columnaIndex = button.parentElement.cellIndex; // Obtener el índice de la celda que contiene el botón
    //console.log(columnaIndex);
    const tabla = button.closest('table'); // Obtener la tabla más cercana que contiene el botón

    const filas = tabla.rows.length;
    for (let i = 0; i < filas; i++) {
        tabla.rows[i].deleteCell(columnaIndex);
    }
}
//PARA LA MATRIZ
function crearMatriz() {
    let matriz = [];
    let columnasNombres = [];
    let filasNombres = [];
    let demanda = [];
    let disponibilidad = [];
    const tabla = document.querySelector('#matrizInputs table');

    // Obtener nombres de columnas
    for (let i = 1; i < tabla.rows[0].cells.length - 2; i++) {
        columnasNombres.push(tabla.rows[0].cells[i].textContent);
    }

    // Obtener nombres de filas
    for (let i = 1; i < tabla.rows.length - 2; i++) {
        filasNombres.push(tabla.rows[i].cells[0].textContent);
    }

    // Obtener valores de la matriz
    for (let i = 1; i < tabla.rows.length - 2; i++) {
        let fila = [];
        for (let j = 1; j < tabla.rows[i].cells.length - 2; j++) {
            fila.push(parseInt(tabla.rows[i].cells[j].querySelector('input[type="number"]').value));
        }
        matriz.push(fila);
    }

    // Obtener valores de demanda
    for (let i = 1; i < tabla.rows[tabla.rows.length - 2].cells.length; i++) {
        demanda.push(parseInt(tabla.rows[tabla.rows.length - 2].cells[i].querySelector('input[type="number"]').value));
    }

    // Obtener valores de disponibilidad
    for (let i = 1; i < tabla.rows.length - 2; i++) {
        disponibilidad.push(parseInt(tabla.rows[i].cells[tabla.rows[1].cells.length - 2].querySelector('input[type="number"]').value));
    }

    // Verificar suma de demanda y disponibilidad
    let sumaDemanda = demanda.reduce((acc, curr) => acc + curr, 0);
    let sumaDisponibilidad = disponibilidad.reduce((acc, curr) => acc + curr, 0);

    if (sumaDemanda !== sumaDisponibilidad) {
        // Mostrar notificación si las sumas son diferentes
        alert(`La suma de la demanda (${sumaDemanda}) no coincide con la suma de la disponibilidad (${sumaDisponibilidad}). No se puede continuar.`);
        return; // Salir de la función si las sumas son diferentes
    }
    // Si las sumas son iguales, mostrar la matrizs
    mostrarMatrizNW(filasNombres, columnasNombres, matriz, demanda, disponibilidad);
    crearMatrizNortwestMinima(filasNombres, columnasNombres, demanda, disponibilidad);
    generarGrafoDesdeMatriz(filasNombres, columnasNombres, matriz);
}
function mostrarMatrizNW(fNom, cNom, matriz,demanda,disponibilidad) {
    const contenedorMatriz = document.getElementById('matriz');
    let html = '<h2>Disponibilidad vs Demanda</h2>';
    html += '<table>';
    html += '<tr><th style = " background: #473179;"></th>';
    cNom.forEach((valor, index) => {
      html += `<th style = " background: #9E7DD4;">${valor}</th>`;
    });
    html += '<th style = " background: #FBAD41;">Disponibilidad</th>';
    html += '</tr>';
   
    matriz.forEach((fila, index) => {
      html += `<tr><th style = " background: #9E7DD4;">${fNom[index]}</th>`;
      let salida = 0;
      columna = 0;
      fila.forEach(valor => {
        html += `<td style = " background: #BCB9D8;">${valor}</td>`;
      });
      
      html += `<th style = " background: #f8b3b2;">${disponibilidad[index]}</th>`;
    });
    
    html += '</tr><th style = " background: #FBAD41;">Demanda</th>';
    columna = 0;
    demanda.forEach(element => {
      html += `<th style = " background: #f8b3b2;">${element}</th>`;
      if(element > 0){
        columna += element;
      }
    });

    
    columna2 = 0;
    disponibilidad.forEach(element => {
      if(element > 0){
        columna2 += element;
      }
    });
    html += `<th style = " background: #fd9a98;">${columna}/${columna2}</th>`;
    html += '<tr>'
    html += '</table>';
    contenedorMatriz.innerHTML = html;
}
function mostrarNortWest(fNom, cNom, matriz,demanda,disponibilidad) {
    console.log('se muestra la matriz');
    const contenedorMatriz = document.getElementById('matrizNortWest');
    console.log('se muestra la matriz despues del document');
    let html = '<h2>Costos</h2>';
    html += '<table>';
    html += '<tr><th style = " background: #473179;"></th>';
    cNom.forEach((valor, index) => {
      html += `<th style = " background: #9E7DD4;">${valor}</th>`;

    });
    html += '<th style = " background: #FBAD41;">Disponibilidad</th>';
    html += '</tr>';
   
    matriz.forEach((fila, index) => {
      html += `<tr><th style = " background: #9E7DD4;">${fNom[index]}</th>`;
      let salida = 0;
      columna = 0;
      fila.forEach(valor => {
        html += `<td style = " background: #BCB9D8;">${valor}</td>`;
      });
      
      html += `<th style = " background: #f8b3b2;">${disponibilidad[index]}</th>`;
    });
    
    html += '</tr><th style = " background: #FBAD41;">Demanda</th>';
    columna = 0;
    demanda.forEach(element => {
      html += `<th style = " background: #f8b3b2;">${element}</th>`;
      if(element > 0){
        columna += element;
      }
    });
    columna2 = 0;
    disponibilidad.forEach(element => {
      if(element > 0){
        columna2 += element;
      }
    });
    html += `<th style = " background: #fd9a98;">${columna}/${columna2}</th>`;
    html += '<tr>'
    html += '</table>';
    contenedorMatriz.innerHTML = html;
}
function mostrarNortWestMinimo(fNom, cNom, matriz,demanda,disponibilidad) {
    console.log('se muestra la matriz');
    const contenedorMatriz = document.getElementById('matrizNortWestMinima');
    console.log('se muestra la matriz despues del document');
    let html = '<h2>Costos Minimos</h2>';
    html += '<table>';
    html += '<tr><th style = " background: #473179;"></th>';
    cNom.forEach((valor, index) => {
      html += `<th style = " background: #9E7DD4;">${valor}</th>`;

    });
    html += '<th style = " background: #FBAD41;">Disponibilidad</th>';
    html += '</tr>';
   
    matriz.forEach((fila, index) => {
      html += `<tr><th style = " background: #9E7DD4;">${fNom[index]}</th>`;
      let salida = 0;
      columna = 0;
      fila.forEach(valor => {
        html += `<td style = " background: #BCB9D8;">${valor}</td>`;
      });
      
      html += `<th style = " background: #f8b3b2;">${disponibilidad[index]}</th>`;
    });
    
    html += '</tr><th style = " background: #FBAD41;">Demanda</th>';
    columna = 0;
    demanda.forEach(element => {
      html += `<th style = " background: #f8b3b2;">${element}</th>`;
      if(element > 0){
        columna += element;
      }
    });
    columna2 = 0;
    disponibilidad.forEach(element => {
      if(element > 0){
        columna2 += element;
      }
    });
    html += `<th style = " background: #fd9a98;">${columna}/${columna2}</th>`;
    html += '<tr>'
    html += '</table>';
    contenedorMatriz.innerHTML = html;
}
function crearMatrizNortwestMinima(fNom, cNom, demanda, disponibilidad) {
    console.log('crear matriz minima');
    const numFilas = disponibilidad.length;
    const numColumnas = demanda.length;
    let nortwest = []; // Matriz nortwest
    let demandaRestante = [...demanda]; // Copia de la demanda original para realizar las reducciones
    let disponibilidadRestante = [...disponibilidad]; // Copia de la disponibilidad original para realizar las reducciones
    let matrizInicial = obtenerMatrizInicial(); // Obtener la matriz de costos inicial

    // Inicializar la matriz nortwest con ceros
    for (let i = 0; i < numFilas; i++) {
        nortwest.push(new Array(numColumnas).fill(0));
    }

    // Mientras haya demanda y disponibilidad restante
    while (demandaRestante.some(val => val > 0) && disponibilidadRestante.some(val => val > 0)) {
        // Encontrar la menor demanda o disponibilidad restante
        let asignacion = Math.min(
            Math.min(...demandaRestante.filter(val => val > 0)),
            Math.min(...disponibilidadRestante.filter(val => val > 0))
        );

        // Encontrar el costo mínimo en la matriz inicial
        let costoMinimo = Number.MAX_SAFE_INTEGER;
        let posicionMinima = { fila: -1, columna: -1 };
        for (let i = 0; i < numFilas; i++) {
            for (let j = 0; j < numColumnas; j++) {
                if (matrizInicial[i][j] < costoMinimo && disponibilidadRestante[i] >= asignacion && demandaRestante[j] >= asignacion) {
                    costoMinimo = matrizInicial[i][j];
                    posicionMinima.fila = i;
                    posicionMinima.columna = j;
                }
            }
        }

        // Si no se encuentra una posición válida, salir del bucle
        if (posicionMinima.fila === -1 || posicionMinima.columna === -1) {
            break;
        }

        // Asignar la asignación en la posición de costo mínimo encontrada
        nortwest[posicionMinima.fila][posicionMinima.columna] = asignacion;
        demandaRestante[posicionMinima.columna] -= asignacion;
        disponibilidadRestante[posicionMinima.fila] -= asignacion;
    }

    // Verificar que las sumas de las asignaciones coincidan con la disponibilidad y demanda
    for (let i = 0; i < numFilas; i++) {
        const sumaFila = nortwest[i].reduce((acc, val) => acc + val, 0);
        if (sumaFila !== disponibilidad[i]) {
            console.error(`La suma de las asignaciones en la fila ${i + 1} no coincide con la disponibilidad.`);
        }
    }

    for (let j = 0; j < numColumnas; j++) {
        const sumaColumna = nortwest.map(row => row[j]).reduce((acc, val) => acc + val, 0);
        if (sumaColumna !== demanda[j]) {
            console.error(`La suma de las asignaciones en la columna ${j + 1} no coincide con la demanda.`);
        }
    }

    // Mostrar la matriz resultante y calcular el resultado mínimo
    mostrarNortWestMinimo(fNom, cNom, nortwest, demandaRestante, disponibilidadRestante);
    const resultadoMinimo = multiplicacionYSuma(nortwest, matrizInicial);
    const contenedorResultadoMinimo = document.getElementById('resultadoMinimo');
    contenedorResultadoMinimo.textContent = `Resultado: ${resultadoMinimo}`;

    // Obtener la matriz resultante
    const { matriz: matrizResultante, demanda: demandaResultante, disponibilidad: disponibilidadResultante } = crearMatrizResultante(nortwest, matrizInicial);
}


function obtenerValorMinimo(i, j) {
    const tabla = document.querySelector('#matrizInputs table');
    return parseInt(tabla.rows[i + 1].cells[j + 1].querySelector('input[type="number"]').value);
}
function obtenerMatrizInicial() {
    let matriz = [];
    const tabla = document.querySelector('#matrizInputs table');

    // Obtener valores de la matriz
    for (let i = 1; i < tabla.rows.length - 2; i++) {
        let fila = [];
        for (let j = 1; j < tabla.rows[i].cells.length - 2; j++) {
            fila.push(parseInt(tabla.rows[i].cells[j].querySelector('input[type="number"]').value));
        }
        matriz.push(fila);
    }

    return matriz;
}

//PRUEBA
function generarGrafoDesdeMatriz(filas, columnas, matriz) {
    ids = 0;
    // Actualizar nodos correspondientes a las filas
    filas.forEach((filaNombre, filaIndex) => {
      nodosDataSet.update({ id: filaIndex, label: filaNombre, color: { background: 'lightgreen', border: 'green' } }); // Establecer el color verde
      ids++;
    });
  
    // Obtener el valor máximo de los IDs de los nodos de las filas
    const ultimoIdFila = ids - 1;
  
    // Actualizar nodos correspondientes a las columnas
    columnas.forEach((columnaNombre, columnaIndex) => {
      nodosDataSet.update({ id: ultimoIdFila + columnaIndex + 1, label: columnaNombre }); // Establecer el nombre como etiqueta
      ids++;
    });
  
    // Limpiar aristas existentes
    aristasDataSet.clear();
  
    // Agregar aristas con valores desde la matriz
    filas.forEach((filaNombre, filaIndex) => {
      columnas.forEach((columnaNombre, columnaIndex) => {
        const valor = matriz[filaIndex][columnaIndex];
        if (valor !== 0) {
          const fromId = filaIndex;
          const toId = ultimoIdFila + columnaIndex + 1;
          // Agregar arista con ID y valor
          const edgeId = `edge_${fromId}_${toId}`;
          aristasDataSet.add({ id: edgeId, from: fromId, to: toId, label: String(valor), arrows: 'to' });
        }
      });
    });
  
    // Actualizar la red con los nuevos datos
    grafo.setData({ nodes: nodosDataSet, edges: aristasDataSet });
}