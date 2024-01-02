const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require('./userModel');
const Art = require('./artModel');
const Workshop = require('./workshopModel');

// Define the createWorkshop route first
router.get("/createWorkshop", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user.id });
        res.render('createWorkshop', { title: 'Create', user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Define the generic route with :id parameter later
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user.id });
        const workshop = await Workshop.findOne({ _id: req.params.id });
        res.render('workshop', { title: 'Workshop', user: user, workshop: workshop });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post("/createWorkshop", async (req, res) => {
    try {
        console.log(req.body);
        const user = await User.findOne({ _id: req.session.user.id });

        const { title, description} = req.body;

        const newWorkshop = new Workshop({
            Title: title,
            Artist: user.username,
            Description: description,
            enrollments: [],
        });

        user.createdWorkshops.push(newWorkshop._id);
        await user.save();
        await newWorkshop.save();

        for(let i = 0; i < user.followers.length; i++) {
            const follower = await User.findOne({ _id: user.followers[i] });
            follower.notifications.push(user.username + " has posted a new workshop.");
            await follower.save();
        }
        res.status(200).json({ message: "Workshop created", workshopId: newWorkshop._id});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/joinWorkshop", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user.id });
        const workshop = await Workshop.findOne({ _id: req.body.workshopId });
        workshop.enrollments.push(user);
        await workshop.save();
        user.joinedWorkshops.push(workshop._id);
        await user.save();
        res.status(200).json({ message: "Joined" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/leaveWorkshop", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user.id });
        const workshop = await Workshop.findOne({ _id: req.body.workshopId });
        workshop.enrollments.splice(workshop.enrollments.indexOf(user.username), 1);
        await workshop.save();
        user.joinedWorkshops.splice(user.joinedWorkshops.indexOf(workshop._id), 1);
        await user.save();
        res.status(200).json({ message: "Left" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;