const mongoose= require("mongoose")
const carModel= new mongoose.Schema({
PlateNumber:{type: String, required: true},
CarType:{type:String, required: true},
FullName:{type:String, required: true},


})
const CarModel = mongoose.model('Cars', carModel);
module.exports= CarModel;