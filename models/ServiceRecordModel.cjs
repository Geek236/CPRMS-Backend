const mongoose= require("mongoose")
const ServiceRecord= new mongoose.Schema({
    PlateNumber:{type:String,required:true},
    FullName:{type:String,required:true},
    ServiceName:{type:String,required:true},
    ServicePrice:{type:Number,required:true},
    DateOfService:{type:Date,required:false},
    StatusOfService:{type:Boolean,required:false},
    PaymentStatus:{type:Boolean,required:false},
    ServiceProvider:{type:String,required:false}


})
const ServiceRecordModel= mongoose.model('Service Records', ServiceRecord);
module.exports= ServiceRecordModel;
