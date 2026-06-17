const Order = require("../../../models/Order");
const Store = require("../../../models/Store");
const Wallet = require("../../../models/Finance/Wallet");
const WalletTransaction = require("../../../models/Finance/WalletTransaction");
const PayoutRequest = require("../../../models/Finance/PayoutRequest");

exports.releaseVendorSettlement = async (req, res) => {
    try {

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.status !== "Delivered") {
            return res.status(400).json({
                success: false,
                message: "Order must be delivered"
            });
        }

        const settlementAmount =
            order.pricing.grandTotal -
            order.pricing.adminCommission;

        const vendorIds = [
            ...new Set(
                order.products.map(
                    p => p.storeId.toString()
                )
            )
        ];

        for (const vendorId of vendorIds) {

            const store =
                await Store.findById(vendorId);

            if (!store) continue;

            store.pendingEarnings =
                Math.max(
                    0,
                    store.pendingEarnings -
                    settlementAmount
                );

            store.walletBalance +=
                settlementAmount;

            store.totalEarnings +=
                settlementAmount;

            await store.save();

            let wallet =
                await Wallet.findOne({
                    userId: store._id,
                    userType: "Store"
                });

            if (!wallet) {

                wallet =
                    await Wallet.create({
                        userId: store._id,
                        userType: "Store"
                    });

            }

            const before =
                wallet.balance;

            wallet.balance +=
                settlementAmount;

            wallet.totalCredited +=
                settlementAmount;

            await wallet.save();

            await WalletTransaction.create({

                walletId:
                    wallet._id,

                type:
                    "CREDIT",

                amount:
                    settlementAmount,

                source:
                    "SETTLEMENT",

                sourceId:
                    order._id,

                description:
                    `Settlement for ${order.orderNumber}`,

                balanceBefore:
                    before,

                balanceAfter:
                    wallet.balance
            });

        }

        res.status(200).json({
            success: true,
            message:
                "Settlement released"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message:
                error.message
        });

    }
};

exports.requestVendorPayout = async (req, res) => {

    try {

        const vendor =
            await Store.findById(
                req.user.storeId
            );

        const { amount } =
            req.body;

        if (
            amount >
            vendor.walletBalance
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Insufficient balance"
            });

        }

        const payout =
            await PayoutRequest.create({

                vendorId:
                    vendor._id,

                amount,

                bankDetails: {

                    accountHolderName:
                        vendor.accountHolderName,

                    bankName:
                        vendor.bankName,

                    accountNumber:
                        vendor.accountNumber,

                    ifscCode:
                        vendor.ifscCode

                }

            });

        res.status(201).json({
            success: true,
            payout
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

exports.approveVendorPayout = async (req, res) => {

    try {

        const payout =
            await PayoutRequest.findById(
                req.params.id
            );

        if (!payout) {

            return res.status(404).json({
                success: false,
                message:
                    "Payout not found"
            });

        }

        payout.status =
            "APPROVED";

        payout.approvedBy =
            req.user.id;

        payout.approvedAt =
            new Date();

        await payout.save();

        res.status(200).json({
            success: true,
            payout
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

exports.rejectVendorPayout = async (req, res) => {

    try {

        const payout =
            await PayoutRequest.findById(
                req.params.id
            );

        if (!payout) {

            return res.status(404).json({
                success: false,
                message:
                    "Payout not found"
            });

        }

        payout.status =
            "REJECTED";

        await payout.save();

        res.status(200).json({
            success: true,
            payout
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};