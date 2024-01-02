const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require('./userModel');
const Art = require('./artModel');
const Workshop = require('./workshopModel');

router.get("/:username", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user.id });
        const artist = await User.findOne({ username: req.params.username });
        const liked = user.liked;

        const following = [];
        for(let i = 0; i < user.following.length; i++) {
            const followingUser = await User.findOne({ _id: user.following[i] });
            following.push(followingUser);
        }

        const likedartworks = await Art.find({ _id: { $in: liked } });
        const workshops = await Workshop.find({ _id: { $in: artist.createdWorkshops } });
        res.render('user', { title: 'User', user: user, req: req, artist: artist , workshops: workshops, artworks: artist.artworks, liked: likedartworks, following: following});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/liked", async (req, res) => {
    try {
        const liked = req.session.user.liked;
        const artworks = await Art.find({ _id: { $in: liked } });
        res.render('liked', { title: 'Liked', user: req.session.user, artworks: artworks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/reviews", async (req, res) => {
    try {
        const reviews = req.session.user.reviews;
        const artworks = await Art.find({ _id: { $in: reviews } });
        res.render('reviews', { title: 'Reviews', user: req.session.user, artworks: artworks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/notifications", async (req, res) => {
    try {
        const notifications = req.session.user.notifications;
        res.render('notifications', { title: 'Notifications', user: req.session.user, notifications: notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/upgrade", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user.id });
        user.accountType = "artist";
        await user.save();
        req.session.user.accountType = "artist";
        res.status(200).json({ message: "Upgraded" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/downgrade", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user.id });
        console.log(user);
        console.log(req.session.user._id);
        console.log(req.session.user);
        user.accountType = "patron";
        await user.save();
        req.session.user.accountType = "patron";
        res.status(200).json({ message: "Downgraded" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/follow", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user.id });
        const artist = await User.findOne({ _id: req.body._id});
        console.log(artist._id);
        user.following.push(req.body._id);
        artist.followers.push(req.session.user.id);
        await user.save();
        await artist.save();
        res.status(200).json({ message: "Followed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/unfollow", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.session.user.id });
        const artist = await User.findOne({ _id: req.body._id});
        user.following = user.following.filter(id => id != req.body._id);
        artist.followers = artist.followers.filter(id => id != req.session.user.id);
        await user.save();
        await artist.save();
        res.status(200).json({ message: "Unfollowed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/checkIfArtistExists", async (req, res) => {
    console.log(req.query.username);
    try {
        const existingUser = await User.findOne({ username: req.query.username, accountType: "artist" });
    
        if (existingUser) {
          // User with the specified username exists
          res.status(200).json({ exists: true });
        } else {
          // User with the specified username does not exist
          res.status(200).json({ exists: false });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
module.exports = router;