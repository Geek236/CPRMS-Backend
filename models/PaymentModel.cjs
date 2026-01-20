const mongoose= require("mongoose")
const paymentModel= new mongoose.Schema({
    ServiceRecordReference:{type:String,required:true},
    ServiceName:{type:String,required:true},
    ServicePrice:{type:Number,required:true},
    AmountPaid:{type:Number, required: true},
    PaymentDate:{type:String, required:true},
    
})
const PaymentModel= mongoose.model('Payments',paymentModel)
module.exports= PaymentModel;

