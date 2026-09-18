const mongoose =require("mongoose")
require("dotenv").config();
const Service=require("./models/Service")

mongoose.connect(process.env.MONGO_URI)
.then(async ()=>{
   console.log("conneced");
   const testServices=new Service({
    name:"blouse stitching",
    description:"custom fitted blouse",
    duration:60,
    price:800
   });
   const saved=await testServices.save();
   console.log("saved successfully",saved);
   mongoose.connection.close();
   
    
})