const fs = require('fs');
const path = './server/data/vehiculos.json';

const getVehiculos = (req, res) => {
  const data = JSON.parse(fs.readFileSync(path));
  res.json(data);
};

const addVehiculo = (req, res) => {
  const data = JSON.parse(fs.readFileSync(path));
  let { placa, marca, tipo } = req.body;

  if (tipo === 'bicicleta' && (!placa || placa.trim() === '')) {
    placa = 'SIN PLACA';
  }

  const newVehiculo = { id: Date.now(), placa, marca, tipo };
  data.push(newVehiculo);
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  res.json(newVehiculo);
};

const updateVehiculo = (req, res) => {
  const data = JSON.parse(fs.readFileSync(path));
  const index = data.findIndex(v => v.id == req.params.id);
  if (index !== -1) {
    data[index] = { ...data[index], ...req.body };
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    res.json(data[index]);
  } else {
    res.status(404).send('Vehículo no encontrado');
  }
};

const deleteVehiculo = (req, res) => {
  let data = JSON.parse(fs.readFileSync(path));
  const filtered = data.filter(v => v.id != req.params.id);
  fs.writeFileSync(path, JSON.stringify(filtered, null, 2));
  res.send('Vehículo eliminado');
};

module.exports = { getVehiculos, addVehiculo, updateVehiculo, deleteVehiculo };
