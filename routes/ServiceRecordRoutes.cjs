const express = require("express");
const router = express.Router();
const Service = require("../controllers/ServiceRecordController.cjs");


router.post("/createRecord", Service.createRecord);


router.post("/approveRecord", Service.approveRecord);


router.post("/getRecordsByUser", Service.getRecordsByUser);


router.put("/updateRecord", Service.updateRecord);


router.delete("/deleteRecord", Service.deleteRecord);

module.exports = router;
