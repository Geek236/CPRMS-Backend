const express = require("express");
const router = express.Router();
const CarController= require('../controllers/CarController.cjs')

router.post('/registerCar',CarController.registerCar)
router.post('/SpecificCar',CarController.getSpecifiCar)


module.exports = router;
