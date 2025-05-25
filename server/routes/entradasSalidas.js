const express = require('express');
const router = express.Router();
const controller = require('../controllers/entradaSalidaController');

router.post('/entradas', controller.registrarEntrada);
router.post('/salidas', controller.registrarSalida);

module.exports = router;