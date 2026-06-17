//controllers/admin/Finance/commissionController.js
const Order = require("../../../models/Order");
const Commission = require("../../../models/Finance/Commission");


// ======================================================
// ADMIN COMMISSION ANALYTICS REPORT
// ======================================================
exports.getCommissionReport = async (req,res)=>{
    try{
        const report = await Commission.aggregate([
            {
                $group:{
                    _id:null,

                    totalCommission:{
                        $sum:"$commissionAmount"
                    },

                    totalGrossAmount:{
                        $sum:"$grossAmount"
                    },

                    totalRecords:{
                        $sum:1
                    },

                    pendingCommission:{
                        $sum:{
                            $cond:[
                                {
                                    $eq:[
                                        "$status",
                                        "Pending"
                                    ]
                                },
                                "$commissionAmount",
                                0
                            ]
                        }
                    },


                    collectedCommission:{
                        $sum:{
                            $cond:[
                                {
                                    $eq:[
                                        "$status",
                                        "Collected"
                                    ]
                                },
                                "$commissionAmount",
                                0
                            ]
                        }
                    }

                }
            }

        ]);
        res.status(200).json({
            success:true,
            report:
            report[0] || {
                totalCommission:0,
                totalGrossAmount:0,
                totalRecords:0,
                pendingCommission:0,
                collectedCommission:0
            }
        });
    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message

        });
    }
};

// ======================================================
// GET ALL COMMISSION LIST
// ======================================================
exports.getAllCommissions = async(req,res)=>{

    try{


        const commissions =
        await Commission.find()

        .populate(
            "orderId",
            "orderNumber totalAmount"
        )

        .populate(
            "vendorOrderId",
            "vendorTotal"
        )

        .populate(
            "vendorId",
            "storeName email"
        )

        .sort({
            createdAt:-1
        });



        res.status(200).json({

            success:true,

            count:commissions.length,

            commissions

        });



    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};

// ======================================================
// SINGLE COMMISSION DETAILS
// ======================================================
exports.getSingleCommission = async(req,res)=>{


    try{


        const commission =
        await Commission.findById(
            req.params.id
        )
        .populate("orderId")
        .populate("vendorOrderId")
        .populate("vendorId");


        if(!commission){

            return res.status(404).json({

                success:false,
                message:"Commission not found"

            });

        }



        res.status(200).json({

            success:true,
            commission

        });



    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};

// ======================================================
// UPDATE COMMISSION STATUS
// ======================================================
exports.updateCommissionStatus = async(req,res)=>{


    try{


        const {
            status
        } = req.body;



        const commission =
        await Commission.findByIdAndUpdate(

            req.params.id,

            {
                status
            },

            {
                new:true
            }

        );


        if(!commission){

            return res.status(404).json({

                success:false,
                message:"Commission not found"

            });

        }



        res.json({

            success:true,

            commission

        });


    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};

