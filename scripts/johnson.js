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
    const mejorCamino = {};
  
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
          }
        }
      }
    }
    console.log('fin de de regreso, los mejores pesos derecha', distDerecha);
    console.log('mejor camino');
    for (let i = 0; i < nodos.length; i++) {
      console.log(i, distDerecha[i], disIzq[i]);
    }
    holguras(nodos,distDerecha, disIzq);
  }

  function holguras(nodos,distDerecha, disIzq){
    const matrizAristas = generarGrafoAristas();
    let holgura = 0;
    for (let i = 0; i <  matrizAristas.length; i++) {
      holgura = distDerecha[matrizAristas[i].dest] - disIzq[matrizAristas[i].src] - matrizAristas[i].weight;
      console.log("De "+nodos[matrizAristas[i].src].label +" a " +nodos[matrizAristas[i].dest].label + " holgura: " + holgura );
    }
  }
 

