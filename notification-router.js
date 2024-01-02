const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require('./userModel');
const Art = require('./artModel');

router.get("/" , async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user.id });
        const notifications = user.notifications;
        res.render('notifications', { title: 'Notification', user: user, notifications: notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;