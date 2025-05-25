const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const usuarioRoutes = require('./routes/usuarios');
const celdaRoutes = require('./routes/celdas');
const vehiculoRoutes = require('./routes/vehiculos');
const entradaSalidaRoutes = require('./routes/entradasSalidas');


app.use('/usuarios', usuarioRoutes);
app.use('/celdas', celdaRoutes);
app.use('/vehiculos', vehiculoRoutes);
app.use('/', entradaSalidaRoutes);

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
