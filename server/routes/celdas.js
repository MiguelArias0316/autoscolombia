const express = require('express');
const router = express.Router();
const controller = require('../controllers/celdaController');

router.get('/', controller.getCeldas);
router.post('/', controller.addCelda);
router.put('/:id', controller.updateCelda);
router.delete('/:id', controller.deleteCelda);

module.exports = router;
