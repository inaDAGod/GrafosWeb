function kruskalMaxMin(modo) {
  // Reestablecer el estilo de todas las aristas antes de ejecutar el algoritmo
  aristasDataSet.get().forEach(edge => {
      aristasDataSet.update({id: edge.id, color: {color: '#848484'}, width: 1});  // Color gris por defecto y ancho normal
  });

  const edges = aristasDataSet.get({
      filter: function (item) {
          return true;
      }
  });

  // Ordena las aristas dependiendo del modo (Maximizar o Minimizar)
  edges.sort((a, b) => {
      return modo === 'maximizar' ? b.label - a.label : a.label - b.label;
  });

  const parent = {};
  const rank = {};

  // Funciones para manejar el conjunto disjunto
  function find(data) {
      if (parent[data] !== data) {
          parent[data] = find(parent[data]);
      }
      return parent[data];
  }

  function union(data1, data2) {
      let root1 = find(data1);
      let root2 = find(data2);

      if (root1 !== root2) {
          if (rank[root1] > rank[root2]) {
              parent[root2] = root1;
          } else if (rank[root1] < rank[root2]) {
              parent[root1] = root2;
          } else {
              parent[root2] = root1;
              rank[root1] += 1;
          }
      }
  }

  // Inicializa el conjunto disjunto
  nodosDataSet.get().forEach(node => {
      parent[node.id] = node.id;
      rank[node.id] = 0;
  });

  const mst = [];
  edges.forEach(edge => {
      let root1 = find(edge.from);
      let root2 = find(edge.to);

      if (root1 !== root2) {
          mst.push(edge);
          union(root1, root2);
          // Marcar la arista en el grafo con el color y grosor específico
          let color = modo === 'maximizar' ? 'green' : 'purple'; // Verde para maximizar, morado para minimizar
          aristasDataSet.update({id: edge.id, color: {color: color}, width: 3});
      }
  });

  console.log("MST includes:", mst);
  return mst; // Retorna las aristas del árbol de expansión mínima
}

// Vincula las funciones a los botones de la UI
document.getElementById('minimizar').addEventListener('click', () => kruskalMaxMin('minimizar'));
document.getElementById('maximizar').addEventListener('click', () => kruskalMaxMin('maximizar'));
