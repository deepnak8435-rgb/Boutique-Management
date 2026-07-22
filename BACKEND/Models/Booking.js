const mongoose =require('mongoose');
const bookingSchema=new mongoose.Schema({
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    slot:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Slot',
        required:true
    },
    status:{
        type:String,
        enum:["pending","confirmed","cancelled"],
        default:"pending"
    },
    createAt:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('Booking',bookingSchema)