const express = require('express');
const router = express.Router();
const controller = require('../controllers/vehiculoController');

router.get('/', controller.getVehiculos);
router.post('/', controller.addVehiculo);
router.put('/:id', controller.updateVehiculo);
router.delete('/:id', controller.deleteVehiculo);

module.exports = router;
