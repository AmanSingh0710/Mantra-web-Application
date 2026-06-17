const User = require("../../models/User");
const Order = require("../../models/Order");
const Notification = require("../../models/Notification/SendNotification");
const Visitor = require("../../models/Visitor");

exports.getNavbarData = async (req, res) => {
    try {

        const admin = await User.findById(req.user.id)
            .select("name email image imagePublicId role");

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        // Pending Orders
        const pendingOrders = await Order.countDocuments({
            orderStatus: "PENDING"
        });

        // Unread Notifications
        const notifications = await Notification.countDocuments({
            $or: [
                {
                    user: req.user.id,
                    isRead: false
                },
                {
                    isGlobal: true,
                    isRead: false
                }
            ]
        });

        // Today's Visitors
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayVisitors = await Visitor.countDocuments({
            createdAt: {
                $gte: todayStart
            }
        });

        // Online Users (last 15 min active)
        const onlineUsers = await User.countDocuments({
            lastLogin: {
                $gte: new Date(Date.now() - 15 * 60 * 1000)
            }
        });

        // language
        const admin = await User.findById(req.user.id)
            .select(
                "name email image language role"
            );

        res.status(200).json({
            success: true,

            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                image: admin.image,
                imagePublicId: admin.imagePublicId,
                role: admin.role
            },

            notifications,

            pendingOrders,

            onlineUsers,

            stats: {
                todayVisitors
            },

            language: admin.language
        });

    } catch (error) {
        console.error("Navbar Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};