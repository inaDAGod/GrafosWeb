function generarGrafoAristas() {
    return aristasDataSet.get().map((arista) => ({
      src: arista.from,
      weight: parseInt(arista.label || 1),
      dest: arista.to,
    }));
  }
    

function calcularGrados(matriz) {
    const gradosEntrada = new Array(matriz[0].length).fill(0);
    const gradosSalida = new Array(matriz[0].length).fill(0);

    matriz.forEach((fila, i) => {
        fila.forEach((valor, j) => {
            if (valor !== 0) {
                gradosSalida[i]++;
                gradosEntrada[j]++;
            }
        });
    });

    return { gradosEntrada, gradosSalida };
}


function nodoOrigen(){
    const matriz = getMatriz();
    //console.log(matriz);
    const { gradosEntrada, gradosSalida } = calcularGrados(matriz);
    let nodoOrigen=0;
  
    gradosEntrada.forEach((value, i) => {
        if(value == 0){
            nodoOrigen = i;
        }
    });
    return nodoOrigen;
}
function nodoDestino(){
    const matriz = getMatriz();

    const { gradosEntrada, gradosSalida } = calcularGrados(matriz);

    let nodoDestino=0;
    gradosSalida.forEach((value, i) => {
        if(value == 0){
            nodoDestino = i;
        }
    });
    return nodoDestino;
}

function solveMinimum() {
    const matriz = getMatriz();
    console.log(matriz);
    const from = nodoOrigen();
    const to = nodoDestino();
    console.log("Nodo origen " +from);
    console.log("Nodo destino " +to);
    const nodos = nodosDataSet.get({ fields: ['id', 'label'] });
    let disIzq = Array(nodos.length).fill(Infinity);
    let mejorCamino = [];
  
    disIzq[from] = 0;
    let listaActual = [from];
    while (listaActual.length) {
      const current = listaActual.shift();
      for (let i = 0; i < nodos.length; i++) {
        if (matriz[current][i] !== 0) {
          console.log('analizando camino de', current, 'a', i);
          if (disIzq[i] > disIzq[current] + matriz[current][i]) {
            console.log('encontro mejor camino de', current, 'a', i, '=', disIzq[current] + matriz[current][i]);
            disIzq[i] = disIzq[current] + matriz[current][i];
            listaActual.push(i);
          }
        }
      }
    }
    console.log('fin de de ida, los mejores pesos izquierda', disIzq);
  
    listaActual = [to];
    const distDerecha = Array(nodos.length).fill(Infinity);
    distDerecha[to] = disIzq[to];
    while (listaActual.length) {
      const current = listaActual.shift();
      for (let i = 0; i < nodos.length; i++) {
        if (matriz[i][current] !== 0) { // al reves
          console.log('analizando camino de', current, 'a', i);
          if (distDerecha[i] > disIzq[current] - matriz[i][current]) {
            console.log('encontro mejor camino de', current, 'a', i, '=', disIzq[current] - matriz[i][current]);
            distDerecha[i] = disIzq[current] - matriz[i][current];
            listaActual.push(i);
            mejorCamino[i] = current;
          }
        }
      }
    }
    console.log('fin de de regreso, los mejores pesos derecha', distDerecha);
    console.log('mejor camino', mejorCamino);
    mejorCamino = corregirCamino(mejorCamino,holguras(distDerecha, disIzq));
    console.log('mejor camino corregido', mejorCamino);
    pintarMejorCamino(mejorCamino);
  }
 
  
  function solveMaximum() {
    
    const matriz = getMatriz();
    console.log(matriz);
    const from = nodoOrigen();
    const to = nodoDestino();
    console.log("Nodo origen "+from);
    console.log("Nodo Destino "+to);
    const nodos = nodosDataSet.get({ fields: ['id', 'label'] });
    let disIzq = Array(nodos.length).fill(-Infinity);
    let mejorCamino = [];
    disIzq[from] = 0;
    let listaActual = [from];
    while (listaActual.length) {
      const current = listaActual.shift();
      for (let i = 0; i < nodos.length; i++) {
        if (matriz[current][i] !== 0) {
          console.log('analizando camino de', current, 'a', i);
          if (disIzq[i] < disIzq[current] + matriz[current][i]) {
            console.log('encontro mayor camino de', current, 'a', i, '=', disIzq[current] + matriz[current][i]);
            disIzq[i] = disIzq[current] + matriz[current][i];
            listaActual.push(i);
          }
        }
      }
    }
    console.log('fin de de ida, los mejores pesos izquierda', disIzq);
  
    listaActual = [to];
    const distDerecha = Array(nodos.length).fill(Infinity);
    distDerecha[to] = disIzq[to];
    while (listaActual.length) {
      const current = listaActual.shift();
      for (let i = 0; i < nodos.length; i++) {
        if (matriz[i][current] !== 0) { // al reves
          console.log('analizando camino de', current, 'a', i, 'distancias a evaluar', distDerecha[i], disIzq[current] - matriz[i][current]);
          if (distDerecha[i] > distDerecha[current] - matriz[i][current]) {
            console.log('encontro nueva derecha de', current, 'a', i, '=', disIzq[current] - matriz[i][current]);
            distDerecha[i] = distDerecha[current] - matriz[i][current];
            listaActual.push(i);
            mejorCamino[i] = current;
          }
        }
      }
    }
    console.log('fin de de regreso, los mejores pesos derecha', distDerecha);
    console.log('mejor camino', mejorCamino);
    for (let i = 0; i < nodos.length; i++) {
      console.log(i, distDerecha[i], disIzq[i]);
    }
    mejorCamino = corregirCamino(mejorCamino,holguras(distDerecha, disIzq));
    console.log('mejor camino corregido', mejorCamino);
    pintarMejorCamino(mejorCamino);
  }

  function holguras(distDerecha, disIzq) {
    const matrizAristas = generarGrafoAristas();
    const resultado = [];

    for (let i = 0; i < matrizAristas.length; i++) {
        const src = matrizAristas[i].src;
        const dest = matrizAristas[i].dest;
        const holgura = distDerecha[dest] - disIzq[src] - matrizAristas[i].weight;
        const holguraInfo = {
            src: src,
            dest: dest,
            holgura: holgura
        };
        resultado.push(holguraInfo);
    }
    console.log(resultado);
    return resultado;
}


function corregirCamino(mejorCamino, holguras) {
  for (let i = 0; i < holguras.length; i++) {
      const src = holguras[i].src;
      const dest = holguras[i].dest;
      if (dest == mejorCamino[src]) {
          if (holguras[i].holgura != 0) {
              mejorCamino[src] = -1;
          }
      }
  }
  //console.log(mejorCamino);
  return mejorCamino;
}


function pintarMejorCamino(mejorCamino) {
  const nodoDestinoId = nodoDestino();
  nodosDataSet.forEach(nodo => {
    nodo.color = { background: '#97C2FC' }; 
    nodo.borderWidth= 1;
    nodo.shadow = false;
    nodosDataSet.update(nodo); 
  });
  mejorCamino.forEach((value, i) => {
    console.log(value);
    if (value !== -1) {
      console.log("intenta pintarse");
      const nodo = nodosDataSet.get(i); 
      if (nodo) { 
        nodo.color = { background: '#FD918F' }; 
        nodo.borderWidth= 4;

        nodo.shadow = true;
        nodosDataSet.update(nodo); 
      }
    }
  });
  const nodo = nodosDataSet.get(nodoDestinoId); 
      if (nodo) { 
        nodo.color = { background: '#FD918F' }; 
        nodo.borderWidth= 4;
        nodo.shadow = true;
        nodosDataSet.update(nodo); 
      }

      mostrarSolucion();
}

function mostrarSolucion() {
  const contenedor= document.getElementById('solucion');
  let html = '<h2>Solucion con el Algoritmo de Johnson</h2>';
  from = nodoOrigen();
  nodoOrigen = nodosDataSet.get(from);
  to = nodoDestino();
  nodoDestino= nodosDataSet.get(to);
  html += '<table>';
  html += '<tr><th style = " background: #9E7DD4;">Nodo origen</th><th style = " background: #9E7DD4;">Nodo destino</th></tr>';
  html += `<td style = " background: #BCB9D8;">${nodoOrigen.label}</td><td style = " background: #BCB9D8;">${nodoDestino.label}</td>`;

  
  contenedor.innerHTML = html;
  }











 

