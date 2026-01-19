const express = require("express");
const router = express.Router();
const Service = require("../controllers/ServiceController.cjs"); 


router.post("/create", Service.createService);

module.exports = router;
