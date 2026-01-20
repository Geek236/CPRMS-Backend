const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel.cjs");

exports.register = async (req, res) => {
  const { FullName, Email, password } = req.body;

  try {

    const existingUser = await UserModel.findOne({ Email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

   
    const errors = [];
    if (!FullName) errors.push("Missing fullname");
    if (!Email) errors.push("Missing email");
    if (!password) errors.push("Missing password");

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = new UserModel({
      FullName,
      Email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Couldn't register user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.login = async (req, res) => {
  const { Email, password } = req.body;

  try {
    const existingUser = await UserModel.findOne({ Email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    
  

    
    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.Email,
        username: existingUser.FullName,
        
      },
      process.env.JWT_SECRET || "SECRET_KEY", 
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, message: `Successfully logged in as ${Email}`});
  } catch (error) {
    
    return res.status(500).json({ message: `Service Error ${error}` ,});
  }
};
