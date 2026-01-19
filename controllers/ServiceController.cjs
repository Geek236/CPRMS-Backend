const ServiceModel = require('../models/ServiceModel.cjs');


exports.createService = async (req, res) => {
  try {
    const { ServiceName, ServicePrice, ServiceDescription } = req.body;

    if (!ServiceName) {
      return res.status(400).json({ message: "Service name is required" });
    }

    if (!ServicePrice) {
      return res.status(400).json({ message: "Service price is required" });
    }

    const existingService = await ServiceModel.findOne({ ServiceName });
    if (existingService) {
      return res.status(409).json({ message: "Service already exists" });
    }

    const newService = new ServiceModel({
      ServiceName,
      ServicePrice,
      ServiceDescription
    });

    await newService.save();
    return res.status(201).json({ message: "Service created successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




