

function crearMatrizz(){
  limpiar();
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
  imprimirCostos(filasNombres, columnasNombres,matriz, demanda, disponibilidad,  maximizarCostos2(matriz, demanda, disponibilidad)); 
  generarGrafoDesdeMatriz(filasNombres, columnasNombres, matriz);

}
function crearMatriz2(){
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
  imprimirCostos(filasNombres, columnasNombres,matriz, demanda, disponibilidad,  minCostos2(matriz, demanda, disponibilidad));
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

//SACA CORRECTAMENTE LA PRIMERA SOLUCION
function nortWest(costos, demanda, disponibilidad) { // saca correctamente la primera solucion
  const filas = disponibilidad.length;
  const columnas = demanda.length;
  let solucion = Array.from({ length: filas }, () => Array.from({ length: columnas }, () => 0));

  let i = 0;
  let j = 0;
  while (i < filas && j < columnas) {
      const asignacion = Math.min(disponibilidad[i], demanda[j]);
      solucion[i][j] = asignacion;
      disponibilidad[i] -= asignacion;
      demanda[j] -= asignacion;

      if (disponibilidad[i] === 0) {
          i++;
      }
      if (demanda[j] === 0) {
          j++;
      }
  }
  console.log(solucion);
  return solucion;
}

//USA UNA LIBRERIA EXTERNA Y ME DA UN RESULTADO VALIDO PERO NO SE SIENTO QUE AUN SE PUEDE MEJORAR
function maximizarCostos2(costos, demanda, disponibilidad) {  //usa una 
  // Crear el problema de maximización
  let problem = {
      optimize: 'max',
      opType: 'max',
      constraints: {},
      variables: {}
  };

  // Agregar las variables al problema
  for (let i = 0; i < costos.length; i++) {
      for (let j = 0; j < costos[i].length; j++) {
          const variableName = `x${i}${j}`;
          problem.variables[variableName] = {
              [variableName]: 1
          };
      }
  }

  // Agregar las restricciones de disponibilidad al problema
  for (let i = 0; i < disponibilidad.length; i++) {
      const constraintName = `disponibilidad_${i}`;
      problem.constraints[constraintName] = {
          equal: disponibilidad[i]
      };
      for (let j = 0; j < costos[i].length; j++) {
          const variableName = `x${i}${j}`;
          problem.variables[variableName][constraintName] = 1;
      }
  }

  // Agregar las restricciones de demanda al problema
  for (let j = 0; j < demanda.length; j++) {
      const constraintName = `demanda_${j}`;
      problem.constraints[constraintName] = {
          equal: demanda[j]
      };
      for (let i = 0; i < costos.length; i++) {
          const variableName = `x${i}${j}`;
          problem.variables[variableName][constraintName] = 1;
      }
  }

  // Resolver el problema
  const solution = solver.Solve(problem);

  // Devolver la solución
  console.log(solution);
  return solution;
}
function minCostos2(costos, demanda, disponibilidad) {  //usa una 
  // Crear el problema de maximización
  let problem = {
      optimize: 'min',
      opType: 'min',
      constraints: {},
      variables: {}
  };

  // Agregar las variables al problema
  for (let i = 0; i < costos.length; i++) {
      for (let j = 0; j < costos[i].length; j++) {
          const variableName = `x${i}${j}`;
          problem.variables[variableName] = {
              [variableName]: 1
          };
      }
  }

  // Agregar las restricciones de disponibilidad al problema
  for (let i = 0; i < disponibilidad.length; i++) {
      const constraintName = `disponibilidad_${i}`;
      problem.constraints[constraintName] = {
          equal: disponibilidad[i]
      };
      for (let j = 0; j < costos[i].length; j++) {
          const variableName = `x${i}${j}`;
          problem.variables[variableName][constraintName] = 1;
      }
  }

  // Agregar las restricciones de demanda al problema
  for (let j = 0; j < demanda.length; j++) {
      const constraintName = `demanda_${j}`;
      problem.constraints[constraintName] = {
          equal: demanda[j]
      };
      for (let i = 0; i < costos.length; i++) {
          const variableName = `x${i}${j}`;
          problem.variables[variableName][constraintName] = 1;
      }
  }

  // Resolver el problema
  const solution = solver.Solve(problem);

  // Devolver la solución
  console.log(solution);
  return solution;
}



function imprimirCostos(fNom, cNom,costos, demanda, disponibilidad, solucion){
  const contenedorMatriz = document.getElementById('solucion');
  
  let html = '<h2>Solucion</h2>';
  html += '<table>';
  html += '<tr><th style = " background: #473179;"></th>';
  cNom.forEach((valor, index) => {
    html += `<th style = " background: #9E7DD4;">${valor}</th>`;

  });
  html += '<th style = " background: #FBAD41;">Disponibilidad</th>';
  html += '</tr>';
 let total = 0;
  for(let i = 0;i < fNom.length; i++) {
    html += `<tr><th style = " background: #9E7DD4;">${fNom[i]}</th>`;
    let salida = 0;
    columna = 0;
    for(let j = 0;j < cNom.length; j++) {
      let valor='x'+i+j;
     valor= solucion[valor];
      
      if(valor!=undefined){
          
          html += `<td style = " background: #BCB9D8;">${valor}</td>`;
          total += valor*costos[i][j];
      }
      else{
          html += `<td style = " background: #BCB9D8;">0</td>`;
      }
      
    }
    
    html += `<th style = " background: #f8b3b2;">${disponibilidad[i]}</th>`;
  }
  
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
  html += `</table> <h3>${total} </h3>`;
  contenedorMatriz.innerHTML = html;
}

