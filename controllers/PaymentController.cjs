const PaymentModel = require('../models/PaymentModel.cjs')
const ServiceRecordModel = require('../models/ServiceRecordModel.cjs')
const ServiceModel = require('../models/ServiceModel.cjs')
const { default: UserModel } = require('../models/UserModel.cjs')

exports.payment = async (req, res) => {
  try {
    const {
      ServiceRecordReference,
      AmountPaid,
      PaymentDate,
      
    } = req.body

    if (!ServiceRecordReference)
      return res.status(400).json({ message: "No Reference inputed" })

    if (AmountPaid === undefined)
      return res.status(400).json({ message: "No Amount inputed" })

  

    const existingRecord = await ServiceRecordModel.findById(ServiceRecordReference)
    if (!existingRecord)
      return res.status(404).json({ message: "Service record not found" })

    if (!existingRecord.StatusOfService)
      return res.status(400).json({ message: "Service is not approved yet" })

    const existingPayment = await PaymentModel.findOne({ ServiceRecordReference })
    if (existingPayment)
      return res.status(400).json({ message: "Payment already recorded" })

    const service = await ServiceModel.findOne({ ServiceName: existingRecord.ServiceName })
    if (!service)
      return res.status(404).json({ message: "Service not found" })

    const newPayment = new PaymentModel({
      ServiceRecordReference,
      ServiceName: service.ServiceName,
      ServicePrice: service.ServicePrice,
      AmountPaid,
      PaymentDate,
     
    })

    await newPayment.save()
    existingRecord.PaymentStatus=true
    await existingRecord.save()

    return res.status(201).json({
      message: "Payment recorded successfully",
      ServicePrice: service.ServicePrice,
      paymentId: newPayment._id
    })

  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message })
  }
}

exports.generateBill = async (req, res) => {
  try {
    const { paymentId } = req.params

    if (!paymentId)
      return res.status(400).json({ message: "Payment ID is required" })

    const payment = await PaymentModel.findById(paymentId)
    if (!payment)
      return res.status(404).json({ message: "Payment not found" })

    const serviceRecord = await ServiceRecordModel.findById(payment.ServiceRecordReference)
    if (!serviceRecord)
      return res.status(404).json({ message: "Service record not found" })

    const service = await ServiceModel.findOne({ ServiceName: serviceRecord.ServiceName })
    if (!service)
      return res.status(404).json({ message: "Service not found" })

    return res.status(200).json({
      bill: {
        PlateNumber: serviceRecord.PlateNumber,
        ServiceName: service.ServiceName,
        ServicePrice: service.ServicePrice,
        AmountPaid: payment.AmountPaid,
        RecipientName: payment.RecipientName,
        PaymentDate: payment.PaymentDate
      }
    })

  } catch (err) {
    return res.status(500).json({ message: "Server Error", err })
  }
}
exports.getPaymentId = async (req, res) => {
  try {
    const { ServiceRecordId } = req.body

    if (!ServiceRecordId) {
      return res.status(400).json({ message: "ServiceRecordId is required" })
    }

    const payment = await PaymentModel.findOne({
      ServiceRecordReference: ServiceRecordId
    })

    if (!payment) {
      return res.status(404).json({ message: "Payment not found for this service record" })
    }

    return res.status(200).json({
      paymentId: payment._id
    })

  } catch (err) {
    return res.status(500).json({ message: "Server Error", err })
  }
}
