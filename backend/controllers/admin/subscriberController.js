const Subscriber = require('../../models/subscriber');

exports.subscribe = async (req, res) => {
    try {
        const { email, source } = req.body;

        // Check if email already exists
        const existingSubscriber = await Subscriber.findOne({ email });

        if (existingSubscriber) {
            // If they previously unsubscribed, reactivate them
            if (existingSubscriber.status === 'Unsubscribed') {
                existingSubscriber.status = 'Subscribed';
                existingSubscriber.source = source || existingSubscriber.source;
                existingSubscriber.unsubscribedAt = null;
                await existingSubscriber.save();
                
                return res.status(200).json({ 
                    success: true, 
                    data: existingSubscriber, 
                    message: "Welcome back! Your subscription has been reactivated." 
                });
            }
            
            return res.status(400).json({ 
                success: false, 
                message: "This email address is already actively subscribed." 
            });
        }

        // Create completely new subscriber
        const newSubscriber = new Subscriber({ email, source });
        await newSubscriber.save();

        res.status(201).json({ 
            success: true, 
            data: newSubscriber, 
            message: "Thank you for subscribing!" 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. READ ALL (Admin Panel - with optional status/source filtering)
exports.getAllSubscribers = async (req, res) => {
    try {
        const { status, source } = req.query;
        let filter = {};

        if (status) filter.status = status;
        if (source) filter.source = source;

        // Sort by newest subscriptions first
        const subscribers = await Subscriber.find(filter).sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            count: subscribers.length, 
            data: subscribers 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. UPDATE / UNSUBSCRIBE (When a user clicks "Unsubscribe" in an email)
exports.unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;

        const subscriber = await Subscriber.findOne({ email });
        if (!subscriber) {
            return res.status(404).json({ success: false, message: "Email not found in subscriber list." });
        }

        if (subscriber.status === 'Unsubscribed') {
            return res.status(400).json({ success: false, message: "Email is already unsubscribed." });
        }

        subscriber.status = 'Unsubscribed';
        subscriber.unsubscribedAt = new Date();
        await subscriber.save();

        res.status(200).json({ 
            success: true, 
            data: subscriber, 
            message: "You have been successfully unsubscribed." 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. DELETE (Admin Panel - permanently wiping a record)
exports.deleteSubscriber = async (req, res) => {
    try {
        const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
        
        if (!subscriber) {
            return res.status(404).json({ success: false, message: "Subscriber record not found." });
        }

        res.status(200).json({ 
            success: true, 
            message: "Subscriber permanently removed from the system." 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. READ Single Subscriber by ID (Admin Panel Detail View)
exports.getSubscriberById = async (req, res) => {
    try {
        const subscriber = await Subscriber.findById(req.params.id);
        
        if (!subscriber) {
            return res.status(404).json({ 
                success: false, 
                message: "Subscriber not found." 
            });
        }

        res.status(200).json({ 
            success: true, 
            data: subscriber 
        });
    } catch (error) {
        // Handle invalid MongoDB ObjectIDs gracefully
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ success: false, message: "Invalid Subscriber ID format." });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};