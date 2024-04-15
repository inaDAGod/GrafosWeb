
//esta en proceso el de encontrar camino esta mal deberia ser lo de la x y lo de las x que resta pero no la logre, creo que con ese se podira

function esquinaNoroeste(costos, demanda, disponibilidad) {
    let solucion = [];
    let totalOptimo = 0;
    let i = 0;
    let j = 0;

    // Inicializar la matriz solución con ceros
    for (let m = 0; m < disponibilidad.length; m++) {
        solucion[m] = new Array(demanda.length).fill(0);
    }

    // Aplicar el algoritmo de la esquina noroeste
    while (i < disponibilidad.length && j < demanda.length) {
        let asignacion = Math.min(disponibilidad[i], demanda[j]);
        solucion[i][j] = asignacion;
        totalOptimo += asignacion * costos[i][j];
        disponibilidad[i] -= asignacion;
        demanda[j] -= asignacion;

        if (disponibilidad[i] === 0) {
            i++;
        } else {
            j++;
        }
    }

    return { solucion, totalOptimo };
}

function calcularPotenciales(solucion, costos) {
    console.log("Solucion clpo",solucion);
    console.log("costos clpo",costos);
    let u = new Array(solucion.length).fill(null);//generadores disponibildades
    let v = new Array(solucion[0].length).fill(null);//generadores demanda
    u[0] = Math.min(...costos[0]); //primer valor es el menor de costos


    // Calcular los potenciales u y v
  
        for (let i = 0; i < solucion.length; i++) {
            for (let j = 0; j < solucion[0].length; j++) {
                if (solucion[i][j] !== 0) {
                    if (u[i] != null && v[j] == null) {
                        v[j] = solucion[i][j] - u[i];
                       // console.log("vj", v[j],"j",j);
                    } else if (u[i] === null && v[j] !== null) {
                        u[i] = solucion[i][j] - v[j];
                        //console.log("uj", u[i],"i",i);
                    }
                }
            }
        }

        //console.log("v final", v);
        //console.log("u final", u);
    return { u, v };
}

function metodoMODI(costos, demanda, disponibilidad) {
    let { solucion, totalOptimo } = esquinaNoroeste(costos, demanda, disponibilidad);
    //console.log("Solucion modi", solucion);
    //console.log("total oprimo", solucion);
    let { u, v } = calcularPotenciales(solucion, costos);
    console.log("u",u);
    console.log("v",v);
    let mejora = true;

    while (mejora) {
        mejora = false;
        let celdaMejora = null;
        let maxDiferencia = 0;

        // Encontrar la celda con la mayor diferencia de oportunidad negativa
        for (let i = 0; i < costos.length; i++) {
            for (let j = 0; j < costos[i].length; j++) {
                if (solucion[i][j] === 0) {
                    let diferencia =  u[i] + v[j];
                    console.log("diferencia", diferencia);
                    if (diferencia < 0) {
                        maxDiferencia = diferencia;
                        celdaMejora = { i, j };
                        console.log("celda mejora", celdaMejora);
                        mejora = true;
                    }
                }
            }
        }

        // Si encontramos una celda para mejorar, ajustamos la solución
        if (celdaMejora != null) {
            const camino = encontrarCamino(solucion, celdaMejora.i, celdaMejora.j);
            console.log("camino",camino);
            let minimo = Number.POSITIVE_INFINITY;

            // Encontrar el valor mínimo en el camino para ajuste
            for (let k = 0; k < camino.length; k += 2) {
                const [x, y] = camino[k];
                minimo = Math.min(minimo, solucion[x][y]);
            }

            // Ajustar la solución
            for (let k = 0; k < camino.length; k++) {
                const [x, y] = camino[k];
                if (k % 2 === 0) {
                    solucion[x][y] -= minimo; // Restar el mínimo a las asignaciones existentes
                } else {
                    solucion[x][y] += minimo; // Sumar el mínimo a las asignaciones vacías
                }
            }

            // Recalcular los potenciales u y v después del ajuste
            const { uNuevo, vNuevo } = calcularPotenciales(solucion, costos);
            u = uNuevo;
            v = vNuevo;
        }
    }

    return { solucion, totalOptimo };
}

function encontrarCamino(solucion, inicioX, inicioY) {
    let visitados = new Array(solucion.length).fill(false).map(() => new Array(solucion[0].length).fill(false));
    let camino = [];
    let stack = [[inicioX, inicioY, null]];
  
    visitados[inicioX][inicioY] = true;
  
    while (stack.length > 0) {
      let [x, y, dir] = stack.pop();
  
      camino.push([x, y]);
  
      // Intentar moverse a la izquierda
      if (dir !== 'derecha' && y > 0 && solucion[x][y - 1] > 0 && !visitados[x][y - 1]) {
        visitados[x][y - 1] = true;
        stack.push([x, y - 1, 'izquierda']);
      }
      // Intentar moverse hacia abajo
      else if (dir !== 'arriba' && x < solucion.length - 1 && solucion[x + 1][y] > 0 && !visitados[x + 1][y]) {
        visitados[x + 1][y] = true;
        stack.push([x + 1, y, 'abajo']);
      }
      // Intentar moverse a la derecha
      else if (dir !== 'izquierda' && y < solucion[0].length - 1 && solucion[x][y + 1] > 0 && !visitados[x][y + 1]) {
        visitados[x][y + 1] = true;
        stack.push([x, y + 1, 'derecha']);
      }
      // Intentar moverse hacia arriba
      else if (dir !== 'abajo' && x > 0 && solucion[x - 1][y] > 0 && !visitados[x - 1][y]) {
        visitados[x - 1][y] = true;
        stack.push([x - 1, y, 'arriba']);
      }
      // Si no hay movimientos posibles, retroceder
      else {
        if (camino.length > 1) {
          visitados[x][y] = false;
          camino.pop();
        }
      }
    }
  
    return camino;
  }
  