const fs = require('fs');
const path = './server/data/usuarios.json';

const getUsuarios = (req, res) => {
  const data = JSON.parse(fs.readFileSync(path));
  res.json(data);
};

const addUsuario = (req, res) => {
  const data = JSON.parse(fs.readFileSync(path));
  const newUser = { id: Date.now(), ...req.body };
  data.push(newUser);
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  res.json(newUser);
};

const updateUsuario = (req, res) => {
  const data = JSON.parse(fs.readFileSync(path));
  const index = data.findIndex(u => u.id == req.params.id);
  if (index !== -1) {
    data[index] = { ...data[index], ...req.body };
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
    res.json(data[index]);
  } else {
    res.status(404).send('Usuario no encontrado');
  }
};

const deleteUsuario = (req, res) => {
  let data = JSON.parse(fs.readFileSync(path));
  data = data.filter(u => u.id != req.params.id);
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
  res.send('Usuario eliminado');
};

module.exports = { getUsuarios, addUsuario, updateUsuario, deleteUsuario };