// sort.js

document.addEventListener("DOMContentLoaded", function() {
  const crearListaAleatoriaBtn = document.getElementById("crearListaAleatoriaBtn");
  const listaAleatoriaLabel = document.getElementById("listaAleatoriaLabel");

  crearListaAleatoriaBtn.addEventListener("click", function() {
      const numElements = document.getElementById("numElements").value;
      const lowerLimit = document.getElementById("lowerLimit").value;
      const upperLimit = document.getElementById("upperLimit").value;

      const listaAleatoria = generarListaAleatoria(numElements, lowerLimit, upperLimit);
      listaAleatoriaLabel.textContent = listaAleatoria.join(", ");
  });

  function handleCheckboxChange(checkboxId) {
    var inputNormalCheckbox = document.getElementById('inputNormal');
    var inputAleatorioCheckbox = document.getElementById('inputAleatorio');
    var inputLabelNormal = document.getElementById('inputLabelNormal');
    var numElementsInput = document.getElementById('numElements');
    var lowerLimitInput = document.getElementById('lowerLimit');
    var upperLimitInput = document.getElementById('upperLimit');
    var crearListaAleatoriaBtn = document.getElementById('crearListaAleatoriaBtn');

    if (checkboxId === 'inputNormal' && inputNormalCheckbox.checked) {
        inputLabelNormal.disabled = false;
        numElementsInput.disabled = true;
        lowerLimitInput.disabled = true;
        upperLimitInput.disabled = true;
        crearListaAleatoriaBtn.disabled = true;
    } else if (checkboxId === 'inputAleatorio' && inputAleatorioCheckbox.checked) {
        inputLabelNormal.disabled = true;
        numElementsInput.disabled = false;
        lowerLimitInput.disabled = false;
        upperLimitInput.disabled = false;
        crearListaAleatoriaBtn.disabled = false;
    }

    // Ensure only one checkbox is checked at a time
    if (checkboxId === 'inputNormal' && inputNormalCheckbox.checked) {
        inputAleatorioCheckbox.checked = false;
    } else if (checkboxId === 'inputAleatorio' && inputAleatorioCheckbox.checked) {
        inputNormalCheckbox.checked = false;
    }
}

function crearListaAleatoria() {
    var numElements = parseInt(document.getElementById('numElements').value);
    var lowerLimit = parseInt(document.getElementById('lowerLimit').value);
    var upperLimit = parseInt(document.getElementById('upperLimit').value);
    var listaAleatoria = [];

    for (var i = 0; i < numElements; i++) {
        var randomNum = Math.floor(Math.random() * (upperLimit - lowerLimit + 1)) + lowerLimit;
        listaAleatoria.push(randomNum);
    }

    document.getElementById('listaAleatoriaLabel').innerText = listaAleatoria.join(', ');
}
});
