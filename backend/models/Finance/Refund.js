const mongoose =
require("mongoose");

const refundSchema =
new mongoose.Schema(
{
  refundNumber:{
    type:String,
    unique:true,
    index:true
  },

  orderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Order",
    required:true
  },

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  amount:{
    type:Number,
    required:true
  },

  reason:{
    type:String,
    default:""
  },

  status:{
    type:String,
    enum:[
      "Pending",
      "Approved",
      "Rejected",
      "Processed"
    ],
    default:"Pending"
  },

  paymentMethod:{
    type:String,
    enum:[
      "Wallet",
      "Original Source"
    ],
    default:"Wallet"
  },

  transactionId:{
    type:String,
    default:""
  },

  approvedBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    default:null
  },

  processedAt:{
    type:Date,
    default:null
  }
},
{
  timestamps:true
}
);

refundSchema.pre(
"save",
function(next){

 if(!this.refundNumber){

   this.refundNumber =
   "REF-" +
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
"Refund",
refundSchema
);