const express = require('express')
const router = express.Router()
const PaymentController = require('../controllers/PaymentController.cjs')

router.post('/payment', PaymentController.payment)
router.get('/bill/:paymentId', PaymentController.generateBill)

module.exports = router
