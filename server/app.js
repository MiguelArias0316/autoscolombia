// server/index.js
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

const registros = [];
const pagos = [];

app.post('/entrada', (req, res) => {
  const { placa, tipo, color, marca, celda, horaEntrada, usuario, observaciones } = req.body;
  const entrada = {
    id: registros.length + 1,
    placa, tipo, color, marca, celda, horaEntrada, usuario, observaciones,
    salida: null, tiempo: null, valor: null
  };
  registros.push(entrada);
  res.status(201).json({ mensaje: 'Entrada registrada', entrada });
});

app.post('/salida', (req, res) => {
  const { placa, horaSalida } = req.body;
  const registro = registros.find(r => r.placa === placa && !r.salida);
  if (!registro) return res.status(404).json({ mensaje: 'Vehículo no encontrado o ya salió' });

  registro.salida = horaSalida;
  const entradaDate = new Date(registro.horaEntrada);
  const salidaDate = new Date(horaSalida);
  const msDiff = salidaDate - entradaDate;
  const horas = Math.ceil(msDiff / (1000 * 60 * 60));
  registro.tiempo = `${horas}h`;
  registro.valor = horas * 5000;

  pagos.push({ placa, fecha: horaSalida, valor: registro.valor });
  res.json({ mensaje: 'Salida registrada', registro });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});