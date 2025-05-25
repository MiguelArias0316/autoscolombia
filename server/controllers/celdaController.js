const fs = require('fs');
const path = './server/data/celdas.json';

const getCeldas = (req, res) => {
  const data = JSON.parse(fs.readFileSync(path));
  res.json(data);
};

const addCelda = (req, res) => {
  const data = JSON.parse(fs.readFileSync(path));
  const newCelda = {
    id: Date.now(),
    numero: req.body.numero,
    tipo: req.body.tipo,
    estado: 'libre',
    habilitada: true 
  };
  data.push(newCelda);
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  res.json(newCelda);
};

const updateCelda = (req, res) => {
  const data = JSON.parse(fs.readFileSync(path));
  const index = data.findIndex(c => c.id == req.params.id);
  if (index !== -1) {
    data[index] = { ...data[index], ...req.body };
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    res.json(data[index]);
  } else {
    res.status(404).send('Celda no encontrada');
  }
};

const deleteCelda = (req, res) => {
  let data = JSON.parse(fs.readFileSync(path));
  data = data.filter(c => c.id != req.params.id);
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  res.send('Celda eliminada');
};

module.exports = { getCeldas, addCelda, updateCelda, deleteCelda };