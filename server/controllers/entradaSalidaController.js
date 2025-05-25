const fs = require('fs');
const celdasPath = './server/data/celdas.json';

const registrarEntrada = (req, res) => {
  const { celdaId, placa } = req.body;
  const celdas = JSON.parse(fs.readFileSync(celdasPath));
  const index = celdas.findIndex(c => c.id == celdaId);

  if (index === -1) {
    return res.status(404).send('Celda no encontrada');
  }

  if (!celdas[index].habilitada) {
    return res.status(400).send('Celda no habilitada');
  }

  if (celdas[index].estado === 'ocupada') {
    return res.status(400).send('Celda ya ocupada');
  }

  celdas[index].estado = 'ocupada';
  celdas[index].vehiculoPlaca = placa;
  fs.writeFileSync(celdasPath, JSON.stringify(celdas, null, 2));
  res.send('Entrada registrada');
};

const registrarSalida = (req, res) => {
  const { celdaId } = req.body;
  const celdas = JSON.parse(fs.readFileSync(celdasPath));
  const index = celdas.findIndex(c => c.id == celdaId);

  if (index === -1) {
    return res.status(404).send('Celda no encontrada');
  }

  if (celdas[index].estado === 'libre') {
    return res.status(400).send('Celda ya está libre');
  }

  celdas[index].estado = 'libre';
  delete celdas[index].vehiculoPlaca;
  fs.writeFileSync(celdasPath, JSON.stringify(celdas, null, 2));
  res.send('Salida registrada');
};

module.exports = { registrarEntrada, registrarSalida };