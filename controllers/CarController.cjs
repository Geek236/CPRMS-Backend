const CarModel = require("../models/CarModel.cjs");
const UserModel = require("../models/UserModel.cjs");

exports.getSpecifiCar = async (req, res) => {
  try {
    const { FullName } = req.body;

    if (!FullName) return res.status(400).json({ message: "Input a valid name" });

    const existingUser = await UserModel.findOne({ FullName });
    if (!existingUser) {
      return res.status(404).json({ message: `No user found with name ${FullName}` });
    }

    const cars = await CarModel.find({ FullName });
    if (!cars.length) {
      return res.status(404).json({ message: `No cars registered for ${FullName}` });
    }

    return res.status(200).json({ cars });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

exports.registerCar = async (req, res) => {
  try {
    const { PlateNumber, CarType, FullName,  } = req.body;

    if (!PlateNumber) return res.status(400).json({ message: "No Plate number found" });
    if (!CarType) return res.status(400).json({ message: "No Car Type inputed" });
    if (!FullName) return res.status(400).json({ message: "Please Input A Valid Name" });
   
    const ExistingUser = await UserModel.findOne({ FullName });
    if (!ExistingUser) {
      return res.status(400).json({
        message: `There is no User Found ${FullName} Registered in the system`
      });
    }

    const ExistingCar = await CarModel.findOne({ PlateNumber });
    if (ExistingCar) {
      return res.status(400).json({
        message: `Car with Plate Number ${PlateNumber} is Already Registered`
      });
    }

    const NewCar = new CarModel({
      PlateNumber,
      CarType,
      FullName,
      
    });

    await NewCar.save();
    return res.status(201).json({ message: "Car registered successfully" });

  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
};


exports.getAllCars = async (req, res) => {
  try {
    const cars = await CarModel.find({});
    return res.status(200).json({ cars });
  } catch (err) {
    return res.status(500).json({ message: "Server error", err });
  }
};
