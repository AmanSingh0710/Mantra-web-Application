const mongoose = require("mongoose");

const settlementSchema =
new mongoose.Schema(
{
  settlementNumber:{
    type:String,
    unique:true,
    index:true
  },

  orderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Order",
    required:true
  },

  vendorOrderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"VendorOrder",
    required:true
  },

  vendorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Store",
    required:true
  },

  grossAmount:{
    type:Number,
    required:true
  },

  commission:{
    type:Number,
    default:0
  },

  tax:{
    type:Number,
    default:0
  },

  netAmount:{
    type:Number,
    required:true
  },

  status:{
    type:String,
    enum:[
      "Pending",
      "Released",
      "Failed"
    ],
    default:"Pending"
  },

  releasedAt:{
    type:Date,
    default:null
  }
},
{
  timestamps:true
}
);

settlementSchema.pre(
"save",
function(next){

 if(!this.settlementNumber){

   this.settlementNumber =
   "SET-" +
   Date.now() +
   "-" +
   Math.floor(
   Math.random()*1000
   );

 }

 next();

});

module.exports =
mongoose.model(
"Settlement",
settlementSchema
);