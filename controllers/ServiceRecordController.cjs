const UserModel = require('../models/UserModel.cjs')
const CarModel = require('../models/CarModel.cjs')
const ServiceModel = require('../models/ServiceModel.cjs')
const ServiceRecordModel = require('../models/ServiceRecordModel.cjs')
const PaymentModel = require('../models/PaymentModel.cjs')

exports.createRecord = async (req, res) => {
  const { PlateNumber, FullName, ServiceName, DateOfService } = req.body

  try {
    if (!PlateNumber) return res.status(400).json({ message: "Input Valid Plate" })
    if (!FullName) return res.status(400).json({ message: "Input Owner of Car" })
    if (!ServiceName) return res.status(400).json({ message: "Input Service" })

    const parsedDate = new Date(DateOfService)
    if (isNaN(parsedDate.getTime()))
      return res.status(400).json({ message: "Invalid date format" })

    parsedDate.setHours(0, 0, 0, 0)

    const ExistingCar = await CarModel.findOne({ PlateNumber })
    const ExistingUser = await UserModel.findOne({ FullName })
    const Service = await ServiceModel.findOne({ ServiceName })

    if (!ExistingCar) return res.status(400).json({ message: `No Car Found With plate Number ${PlateNumber}` })
    if (!ExistingUser) return res.status(400).json({ message: `No User Found ${FullName}` })
    if (!Service) return res.status(400).json({ message: `There is no Service provided ${ServiceName}` })

    const DeclaredService = await ServiceRecordModel.findOne({
      PlateNumber,
      FullName,
      ServiceName,
      DateOfService: parsedDate
    })

    if (DeclaredService) {
      return res.status(400).json({
        message: `There is a ${ServiceName} On Car ${PlateNumber} Issued on the Date of ${DateOfService}`
      })
    }

    const NewService = new ServiceRecordModel({
      PlateNumber,
      FullName,
      ServiceName,
      ServicePrice: Service.ServicePrice,
      DateOfService: parsedDate,
      StatusOfService: false,
      PaymentStatus: false
    })

    await NewService.save()
    return res.status(201).json({ message: "Successfully Created Record" })

  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message })
  }
}

exports.approveRecord = async (req, res) => {
  try {
    const { ServiceRecordId, Approval, UserRegisterer } = req.body

    if (!ServiceRecordId)
      return res.status(400).json({ message: "Input Record To Be Approved" })

    if (Approval !== true && Approval !== false)
      return res.status(400).json({ message: "Enter a valid Approval (true/false)" })

    if (!UserRegisterer)
      return res.status(400).json({ message: "Enter Registerer" })

    const existingServiceRecord = await ServiceRecordModel.findById(ServiceRecordId)
    if (!existingServiceRecord)
      return res.status(400).json({ message: "Non Existent Service" })

    existingServiceRecord.StatusOfService = Approval
    existingServiceRecord.ServiceProvider = UserRegisterer

    await existingServiceRecord.save()
    return res.status(200).json({ message: "Service Record Approved Successfully" })

  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message })
  }
}

exports.getRecordsByUser = async (req, res) => {
  try {
    const { FullName } = req.body
    if (!FullName) return res.status(400).json({ message: "Input a valid FullName" })

    const records = await ServiceRecordModel.find({ FullName })
    if (!records.length)
      return res.status(404).json({ message: "No service records found" })

    return res.status(200).json({ records })

  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message })
  }
}

exports.updateRecord = async (req, res) => {
  try {
    const { ServiceRecordId, updates } = req.body
    if (!ServiceRecordId)
      return res.status(400).json({ message: "ServiceRecordId is required" })

    const updatedRecord = await ServiceRecordModel.findByIdAndUpdate(
      ServiceRecordId,
      updates,
      { new: true }
    )

    if (!updatedRecord)
      return res.status(404).json({ message: "Record not found" })

    return res.status(200).json({
      message: "Record updated successfully",
      updatedRecord
    })

  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message })
  }
}

exports.deleteRecord = async (req, res) => {
  try {
    const { ServiceRecordId } = req.body
    if (!ServiceRecordId)
      return res.status(400).json({ message: "ServiceRecordId is required" })

    const deletedRecord = await ServiceRecordModel.findByIdAndDelete(ServiceRecordId)
    if (!deletedRecord)
      return res.status(404).json({ message: "Record not found" })

    return res.status(200).json({ message: "Record deleted successfully" })

  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message })
  }
}
