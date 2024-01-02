const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require('./userModel');
const Art = require('./artModel');


router.get("/:id", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user.id });
        const artwork = await Art.findOne({_id: req.params.id});

        res.render('art', { title: 'Art', user: user, artwork: artwork});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;