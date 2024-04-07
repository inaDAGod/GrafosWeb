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


function crearMatriz(){
    let matriz=[];
    let columnasNombres=[];
    let filasNombres=[];
    let demanda=[];
    let disponibilidad=[];
    const tabla = document.querySelector('#matrizInputs table');
    for(let i = 1; i < tabla.rows[0].cells.length-2; i++ ){
        //console.log(tabla.rows[0].cells[i].textContent);
        columnasNombres.push(tabla.rows[0].cells[i].textContent);
    }
    console.log(columnasNombres);

    for(let i = 1; i < tabla.rows.length-2;i++){
        //console.log(tabla.rows[i].cells[0].textContent);
        filasNombres.push(tabla.rows[i].cells[0].textContent);
    }
    console.log(filasNombres);
    for(let i = 1; i < tabla.rows.length-2;i++){
        let fila = [];
        for(let j = 1; j < tabla.rows[i].cells.length-2; j++ ){
            //console.log(tabla.rows[i].cells[j].querySelector('input[type="number"]').value);
            fila.push(parseInt(tabla.rows[i].cells[j].querySelector('input[type="number"]').value));
        }
        matriz.push(fila);
    }
    console.log( tabla.rows[tabla.rows.length-2].cells.length);
    for(let i = 1; i < tabla.rows[tabla.rows.length-2].cells.length; i++ ){
        //console.log(tabla.rows[0].cells[i].textContent);
        demanda.push(parseInt(tabla.rows[tabla.rows.length-2].cells[i].querySelector('input[type="number"]').value));
    }
    for(let i = 1; i < tabla.rows.length-2;i++){
        //console.log(tabla.rows[i].cells[0].textContent);
        disponibilidad.push(parseInt(tabla.rows[i].cells[tabla.rows[1].cells.length-2].querySelector('input[type="number"]').value));
    }
    console.log("matriz",matriz);
    console.log("demanda",demanda);
    console.log("disponibilidad",disponibilidad);
    mostrarMatrizNW(filasNombres, columnasNombres, matriz,demanda,disponibilidad);
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

  
// Función para maximizar el total
function maximizarTotal(costos, disponibilidad, demanda) {
    // Crear un objeto de problema de optimización
    const problem = new SimplexJS();

    // Crear variables de decisión para cada celda de la matriz
    const numFilas = costos.length;
    const numColumnas = costos[0].length;
    for (let i = 0; i < numFilas; i++) {
        for (let j = 0; j < numColumnas; j++) {
            problem.addVariable(`x${i}${j}`, costos[i][j]);
        }
    }

    // Restricciones de disponibilidad
    for (let i = 0; i < numFilas; i++) {
        const constraint = {};
        for (let j = 0; j < numColumnas; j++) {
            constraint[`x${i}${j}`] = 1;
        }
        problem.addConstraint(constraint, '==', disponibilidad[i]);
    }

    // Restricciones de demanda
    for (let j = 0; j < numColumnas; j++) {
        const constraint = {};
        for (let i = 0; i < numFilas; i++) {
            constraint[`x${i}${j}`] = 1;
        }
        problem.addConstraint(constraint, '<=', demanda[j]);
    }

    // Función objetivo: maximizar el total
    const objective = {};
    for (let i = 0; i < numFilas; i++) {
        for (let j = 0; j < numColumnas; j++) {
            objective[`x${i}${j}`] = -1; // Negativo porque SimplexJS minimiza por defecto
        }
    }
    problem.addObjective(objective);

    // Resolver el problema de optimización
    const solution = problem.solve();

    // Crear y retornar la matriz de solución
    const solucionMatriz = [];
    for (let i = 0; i < numFilas; i++) {
        const fila = [];
        for (let j = 0; j < numColumnas; j++) {
            fila.push(solution[`x${i}${j}`]);
        }
        solucionMatriz.push(fila);
        
    }
    console.log("Resultado al maximizar el total:");
    console.log(solucionMatriz);
    return solucionMatriz;
}






  
