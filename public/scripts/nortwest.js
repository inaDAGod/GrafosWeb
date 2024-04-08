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
    // Si las sumas son iguales, mostrar la matriz
    mostrarMatrizNW(filasNombres, columnasNombres, matriz, demanda, disponibilidad);
    crearMatrizNortwest(filasNombres, columnasNombres, demanda, disponibilidad);
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
function multiplicacionYSuma(matriz1, matriz2) {
    if (matriz1.length === 0 || matriz2.length === 0 || matriz1.length !== matriz2.length || matriz1[0].length !== matriz2[0].length) {
        console.error('Las matrices no tienen dimensiones válidas para la operación.');
        return null;
    }
    let suma= 0;
    for (let i = 0; i < matriz1.length; i++) {
        for (let j = 0; j < matriz1[i].length; j++) {
            suma+= matriz1[i][j] * matriz2[i][j];
        }
    }
    return suma;
}
function crearMatrizNortwest(fNom, cNom, demanda, disponibilidad) {

    console.log('se esta creando la matriz nortwest');
    const numFilas = disponibilidad.length;
    const numColumnas = demanda.length;
    let nortwest = []; // Matriz nortwest
    let demandaRestante = [...demanda]; // Copia de la demanda original para realizar las reducciones
    let disponibilidadRestante = [...disponibilidad]; // Copia de la disponibilidad original para realizar las reducciones
    // Inicializar la matriz nortwest con ceros
    for (let i = 0; i < numFilas; i++) {
        nortwest.push(new Array(numColumnas).fill(0));
    }
   
    let i = 0; 
    let j = 0; 
    while (i < numFilas && j < numColumnas) {
        // Calcular el valor para la celda actual de la matriz nortwest
        let asignacion = Math.min(demandaRestante[j], disponibilidadRestante[i]);
        nortwest[i][j] = asignacion;
        demandaRestante[j] -= asignacion;
        disponibilidadRestante[i] -= asignacion;

        if (demandaRestante[j] === 0) {
            j++; // Avanzar a la siguiente columna
        }
        if (disponibilidadRestante[i] === 0) {
            i++; // Avanzar a la siguiente fila
        }
    }
    console.log('creacion hecha');
    mostrarNortWest(fNom, cNom, nortwest, demandaRestante, disponibilidadRestante);
    const resultado = multiplicacionYSuma(nortwest, obtenerMatrizInicial());
    const contenedorResultado = document.getElementById('resultado');
    contenedorResultado.textContent = `Resultado: ${resultado}`;
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







