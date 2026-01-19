const mongoose= require("mongoose")
const serviceModel= new mongoose.Schema({
    ServiceName:{type:String, required:true},
    ServicePrice:{type:Number,required:true},
    ServiceDescription:{type:String, required:false}
   
})
const ServiceModel= mongoose.model('Services',serviceModel)
module.exports= ServiceModel;
