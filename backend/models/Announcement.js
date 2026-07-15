// models/Announcement.js

const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
{
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },

    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300
    },

    buttonText: {
        type: String,
        default: ""
    },

    redirectUrl: {
        type: String,
        default: ""
    },

    desktopImage: {
        publicId: String,
        url: String
    },

    mobileImage: {
        publicId: String,
        url: String
    },

    backgroundColor: {
        type: String,
        default: "#131921"
    },

    textColor: {
        type: String,
        default: "#ffffff"
    },

    priority: {
        type: Number,
        default: 0,
        index: true
    },

    startDate: Date,

    endDate: Date,

    isActive: {
        type: Boolean,
        default: true,
        index: true
    },

    isDeleted: {
        type: Boolean,
        default: false
    }

},
{
    timestamps: true
});

module.exports = mongoose.model("Announcement", announcementSchema);