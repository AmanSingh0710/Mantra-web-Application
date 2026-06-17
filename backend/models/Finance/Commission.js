//models/Finance/commissionSchema.js

const mongoose = require("mongoose");

const commissionSchema = new mongoose.Schema(
{
  commissionNumber:{
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

  commissionType:{
    type:String,
    enum:[
      "Percentage",
      "Flat"
    ],
    default:"Percentage"
  },

  commissionRate:{
    type:Number,
    default:10
  },

  grossAmount:{
    type:Number,
    required:true
  },

  commissionAmount:{
    type:Number,
    required:true
  },

  status:{
    type:String,
    enum:[
      "Pending",
      "Collected"
    ],
    default:"Collected"
  }
},
{
  timestamps:true
}
);

commissionSchema.pre(
"save",
function(next){

 if(!this.commissionNumber){

   this.commissionNumber =
   "COM-" +
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
"Commission",
commissionSchema
);